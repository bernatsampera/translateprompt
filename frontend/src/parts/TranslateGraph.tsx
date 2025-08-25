import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter
} from "@assistant-ui/react";
import {Thread} from "@/components/assistant-ui/thread";
import {useRef} from "react";
import {translate, refineTranslation} from "@/services/translateApi";

function TranslateGraph() {
  const conversationIdRef = useRef<string | null>(null);

  const chatModelAdapter: ChatModelAdapter = {
    async run({messages}) {
      const userMessage = messages[messages.length - 1]?.content?.[0];
      const text = userMessage?.type === "text" ? userMessage.text || "" : "";

      const response = conversationIdRef.current
        ? await refineTranslation(text, conversationIdRef.current)
        : await translate(text);

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
    <div className="h-screen w-screen">
      <AssistantRuntimeProvider runtime={useLocalRuntime(chatModelAdapter)}>
        <Thread />
      </AssistantRuntimeProvider>
    </div>
  );
}

export default TranslateGraph;
