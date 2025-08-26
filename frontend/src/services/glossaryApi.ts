import axios from "axios";

const BASE_URL = "http://localhost:8008";
const GLOSSARY_BASE_URL = `${BASE_URL}/glossary`;

export interface GlossaryEntry {
  source: string;
  target: string;
  note: string;
}

export interface GlossaryResponse {
  entries: GlossaryEntry[];
}

export interface EditGlossaryRequest {
  old_source: string;
  new_source: string;
  target: string;
  note: string;
}

export interface DeleteGlossaryRequest {
  source: string;
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

export const editGlossaryEntry = async (
  oldSource: string,
  newSource: string,
  target: string,
  note: string = ""
): Promise<{status: string; message: string}> => {
  const response = await axios.put(`${GLOSSARY_BASE_URL}/edit-glossary-entry`, {
    old_source: oldSource,
    new_source: newSource,
    target,
    note
  });
  return response.data;
};

export const deleteGlossaryEntry = async (
  source: string
): Promise<{status: string; message: string}> => {
  const response = await axios.delete(
    `${GLOSSARY_BASE_URL}/delete-glossary-entry`,
    {
      data: {
        source
      }
    }
  );
  return response.data;
};

export const getGlossaryEntries = async (): Promise<GlossaryResponse> => {
  const response = await axios.get(`${GLOSSARY_BASE_URL}/glossary-entries`);
  return response.data;
};
