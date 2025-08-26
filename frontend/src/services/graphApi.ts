import axios from "axios";

const BASE_URL = "http://localhost:8008";
const GRAPH_BASE_URL = `${BASE_URL}/graphs`;

export interface TranslationResponse {
  response: string;
  conversation_id?: string;
}

export const startTranslation = async (
  message: string
): Promise<TranslationResponse> => {
  const response = await axios.post(`${GRAPH_BASE_URL}/translate`, {message});
  return response.data;
};

export const refineTranslation = async (
  message: string,
  conversationId: string
): Promise<TranslationResponse> => {
  const response = await axios.post(`${GRAPH_BASE_URL}/refine-translation`, {
    message,
    conversation_id: conversationId
  });
  return response.data;
};
