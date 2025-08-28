import axiosInstance from "./axiosConfig";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const GRAPH_BASE_URL = `${BASE_URL}/graphs`;

export interface TranslationResponse {
  response: string;
  conversation_id?: string;
}

export interface TranslationRequest {
  message: string;
  source_language?: string;
  target_language?: string;
}

export const startTranslation = async (
  message: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<TranslationResponse> => {
  const requestData: TranslationRequest = {
    message,
    source_language: sourceLanguage === "auto" ? undefined : sourceLanguage,
    target_language: targetLanguage
  };

  const response = await axiosInstance.post(
    `${GRAPH_BASE_URL}/translate`,
    requestData
  );
  return response.data;
};

export const refineTranslation = async (
  message: string,
  conversationId: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<TranslationResponse> => {
  const response = await axiosInstance.post(
    `${GRAPH_BASE_URL}/refine-translation`,
    {
      message,
      conversation_id: conversationId,
      source_language: sourceLanguage,
      target_language: targetLanguage
    }
  );
  return response.data;
};
