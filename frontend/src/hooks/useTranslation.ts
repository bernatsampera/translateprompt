import {type TranslationResponse} from "@/api/translateApi";
import {translationService} from "@/services/translationService";
import {useCallback, useState} from "react";

interface UseTranslationOptions {
  onTranslationComplete?: (response: TranslationResponse) => void;
  onError?: (error: Error) => void;
}

export function useTranslation(options: UseTranslationOptions = {}) {
  const [translation, setTranslation] = useState<string | null>(
    "Two pints, please"
  );
  const [isTranslating, setIsTranslating] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const translate = useCallback(
    async (text: string, sourceLanguage: string, targetLanguage: string) => {
      setIsTranslating(true);
      try {
        const response = await translationService.translate(
          text,
          sourceLanguage,
          targetLanguage
        );

        setTranslation(response.response);

        if (response.conversation_id) {
          setConversationId(response.conversation_id);
        }

        options.onTranslationComplete?.(response);
      } catch (error) {
        console.error("Translation error:", error);
        const errorMessage = "Error: Translation failed.";
        setTranslation(errorMessage);
        options.onError?.(
          error instanceof Error ? error : new Error("Translation failed")
        );
      } finally {
        setIsTranslating(false);
      }
    },
    [options]
  );

  const refine = useCallback(
    async (
      refinementText: string,
      sourceLanguage: string,
      targetLanguage: string
    ) => {
      if (!conversationId) {
        throw new Error("Please start a new conversation first");
      }

      const response = await translationService.refine(
        refinementText,
        conversationId,
        sourceLanguage,
        targetLanguage
      );

      setTranslation(response.response);
      options.onTranslationComplete?.(response);
    },
    [conversationId, options]
  );

  const reset = useCallback(() => {
    setTranslation(null);
    setConversationId(null);
    setIsTranslating(false);
  }, []);

  return {
    translation,
    isTranslating,
    conversationId,
    translate,
    refine,
    reset
  };
}
