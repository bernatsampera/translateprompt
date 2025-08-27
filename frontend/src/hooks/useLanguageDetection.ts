import {francAll} from "franc";
import {useCallback, useEffect, useState} from "react";

const preferredLangs = ["eng", "deu", "spa", "fra", "ita"];

// Convert franc language code to ISO 639-1 format for consistency
const langMapping: {[key: string]: string} = {
  eng: "en",
  deu: "de",
  spa: "es",
  fra: "fr",
  ita: "it",
  rus: "ru",
  cmn: "zh",
  jpn: "ja",
  kor: "ko",
  ara: "ar",
  cat: "ca"
};

interface UseLanguageDetectionOptions {
  onLanguageDetected?: (language: string) => void;
  isEnabled?: boolean;
}

export function useLanguageDetection(
  text: string,
  options: UseLanguageDetectionOptions = {}
) {
  const [detectedLanguage, setDetectedLanguage] = useState<string>("");
  const {onLanguageDetected, isEnabled = true} = options;

  const detectLanguage = useCallback((inputText: string) => {
    const validText =
      inputText && typeof inputText === "string" ? inputText.trim() : "";

    if (!validText.length) {
      setDetectedLanguage("");
      return "";
    }

    try {
      const results = francAll(validText);
      if (!results.length || results[0][1] === 0) {
        setDetectedLanguage("Unknown");
        return "Unknown";
      }

      // Try to find a preferred language among the top 3 candidates
      const preferred = results
        .slice(0, 3)
        .find(([code]) => preferredLangs.includes(code));

      const detectedLang = preferred ? preferred[0] : results[0][0];
      setDetectedLanguage(detectedLang);

      // Convert to ISO code
      const isoCode = langMapping[detectedLang] || detectedLang;
      return isoCode;
    } catch (error) {
      console.error("Language detection error:", error);
      setDetectedLanguage("Unknown");
      return "Unknown";
    }
  }, []);

  // Auto-detect language when text changes
  useEffect(() => {
    if (!isEnabled) return;

    const validText = text && typeof text === "string" ? text.trim() : "";

    if (validText.length > 0) {
      const isoCode = detectLanguage(validText);
      if (isoCode && isoCode !== "Unknown") {
        onLanguageDetected?.(isoCode);
      }
    } else {
      setDetectedLanguage("");
    }
  }, [text, isEnabled, onLanguageDetected, detectLanguage]);

  return {
    detectedLanguage,
    detectLanguage
  };
}
