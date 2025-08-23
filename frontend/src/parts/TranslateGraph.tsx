import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter,
  type ThreadMessage
} from "@assistant-ui/react";
import {Thread} from "@/components/assistant-ui/thread";
import {useRef} from "react";

// API Configuration
const API_BASE_URL = "http://localhost:8008";
const CHAT_ENDPOINT = `${API_BASE_URL}/translate`;

// Error messages
const ERROR_MESSAGES = {
  NO_RESPONSE: "No response received from the chat service",
  NETWORK_ERROR: "Failed to connect to chat service",
  API_ERROR: "Chat service error"
} as const;

/**
 * Extracts the latest user message from the messages array
 */
const getLatestUserMessage = (messages: readonly ThreadMessage[]): string => {
  const lastMessage = messages[messages.length - 1];
  const firstContent = lastMessage?.content?.[0];

  // Check if the content is a text message part
  if (firstContent && firstContent.type === "text") {
    return firstContent.text || "";
  }

  return "";
};

/**
 * Handles API errors and returns user-friendly error messages
 */
const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.name === "AbortError") {
      return "Request was cancelled";
    }
    if (error.message.includes("fetch")) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
    return `${ERROR_MESSAGES.API_ERROR}: ${error.message}`;
  }
  return "An unexpected error occurred";
};

/**
 * Creates a chat model adapter that communicates with the backend API
 */
const createChatModelAdapter = (
  conversationIdRef: React.RefObject<string | null>
): ChatModelAdapter => ({
  async run({messages, abortSignal}) {
    try {
      const userMessage = getLatestUserMessage(messages);

      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage,
          conversation_id: conversationIdRef.current
        }),
        signal: abortSignal
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const responseText = data.response || ERROR_MESSAGES.NO_RESPONSE;

      // Store the conversation ID for future requests
      if (data.conversation_id) {
        conversationIdRef.current = data.conversation_id;
      }

      return {
        content: [
          {
            type: "text",
            text: responseText
          }
        ]
      };
    } catch (error) {
      console.error("Chat API error:", error);

      return {
        content: [
          {
            type: "text",
            text: handleApiError(error)
          }
        ]
      };
    }
  }
});

/**
 * Main BasicGraph component that provides the chat interface
 */
function BasicGraph() {
  const conversationIdRef = useRef<string | null>(null);
  const chatRuntime = useLocalRuntime(
    createChatModelAdapter(conversationIdRef)
  );

  return (
    <div className="h-screen w-screen">
      <AssistantRuntimeProvider runtime={chatRuntime}>
        <Thread />
      </AssistantRuntimeProvider>
    </div>
  );
}

export default BasicGraph;
