import {francAll} from "franc";
import {useEffect, useState} from "react";

interface LanguageInputProps {
  text: string;
  onLanguageDetected: (language: string) => void;
  isAutoDetectionEnabled: boolean;
  onAutoDetectionToggle: (enabled: boolean) => void;
}

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

export function LanguageInput({
  text,
  onLanguageDetected,
  isAutoDetectionEnabled,
  onAutoDetectionToggle
}: LanguageInputProps) {
  const [detectedLanguage, setDetectedLanguage] = useState<string>("");

  // Auto-detect language when text changes
  useEffect(() => {
    // Ensure text is valid and not undefined
    const validText = text && typeof text === "string" ? text.trim() : "";

    if (isAutoDetectionEnabled && validText.length > 0) {
      try {
        const results = francAll(validText);
        if (!results.length || results[0][1] === 0) {
          setDetectedLanguage("Unknown");
          return;
        }

        // Try to find a preferred language among the top 3 candidates
        const preferred = results
          .slice(0, 3)
          .find(([code]) => preferredLangs.includes(code));

        const detectedLang = preferred ? preferred[0] : results[0][0];
        setDetectedLanguage(detectedLang);

        // Convert to ISO code and notify parent
        const isoCode = langMapping[detectedLang] || detectedLang;
        onLanguageDetected(isoCode);
      } catch (error) {
        console.error("Language detection error:", error);
        setDetectedLanguage("Unknown");
      }
    }
  }, [text, isAutoDetectionEnabled, onLanguageDetected]);

  // Reset when text is cleared or invalid
  useEffect(() => {
    const validText = text && typeof text === "string" ? text.trim() : "";

    if (validText.length === 0) {
      setDetectedLanguage("");
      if (!isAutoDetectionEnabled) {
        onAutoDetectionToggle(true);
      }
    }
  }, [text, isAutoDetectionEnabled, onAutoDetectionToggle]);

  // Don't render anything visible - this component just handles the logic
  return null;
}
