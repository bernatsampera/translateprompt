import {useCallback, useEffect, useState} from "react";
import {detectAll} from "tinyld";

const preferredLangs = ["en", "de", "es", "fr", "it"];

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
      // Get candidates with confidence scores
      const results = detectAll(validText); // [{ lang: "en", accuracy: 0.98 }, ...]
      if (!results.length) {
        setDetectedLanguage("Unknown");
        return "Unknown";
      }

      // Prefer a main language if it's in the top 3
      const preferred = results
        .slice(0, 3)
        .find((res) => preferredLangs.includes(res.lang));

      const detected = preferred ? preferred.lang : results[0].lang;

      setDetectedLanguage(detected);
      return detected;
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
