import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { ElevenLabsClient } from 'elevenlabs';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { randomUUID } from 'crypto';
import { basename } from 'path';
import {
  VoiceoverRequest,
  VoiceoverResponse,
  VoiceoverDiagnostic,
  ElevenLabsVoice,
} from './voiceover.types';

@Injectable()
export class VoiceoverService {
  private readonly ai: GoogleGenAI;
  private readonly elevenlabs: ElevenLabsClient;
  private readonly outputDir: string;
  private readonly ttsModelId: string;
  private readonly ttsLanguageCode: string;
  private readonly publicBaseUrl: string;
  private voicesCache: ElevenLabsVoice[] | null = null;
  private voicesCacheTime = 0;
  private readonly voicesCacheTtl = 30 * 60 * 1000; // 30 minutes
  private readonly languageEnforcedModels = new Set([
    'eleven_flash_v2_5',
    'eleven_turbo_v2_5',
  ]);

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

    // ElevenLabs SDK auto-reads ELEVENLABS_API_KEY from process.env
    this.elevenlabs = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });
    this.ttsModelId =
      process.env.ELEVENLABS_TTS_MODEL_ID?.trim() || 'eleven_flash_v2_5';
    this.ttsLanguageCode =
      process.env.ELEVENLABS_TTS_LANGUAGE_CODE?.trim() || 'vi';
    this.publicBaseUrl = this.resolvePublicBaseUrl();

    this.outputDir = this.resolveOutputDir();
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
  }

  // ─── Public API ─────────────────────────────────────────────────────────

  /**
   * Generate a full Vietnamese voiceover.
   *
   * PRIMARY PATH (narrationText provided):
   *   The AI video generation already produced the narration script in the
   *   same Gemini prompt as the scenes. We skip Gemini entirely and go
   *   straight to ElevenLabs TTS. This ensures the voiceover matches the
   *   video content perfectly — one prompt, one voice.
   *
   * FALLBACK PATH (narrationText not provided):
   *   Generate narration via a separate Gemini call using description/scenes.
   */
  async generateVoiceover(
    request: VoiceoverRequest,
  ): Promise<VoiceoverResponse> {
    // Step 1: Get narration text (use pre-generated or fallback to Gemini)
    let narrationText: string;
    if (request.narrationText && request.narrationText.trim().length > 0) {
      narrationText = request.narrationText.trim();
      console.log(
        `[Voiceover] Using pre-generated narration from AI (${narrationText.length} chars)`,
      );
    } else {
      // Fallback: generate narration with Gemini
      console.log(
        '[Voiceover] No narrationText provided, generating with Gemini...',
      );
      narrationText = await this.generateNarration(request);
    }

    // Step 2: Pick a Vietnamese-capable voice
    const voice = await this.resolveVietnameseVoice(request.voiceId);

    // Step 3: Convert text to speech via ElevenLabs SDK
    const { audioUrl, duration } = await this.textToSpeech(
      narrationText,
      voice.voice_id,
    );

    return {
      audioUrl,
      narrationText,
      duration,
      voiceId: voice.voice_id,
      voiceName: voice.name,
    };
  }

  /**
   * Diagnostic: test the ElevenLabs API key using the SDK.
   */
  async verifyApiKey(): Promise<VoiceoverDiagnostic> {
    const apiKey = process.env.ELEVENLABS_API_KEY?.trim() || '';
    const endpoint = 'ElevenLabs SDK: voices.getAll()';
    const keyPrefix = apiKey ? `${apiKey.slice(0, 8)}...` : '(empty)';

    if (!apiKey) {
      return {
        keyValid: false,
        statusCode: null,
        errorMessage: 'ELEVENLABS_API_KEY chưa được cấu hình trong file .env',
        voiceCount: 0,
        endpoint,
        keyPrefix,
      };
    }

    try {
      const voicesResult = await this.elevenlabs.voices.getAll();
      const voiceCount = voicesResult.voices?.length || 0;
      console.log(
        `[Voiceover] Key verification SUCCESS via SDK — ${voiceCount} voices available`,
      );
      return {
        keyValid: true,
        statusCode: 200,
        errorMessage: null,
        voiceCount,
        endpoint,
        keyPrefix,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const statusCode = this.extractStatusCode(error);
      console.error(
        `[Voiceover] Key verification FAILED via SDK — HTTP ${statusCode || '?'}: ${message.slice(0, 300)}`,
      );
      return {
        keyValid: false,
        statusCode,
        errorMessage: `HTTP ${statusCode || 'network error'}: ${message.slice(0, 300)}`,
        voiceCount: 0,
        endpoint,
        keyPrefix,
      };
    }
  }

  /**
   * List all ElevenLabs voices via SDK (cached for 30 minutes).
   */
  async getVietnameseVoices(): Promise<ElevenLabsVoice[]> {
    if (
      this.voicesCache &&
      Date.now() - this.voicesCacheTime < this.voicesCacheTtl
    ) {
      return this.voicesCache;
    }

    try {
      const result = await this.elevenlabs.voices.getAll();
      const allVoices: ElevenLabsVoice[] = (result.voices || []).map((v) => ({
        voice_id: v.voice_id,
        name: v.name ?? 'Unknown',
        labels: v.labels,
        category: v.category,
        description: v.description,
      }));

      // Priority 1: voices labeled as Vietnamese
      const vnVoices = allVoices.filter((v) => {
        const lang = v.labels?.language?.toLowerCase() || '';
        const accent = v.labels?.accent?.toLowerCase() || '';
        return (
          lang === 'vi' ||
          lang === 'vietnamese' ||
          accent === 'vietnamese' ||
          accent === 'vi'
        );
      });

      // Priority 2: premade voices. Vietnamese pronunciation is enforced by
      // the TTS model/language_code, not by a voice label.
      const premadeVoices = allVoices.filter((v) => v.category === 'premade');

      // Merge: Vietnamese-specific first, then premade, deduplicated
      const seen = new Set<string>();
      const merged: ElevenLabsVoice[] = [];
      for (const v of [...vnVoices, ...premadeVoices]) {
        if (!seen.has(v.voice_id)) {
          seen.add(v.voice_id);
          merged.push(v);
        }
      }

      if (merged.length > 0) {
        console.log(
          `[Voiceover] Found ${merged.length} voices via SDK ` +
            `(${vnVoices.length} VN-specific, ${premadeVoices.length} premade)`,
        );
        this.voicesCache = merged;
        this.voicesCacheTime = Date.now();
        return merged;
      }

      // No premade voices — return all
      console.warn('[Voiceover] No premade voices found, returning all voices');
      this.voicesCache = allVoices;
      this.voicesCacheTime = Date.now();
      return allVoices;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('[Voiceover] Failed to fetch voices via SDK:', message);

      // Auth errors → empty list (caller must fix key)
      if (this.isAuthError(error)) {
        this.voicesCache = [];
        this.voicesCacheTime = Date.now();
        return [];
      }

      // Network errors → return empty, no fake IDs
      console.warn(
        '[Voiceover] Network error fetching voices, returning empty list',
      );
      return [];
    }
  }

  // ─── Gemini Model Configuration ─────────────────────────────────────────

  /**
   * Ordered list of Gemini models to try. The first model that responds
   * successfully wins. If a model returns a transient error (503/429), we
   * retry with backoff before falling through to the next model.
   */
  private readonly geminiModels = [
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
  ];

  // ─── Narration Generation (Gemini) ───────────────────────────────────────

  /**
   * FALLBACK: Generate narration via Gemini when no pre-generated text is provided.
   * The primary path uses narrationText from the AI video generation step.
   */
  private async generateNarration(request: VoiceoverRequest): Promise<string> {
    const durationSec = parseInt(request.duration || '30') || 30;
    const tone = request.tone || 'Professional';
    const title = request.title || 'Video';
    const description = request.description || title;

    // Vietnamese natural speech rate: ~2 words/second for comfortable pacing
    const targetWords = Math.max(20, Math.round(durationSec * 2.0));

    const sceneContext = this.buildSceneContext(request);

    const prompt = `Bạn là một biên kịch viên lồng tiếng (voiceover scriptwriter) chuyên nghiệp người Việt Nam.
Hãy viết một đoạn lời dẫn (narration script) bằng TIẾNG VIỆT để đọc lồng tiếng cho một video.

THÔNG TIN VIDEO:
- Tiêu đề: ${title}
- Mô tả: ${description}
- Giọng điệu (tone): ${tone}
- Thời lượng video: ${durationSec} giây
- Số từ mục tiêu: khoảng ${targetWords} từ tiếng Việt
${sceneContext}

YÊU CẦU:
1. Viết HOÀN TOÀN bằng tiếng Việt, tự nhiên, dễ đọc, giàu cảm xúc phù hợp với giọng điệu "${tone}".
2. Độ dài KHOẢNG ${targetWords} từ - vừa đủ để đọc trong ${durationSec} giây với tốc độ nói tự nhiên của tiếng Việt (khoảng 2-2.5 từ/giây).
3. Văn phong phù hợp để ĐỌC THÀNH TIẾNG (spoken word), không phải văn viết. Dùng câu ngắn gọn, dễ ngắt nghỉ.
4. Không dùng ký hiệu đặc biệt, markdown, dấu ngoặc vuông, hay chú thích.
5. Chỉ trả về ĐOẠN VĂN BẢN, không thêm bất kỳ lời dẫn hay giải thích nào.
6. Nếu video có nhiều scene/phân cảnh, hãy viết lời dẫn liền mạch kết nối các scene một cách tự nhiên.

QUAN TRỌNG: Chỉ trả về đoạn text tiếng Việt, không kèm theo bất kỳ nội dung nào khác.`;

    if (!process.env.GEMINI_API_KEY) {
      throw new InternalServerErrorException(
        'GEMINI_API_KEY chưa được cấu hình. Vui lòng thêm vào file .env.',
      );
    }

    const narrationText = await this.callGeminiWithRetry(prompt);
    if (!narrationText) {
      throw new InternalServerErrorException(
        'Không thể tạo lời dẫn: tất cả mô hình Gemini đều không phản hồi.',
      );
    }
    return narrationText;
  }

  /**
   * Try each Gemini model in order, with per-model retry for transient errors.
   * Returns the generated text or null if all models failed.
   */
  private async callGeminiWithRetry(prompt: string): Promise<string | null> {
    let lastError: Error | null = null;

    for (const model of this.geminiModels) {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          console.log(
            `[Voiceover] Calling Gemini model="${model}" attempt=${attempt + 1}/3`,
          );
          const response = await this.ai.models.generateContent({
            model,
            contents: prompt,
          });

          const text = response.text?.trim();
          if (text) {
            console.log(
              `[Voiceover] Success with model="${model}" (${text.length} chars)`,
            );
            return text;
          }

          console.warn(`[Voiceover] Model "${model}" returned empty text`);
          lastError = new Error(`Model "${model}" returned empty response`);
          break;
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error));
          const message = err.message || '';
          const isTransient =
            message.includes('503') ||
            message.includes('429') ||
            message.includes('UNAVAILABLE') ||
            message.includes('RESOURCE_EXHAUSTED') ||
            message.includes('timeout') ||
            message.includes('ECONNRESET') ||
            message.includes('ETIMEDOUT');

          if (isTransient && attempt < 2) {
            const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
            console.warn(
              `[Voiceover] Model "${model}" lỗi tạm thời (lần ${attempt + 1}/3), ` +
                `thử lại sau ${Math.round(delay)}ms: ${message.slice(0, 120)}`,
            );
            await this.sleep(delay);
            continue;
          }

          console.warn(
            `[Voiceover] Model "${model}" failed: ${message.slice(0, 200)}`,
          );
          lastError = err;
          break;
        }
      }
    }

    console.error(
      '[Voiceover] Tất cả mô hình Gemini đều thất bại. Lỗi cuối:',
      lastError?.message,
    );

    if (lastError) {
      const errorMessage = lastError.message || 'Unknown error';
      throw new InternalServerErrorException(
        `Không thể tạo lời dẫn bằng AI (đã thử ${this.geminiModels.length} mô hình): ${errorMessage}`,
      );
    }

    throw new InternalServerErrorException(
      `Không thể tạo lời dẫn bằng AI: tất cả ${this.geminiModels.length} mô hình đều không khả dụng. ` +
        'Vui lòng thử lại sau vài phút.',
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private buildSceneContext(request: VoiceoverRequest): string {
    if (!request.scenes || request.scenes.length === 0) {
      return '';
    }

    const sceneLines = request.scenes.map((s, i) => {
      const desc = s.description ? ` - ${s.description}` : '';
      return `  ${i + 1}. [${s.type}] ${s.title}: ${s.subtitle}${desc}`;
    });

    return `\nDANH SÁCH CÁC PHÂN CẢNH (scenes):\n${sceneLines.join('\n')}\n`;
  }

  // ─── Voice Selection ────────────────────────────────────────────────────

  private async resolveVietnameseVoice(
    preferredVoiceId?: string,
  ): Promise<ElevenLabsVoice> {
    const availableVoices = await this.getVietnameseVoices();

    if (availableVoices.length === 0) {
      throw new InternalServerErrorException(
        'Không tìm thấy giọng đọc nào từ ElevenLabs. ' +
          'Vui lòng kiểm tra ELEVENLABS_API_KEY trong file .env và đảm bảo API key hợp lệ.',
      );
    }

    // If a specific voice ID was requested, find it
    if (preferredVoiceId) {
      const match = availableVoices.find(
        (v) => v.voice_id === preferredVoiceId,
      );
      if (match) {
        console.log(
          `[Voiceover] Using selected voice: ${match.name} (${match.voice_id})`,
        );
        return match;
      }
      console.warn(
        `[Voiceover] Voice ID "${preferredVoiceId}" không tìm thấy, ` +
          'sẽ dùng giọng mặc định.',
      );
    }

    // Prefer Vietnamese-specific voices
    const vnVoice = availableVoices.find(
      (v) =>
        v.labels?.language === 'vi' ||
        v.labels?.language === 'vietnamese' ||
        v.labels?.accent === 'vietnamese' ||
        v.labels?.accent === 'vi',
    );
    if (vnVoice) {
      console.log(`[Voiceover] Using Vietnamese voice: ${vnVoice.name}`);
      return vnVoice;
    }

    // Fall back to first available voice
    const defaultVoice = availableVoices[0];
    console.log(`[Voiceover] Using default voice: ${defaultVoice.name}`);
    return defaultVoice;
  }

  // ─── Text-to-Speech (ElevenLabs SDK) ────────────────────────────────────

  private async textToSpeech(
    text: string,
    voiceId: string,
  ): Promise<{ audioUrl: string; duration: number }> {
    try {
      const shouldEnforceLanguage = this.languageEnforcedModels.has(
        this.ttsModelId,
      );
      console.log(
        `[Voiceover] Calling ElevenLabs TTS: voice="${voiceId}" model="${this.ttsModelId}" ` +
          `language="${shouldEnforceLanguage ? this.ttsLanguageCode : 'auto'}" text=${text.length}chars`,
      );

      // The SDK returns audio as a ReadableStream<Uint8Array>
      const audioStream = await this.elevenlabs.textToSpeech.convert(voiceId, {
        text,
        model_id: this.ttsModelId,
        ...(shouldEnforceLanguage
          ? { language_code: this.ttsLanguageCode }
          : {}),
        output_format: 'mp3_44100_128',
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.75,
          style: 0.2,
          use_speaker_boost: true,
          speed: 0.95,
        },
      });

      // Collect all chunks from the stream
      const chunks: Uint8Array[] = [];
      for await (const chunk of audioStream) {
        chunks.push(
          chunk instanceof Uint8Array ? chunk : Buffer.from(chunk as Buffer),
        );
      }

      // Concatenate into a single buffer
      const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
      const audioBuffer = Buffer.alloc(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        audioBuffer.set(chunk, offset);
        offset += chunk.length;
      }

      const filename = `voiceover-${randomUUID()}.mp3`;
      const filePath = join(this.outputDir, filename);
      writeFileSync(filePath, audioBuffer);

      // Estimate duration from file size (MP3 ~16KB/s at 128kbps)
      const estimatedDurationSec =
        Math.round((audioBuffer.length / ((128 * 1024) / 8)) * 10) / 10;

      const audioPath = `/renders/voiceovers/${filename}`;
      const audioUrl = this.publicBaseUrl
        ? `${this.publicBaseUrl}${audioPath}`
        : audioPath;

      console.log(
        `[Voiceover] TTS complete: ${filename} (${(audioBuffer.length / 1024).toFixed(1)}KB, ~${estimatedDurationSec}s)`,
      );

      return { audioUrl, duration: estimatedDurationSec };
    } catch (error) {
      if (error instanceof InternalServerErrorException) throw error;

      const message = error instanceof Error ? error.message : String(error);
      console.error('[Voiceover] ElevenLabs TTS failed:', message);

      throw new InternalServerErrorException(
        `Không thể tạo giọng nói: ${message}`,
      );
    }
  }

  // ─── Error Helpers ──────────────────────────────────────────────────────

  private isAuthError(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error);
    return (
      message.includes('401') ||
      message.includes('403') ||
      message.includes('Unauthorized') ||
      message.includes('Forbidden') ||
      message.includes('invalid_api_key') ||
      message.includes('auth')
    );
  }

  private extractStatusCode(error: unknown): number | null {
    const message = error instanceof Error ? error.message : String(error);
    const match =
      message.match(/status(?: code)?[:\s]*(\d{3})/i) ||
      message.match(/HTTP\s*(\d{3})/i) ||
      message.match(/^(\d{3})/);
    return match ? parseInt(match[1], 10) : null;
  }

  // ─── Helpers ────────────────────────────────────────────────────────────

  private resolveOutputDir(): string {
    const cwd = process.cwd();
    const webEntry = resolve(cwd, 'apps', 'web', 'src', 'index.ts');
    if (existsSync(webEntry)) {
      return resolve(cwd, 'renders', 'voiceovers');
    }

    if (basename(cwd) === 'api') {
      return resolve(cwd, '..', '..', 'renders', 'voiceovers');
    }

    return resolve(cwd, 'renders', 'voiceovers');
  }

  private resolvePublicBaseUrl(): string {
    return (
      process.env.PUBLIC_API_URL ||
      process.env.API_PUBLIC_URL ||
      process.env.RENDER_EXTERNAL_URL ||
      ''
    ).replace(/\/+$/, '');
  }
}
