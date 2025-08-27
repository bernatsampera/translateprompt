import {useLanguageDetection} from "@/hooks";
import {useEffect} from "react";

interface LanguageInputProps {
  text: string;
  onLanguageDetected: (language: string) => void;
  isAutoDetectionEnabled: boolean;
  onAutoDetectionToggle: (enabled: boolean) => void;
}

export function LanguageInput({
  text,
  onLanguageDetected,
  isAutoDetectionEnabled,
  onAutoDetectionToggle
}: LanguageInputProps) {
  // Use the language detection hook
  useLanguageDetection(text, {
    onLanguageDetected,
    isEnabled: isAutoDetectionEnabled
  });

  // Reset when text is cleared or invalid
  useEffect(() => {
    const validText = text && typeof text === "string" ? text.trim() : "";

    if (validText.length === 0) {
      if (!isAutoDetectionEnabled) {
        onAutoDetectionToggle(true);
      }
    }
  }, [text, isAutoDetectionEnabled, onAutoDetectionToggle]);

  // Don't render anything visible - this component just handles the logic
  return null;
}
