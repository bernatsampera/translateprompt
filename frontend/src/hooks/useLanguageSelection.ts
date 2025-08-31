import {useCallback, useState} from "react";

export function useLanguageSelection() {
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [isAutoDetectionEnabled, setIsAutoDetectionEnabled] = useState(true);

  const handleSourceLanguageChange = useCallback((language: string) => {
    setIsAutoDetectionEnabled(false);
    setSourceLanguage(language);
  }, []);

  const handleLanguageDetected = useCallback(
    (detectedLanguage: string) => {
      if (isAutoDetectionEnabled) {
        setSourceLanguage(detectedLanguage);
      }
    },
    [isAutoDetectionEnabled]
  );

  const handleTargetLanguageChange = useCallback((language: string) => {
    setTargetLanguage(language);
  }, []);

  const toggleAutoDetection = useCallback((enabled: boolean) => {
    setIsAutoDetectionEnabled(enabled);
  }, []);

  return {
    sourceLanguage,
    targetLanguage,
    isAutoDetectionEnabled,
    handleSourceLanguageChange,
    handleTargetLanguageChange,
    handleLanguageDetected,
    toggleAutoDetection
  };
}
