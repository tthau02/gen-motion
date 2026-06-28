import { Controller, Post, Get, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { VoiceoverService } from './voiceover.service';
import {
  VoiceoverRequest,
  VoiceoverResponse,
  VoiceoverDiagnostic,
  ElevenLabsVoice,
} from './voiceover.types';

@Controller('voiceover')
export class VoiceoverController {
  constructor(private readonly voiceoverService: VoiceoverService) {}

  /**
   * POST /api/voiceover/generate
   * Generate a Vietnamese voiceover: Gemini narration → ElevenLabs TTS → audio file.
   * Returns the narration text, audio URL, duration, and voice info.
   */
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('generate')
  async generate(@Body() request: VoiceoverRequest): Promise<VoiceoverResponse> {
    return await this.voiceoverService.generateVoiceover(request);
  }

  /**
   * GET /api/voiceover/voices
   * List all Vietnamese-capable ElevenLabs voices (cached for 30 minutes).
   */
  @Get('voices')
  async listVoices(): Promise<ElevenLabsVoice[]> {
    return await this.voiceoverService.getVietnameseVoices();
  }

  /**
   * GET /api/voiceover/verify-key
   * Diagnostic: kiểm tra ElevenLabs API key có hợp lệ không.
   * Gọi GET /v1/voices và trả về status, số lượng voice, lỗi chi tiết.
   */
  @Get('verify-key')
  async verifyKey(): Promise<VoiceoverDiagnostic> {
    return await this.voiceoverService.verifyApiKey();
  }
}
