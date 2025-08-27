import {useCallback, useState} from "react";

export function useTextInput(initialValue: string = "Dos cervezas, por favor") {
  const [text, setText] = useState(initialValue);

  const handleTextChange = useCallback((newText: string) => {
    // Ensure text is never undefined
    const validText = newText || "";
    setText(validText);
  }, []);

  const clearText = useCallback(() => {
    setText("");
  }, []);

  return {
    text,
    handleTextChange,
    clearText
  };
}
