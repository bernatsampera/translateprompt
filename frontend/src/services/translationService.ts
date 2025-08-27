import {
  refineTranslation,
  startTranslation,
  type TranslationResponse
} from "@/api/translateApi";

export class TranslationService {
  async translate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<TranslationResponse> {
    if (!text.trim()) {
      throw new Error("Text cannot be empty");
    }

    return await startTranslation(text, sourceLanguage, targetLanguage);
  }

  async refine(
    refinementText: string,
    conversationId: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<TranslationResponse> {
    if (!conversationId) {
      throw new Error("Please start a new conversation first");
    }

    if (!refinementText.trim()) {
      throw new Error("Refinement text cannot be empty");
    }

    return await refineTranslation(
      refinementText,
      conversationId,
      sourceLanguage,
      targetLanguage
    );
  }
}

export const translationService = new TranslationService();
