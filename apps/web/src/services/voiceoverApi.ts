import { apiClient } from "../lib/apiClient";

export interface VoiceoverRequest {
  /**
   * Pre-generated Vietnamese narration text from the AI video generation step.
   * When provided, voiceover skips Gemini and goes straight to ElevenLabs TTS.
   */
  narrationText?: string;
  description?: string;
  duration?: string;
  tone?: string;
  language?: string;
  voiceId?: string;
  title?: string;
  scenes?: Array<{
    title: string;
    subtitle: string;
    description?: string;
    type: string;
  }>;
}

export interface VoiceoverResponse {
  audioUrl: string;
  narrationText: string;
  duration: number;
  voiceId: string;
  voiceName: string;
}

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  labels?: Record<string, string>;
  category?: string;
  description?: string;
}

export const voiceoverApi = {
  async generateVoiceover(request: VoiceoverRequest) {
    const response = await apiClient.post<VoiceoverResponse>(
      "/voiceover/generate",
      request,
    );
    return response.data;
  },

  async listVoices() {
    const response = await apiClient.get<ElevenLabsVoice[]>(
      "/voiceover/voices",
    );
    return response.data;
  },
};
