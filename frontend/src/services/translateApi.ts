const API_BASE_URL = "http://localhost:8008";

export interface TranslationResponse {
  response: string;
  conversation_id?: string;
}

const makeRequest = async (
  endpoint: string,
  body: any
): Promise<TranslationResponse> => {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body)
  });
  return response.json();
};

export const translate = async (
  message: string
): Promise<TranslationResponse> => {
  return makeRequest("translate", {message});
};

export const refineTranslation = async (
  message: string,
  conversationId: string
): Promise<TranslationResponse> => {
  return makeRequest("refine-translation", {
    message,
    conversation_id: conversationId
  });
};
