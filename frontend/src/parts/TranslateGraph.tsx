import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter
} from "@assistant-ui/react";
import {Thread} from "@/components/assistant-ui/thread";
import {useState} from "react";
import {translate, refineTranslation} from "@/services/translateApi";
import GlossaryImprovements from "@/components/GlossaryImprovements";

function TranslateGraph({
  conversationIdRef
}: {
  conversationIdRef: React.RefObject<string | null>;
}) {
  const [response, setResponse] = useState<string | null>(null);
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

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <AssistantRuntimeProvider runtime={useLocalRuntime(chatModelAdapter)}>
          <Thread />
        </AssistantRuntimeProvider>
      </div>
      <div className="w-80 border-l">
        <GlossaryImprovements
          conversationIdRef={conversationIdRef}
          response={response}
        />
      </div>
    </div>
  );
}

export default TranslateGraph;
