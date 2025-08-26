import {Thread} from "@/components/assistant-ui/thread";
import GlossaryImprovements from "@/components/GlossaryImprovements";
import {
  getGlossaryImprovements,
  refineTranslation,
  translate,
  type ToolCall
} from "@/services/translateApi";
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter
} from "@assistant-ui/react";
import React, {useState} from "react";

function TranslateGraph({
  conversationIdRef
}: {
  conversationIdRef: React.RefObject<string | null>;
}) {
  const [response, setResponse] = useState<string | null>(null);
  const [improvements, setImprovements] = useState<ToolCall[]>([]);

  const chatModelAdapter: ChatModelAdapter = {
    async run({messages}) {
      const userMessage = messages[messages.length - 1]?.content?.[0];
      const text = userMessage?.type === "text" ? userMessage.text || "" : "";

      const response = conversationIdRef.current
        ? await refineTranslation(text, conversationIdRef.current)
        : await translate(text);

      setResponse(response.response);

      if (response.conversation_id) {
        conversationIdRef.current = response.conversation_id;
      }

      return {
        content: [
          {
            type: "text",
            text: response.response || "No response"
          }
        ]
      };
    }
  };

  React.useEffect(() => {
    if (!response) return;

    // Check for improvements every 5 seconds
    const checkImprovements = () => {
      getGlossaryImprovements(conversationIdRef.current ?? "")
        .then((response) => {
          setImprovements(response);
        })
        .catch(console.error);
    };

    // Check immediately
    checkImprovements();
  }, [response, conversationIdRef]);

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <AssistantRuntimeProvider runtime={useLocalRuntime(chatModelAdapter)}>
          <Thread />
        </AssistantRuntimeProvider>
      </div>
      <div className="w-80 border-l">
        <GlossaryImprovements improvements={improvements} />
      </div>
    </div>
  );
}

export default TranslateGraph;
