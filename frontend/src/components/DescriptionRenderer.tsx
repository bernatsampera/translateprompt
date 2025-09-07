import React from "react";
import {CodeBlock} from "./CodeBlock";

interface DescriptionRendererProps {
  description: string;
}

export const DescriptionRenderer: React.FC<DescriptionRendererProps> = ({
  description
}) => {
  const parseDescription = (text: string) => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;

    // Split by code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before the code block
      if (match.index > currentIndex) {
        const textBefore = text.slice(currentIndex, match.index);
        parts.push(renderTextWithFormatting(textBefore));
      }

      // Add the code block
      const language = match[1] || "python";
      const code = match[2].trim();
      parts.push(
        <div key={`code-${match.index}`} className="my-4">
          <CodeBlock code={code} language={language} />
        </div>
      );

      currentIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex);
      parts.push(renderTextWithFormatting(remainingText));
    }

    return parts.length > 0 ? parts : renderTextWithFormatting(text);
  };

  const renderTextWithFormatting = (text: string) => {
    if (!text.trim()) return null;

    // Split by line breaks and process each line
    const lines = text.split("\n");

    return lines.map((line, index) => {
      if (line.trim() === "") {
        return <br key={`br-${index}`} />;
      }

      // Check for bold text
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        // Add text before the bold part
        if (match.index > lastIndex) {
          parts.push(line.slice(lastIndex, match.index));
        }

        // Add the bold part
        parts.push(
          <strong
            key={`bold-${index}-${match.index}`}
            className="font-semibold text-base-content"
          >
            {match[1]}
          </strong>
        );

        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < line.length) {
        parts.push(line.slice(lastIndex));
      }

      return (
        <p key={`line-${index}`} className="mb-2 last:mb-0">
          {parts.length > 0 ? parts : line}
        </p>
      );
    });
  };

  return (
    <div className="text-base-content/70 max-w-4xl text-lg leading-relaxed">
      {parseDescription(description)}
    </div>
  );
};
