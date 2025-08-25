const API_BASE_URL = "http://localhost:8008";

export interface TranslationResponse {
  response: string;
  conversation_id?: string;
}

export interface GlossaryImprovement {
  source: string;
  current_target: string;
  suggested_target: string;
  reason: string;
  confidence: number;
}

export interface ImprovementResponse {
  conversation_id: string;
  status: "processing" | "completed" | "error";
  improvements: GlossaryImprovement[];
  analysis_time?: string;
}

export interface GlossaryEntry {
  source: string;
  target: string;
  note: string;
}

export interface GlossaryResponse {
  entries: GlossaryEntry[];
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

export const getGlossaryImprovements = async (
  conversationId: string
): Promise<ImprovementResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/glossary-improvements/${conversationId}`
  );
  return response.json();
};

export const applyGlossaryUpdate = async (
  source: string,
  target: string,
  note: string = ""
): Promise<{status: string; message: string}> => {
  const response = await fetch(`${API_BASE_URL}/apply-glossary-update`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({source, target, note})
  });
  return response.json();
};

export const getGlossaryEntries = async (): Promise<GlossaryResponse> => {
  const response = await fetch(`${API_BASE_URL}/glossary-entries`);
  return response.json();
};
