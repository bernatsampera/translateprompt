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

      // Process formatting for the line
      const parts = processInlineFormatting(line, index);

      return (
        <p key={`line-${index}`} className="mb-2 last:mb-0">
          {parts.length > 0 ? parts : line}
        </p>
      );
    });
  };

  const processInlineFormatting = (text: string, lineIndex: number) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    // Combined regex to match both bold text and inline code
    const combinedRegex = /(\*\*(.*?)\*\*|`([^`]+)`)/g;

    while ((match = combinedRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Check if it's bold text or inline code
      if (match[0].startsWith("**")) {
        // Bold text
        parts.push(
          <strong
            key={`bold-${lineIndex}-${match.index}`}
            className="font-semibold text-base-content"
          >
            {match[2]}
          </strong>
        );
      } else if (match[0].startsWith("`")) {
        // Inline code
        parts.push(
          <code
            key={`code-${lineIndex}-${match.index}`}
            className="bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono"
          >
            {match[3]}
          </code>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div className="text-base-content/70 max-w-4xl text-lg leading-relaxed">
      {parseDescription(description)}
    </div>
  );
};
