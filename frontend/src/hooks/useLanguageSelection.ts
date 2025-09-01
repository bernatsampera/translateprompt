import {useCallback, useEffect, useState} from "react";

export function useLanguageSelection() {
  // Initialize state from localStorage or defaults
  const [sourceLanguage, setSourceLanguage] = useState(() => {
    const saved = localStorage.getItem("sourceLanguage");
    return saved || "en";
  });

  const [targetLanguage, setTargetLanguage] = useState(() => {
    const saved = localStorage.getItem("targetLanguage");
    return saved || "es";
  });

  const [isAutoDetectionEnabled, setIsAutoDetectionEnabled] = useState(true);

  // Save source language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sourceLanguage", sourceLanguage);
  }, [sourceLanguage]);

  // Save target language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("targetLanguage", targetLanguage);
  }, [targetLanguage]);

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
