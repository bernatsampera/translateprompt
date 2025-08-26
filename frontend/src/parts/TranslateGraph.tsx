import {Thread} from "@/components/assistant-ui/thread";
import GlossaryImprovements from "@/components/GlossaryImprovements";
import {
  getGlossaryImprovements,
  refineTranslation,
  translate,
  type GlossaryEntry
} from "@/services/translateApi";
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter
} from "@assistant-ui/react";
import React, {useCallback, useState} from "react";

function TranslateGraph({
  conversationIdRef
}: {
  conversationIdRef: React.RefObject<string | null>;
}) {
  const [response, setResponse] = useState<string | null>(null);
  const [improvements, setImprovements] = useState<GlossaryEntry[]>([]);

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

  const checkImprovements = useCallback(() => {
    getGlossaryImprovements(conversationIdRef.current ?? "").then(
      (improvements) => {
        setImprovements(improvements);
      }
    );
  }, [conversationIdRef]);

  React.useEffect(() => {
    if (!response) return;

    checkImprovements();
  }, [response, checkImprovements]);

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        conversation id : {conversationIdRef.current}
        <AssistantRuntimeProvider runtime={useLocalRuntime(chatModelAdapter)}>
          <Thread />
        </AssistantRuntimeProvider>
      </div>
      <div className="w-80 border-l">
        <GlossaryImprovements
          improvements={improvements}
          conversationId={conversationIdRef.current ?? ""}
          loadImprovements={checkImprovements}
        />
      </div>
    </div>
  );
}

export default TranslateGraph;
