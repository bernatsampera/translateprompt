import axiosInstance from "./axiosConfig";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const RULES_BASE_URL = `${BASE_URL}/rules`;

export interface RulesEntry {
  text: string;
  source_language: string;
  target_language: string;
  user_id?: string;
}

export interface RulesResponse {
  entries: RulesEntry[];
}

export interface EditRulesRequest {
  old_text: string;
  new_text: string;
}

export interface DeleteRulesRequest {
  text: string;
}

export const addRule = async (
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<{status: string; message: string}> => {
  const response = await axiosInstance.post(`${RULES_BASE_URL}/add-rule`, {
    rules_entry: {
      text,
      source_language: sourceLanguage,
      target_language: targetLanguage
    }
  });
  return response.data;
};

export const editRule = async (
  oldText: string,
  newText: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<{status: string; message: string}> => {
  const response = await axiosInstance.put(`${RULES_BASE_URL}/edit-rule`, {
    old_text: oldText,
    new_text: newText,
    source_language: sourceLanguage,
    target_language: targetLanguage
  });
  return response.data;
};

export const deleteRule = async (
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<{status: string; message: string}> => {
  const response = await axiosInstance.delete(`${RULES_BASE_URL}/delete-rule`, {
    data: {
      text,
      source_language: sourceLanguage,
      target_language: targetLanguage
    }
  });
  return response.data;
};

export const getRulesEntries = async (
  sourceLanguage: string,
  targetLanguage: string
): Promise<RulesResponse> => {
  const response = await axiosInstance.get(
    `${RULES_BASE_URL}/rules-entries?source_language=${sourceLanguage}&target_language=${targetLanguage}`
  );
  return response.data;
};

export const getRulesList = async (
  sourceLanguage: string,
  targetLanguage: string
): Promise<string[]> => {
  const response = await axiosInstance.get(
    `${RULES_BASE_URL}/rules-list?source_language=${sourceLanguage}&target_language=${targetLanguage}`
  );
  return response.data;
};
