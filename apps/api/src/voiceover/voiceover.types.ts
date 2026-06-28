export class VoiceoverDiagnostic {
  /** Whether the ElevenLabs API key is valid */
  keyValid: boolean;
  /** HTTP status from ElevenLabs */
  statusCode: number | null;
  /** Error message from ElevenLabs, if any */
  errorMessage: string | null;
  /** Number of voices returned (if successful) */
  voiceCount: number;
  /** The API endpoint that was called */
  endpoint: string;
  /** First 8 chars of the API key (for verification) */
  keyPrefix: string;
}

export class VoiceoverRequest {
  /**
   * Pre-generated Vietnamese narration text from the AI video generation step.
   * When provided, the voiceover service skips Gemini narration generation
   * and goes straight to ElevenLabs TTS with this text.
   */
  narrationText?: string;
  /** Description/prompt for generating the narration script (fallback if narrationText not provided) */
  description?: string;
  /** Video duration in seconds - narration text length will be adjusted accordingly */
  duration?: string;
  /** Tone for the narration (e.g. Professional, Lively, Retro) */
  tone?: string;
  /** Language code, defaults to 'vi' */
  language?: string;
  /** Optional ElevenLabs voice ID override */
  voiceId?: string;
  /** Title of the video for context */
  title?: string;
  /** Generated scenes for context-aware narration (fallback) */
  scenes?: Array<{
    title: string;
    subtitle: string;
    description?: string;
    type: string;
  }>;
}

export class VoiceoverResponse {
  /** Public URL to the generated audio file */
  audioUrl: string;
  /** The Vietnamese narration text that was generated and spoken */
  narrationText: string;
  /** Actual duration of the generated audio in seconds */
  duration: number;
  /** ElevenLabs voice ID used */
  voiceId: string;
  /** Voice name used */
  voiceName: string;
}

export class ElevenLabsVoice {
  voice_id: string;
  name: string;
  labels?: Record<string, string>;
  category?: string;
  description?: string;
}
