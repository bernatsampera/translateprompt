import axiosInstance from "./axiosConfig";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const GLOSSARY_BASE_URL = `${BASE_URL}/glossary`;

export interface GlossaryEntry {
  source: string;
  target: string;
  note: string;
  source_language: string;
  target_language: string;
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

export const applyGlossaryUpdate = async (
  source: string,
  target: string,
  note: string = "",
  conversationId: string
): Promise<{status: string; message: string}> => {
  const response = await axiosInstance.post(
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
  note: string = "",
  source_language: string,
  target_language: string
): Promise<{status: string; message: string}> => {
  const response = await axiosInstance.put(
    `${GLOSSARY_BASE_URL}/edit-glossary-entry`,
    {
      old_source: oldSource,
      new_source: newSource,
      target,
      note,
      source_language,
      target_language
    }
  );
  return response.data;
};

export const deleteGlossaryEntry = async (
  source: string,
  source_language: string,
  target_language: string
): Promise<{status: string; message: string}> => {
  const response = await axiosInstance.delete(
    `${GLOSSARY_BASE_URL}/delete-glossary-entry`,
    {
      data: {
        source,
        source_language,
        target_language
      }
    }
  );
  return response.data;
};

export const getGlossaryEntries = async (
  sourceLanguage: string,
  targetLanguage: string
): Promise<GlossaryResponse> => {
  const response = await axiosInstance.get(
    `${GLOSSARY_BASE_URL}/glossary-entries?source_language=${sourceLanguage}&target_language=${targetLanguage}`
  );
  return response.data;
};
