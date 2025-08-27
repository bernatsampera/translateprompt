import {useCallback, useState} from "react";

export function useClipboard() {
  const [isCopying, setIsCopying] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    if (!text) return;

    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text: ", err);
    } finally {
      setIsCopying(false);
    }
  }, []);

  return {
    isCopying,
    copyToClipboard
  };
}
