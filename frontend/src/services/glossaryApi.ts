import axios from "axios";

const BASE_URL = "http://localhost:8008";
const GLOSSARY_BASE_URL = `${BASE_URL}/glossary`;

export interface ImprovementResponse {
  conversation_id: string;
  status: "processing" | "completed" | "error";
  improvements: GlossaryEntry[];
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

export const getGlossaryImprovements = async (
  conversationId: string
): Promise<GlossaryEntry[]> => {
  const response = await axios.get(
    `${GLOSSARY_BASE_URL}/glossary-improvements/${conversationId}`
  );
  return response.data;
};

export const applyGlossaryUpdate = async (
  source: string,
  target: string,
  note: string = "",
  conversationId: string
): Promise<{status: string; message: string}> => {
  const response = await axios.post(
    `${GLOSSARY_BASE_URL}/apply-glossary-update`,
    {
      glossary_entry: {
        source,
        target,
        note
      },
      conversation_id: conversationId
    }
  );
  return response.data;
};

export const getGlossaryEntries = async (): Promise<GlossaryResponse> => {
  const response = await axios.get(`${GLOSSARY_BASE_URL}/glossary-entries`);
  return response.data;
};
