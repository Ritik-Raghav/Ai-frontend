import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Message from "./Message";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { callGroqAPI } from "@/lib/groq"; // your AI call
import { callGeminiAPI } from "@/lib/gemini"; // your AI call

//@ts-ignore
const url = import.meta.env.VITE_URL;

export type MessageType = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
};

interface ChatContainerProps {
  setResponseFromAI: (content: string) => void;
  landingPrompt?: string; // ✨ NEW optional prop
}

const ChatContainer = ({ setResponseFromAI, landingPrompt }: ChatContainerProps) => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "1",
      content: "Hi there! How can I help you today?",
      isUser: false,
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendPrompt = async (prompt: string) => {
    if (!prompt.trim()) return;
  
    const newUserMessage: MessageType = {
      id: Date.now().toString(),
      content: prompt,
      isUser: true,
      timestamp: "Just now",
    };
  
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
  
    try {
      const aiResponseText = await callGroqAPI(prompt);
      // console.log(aiResponseText);
      

      // UNCOMMENT TO SAVE RAW FILES

      await fetch(`${url}/api/save-response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          prompt,
          response: aiResponseText,
          language: "txt",
        }),
      });
  
      // const aiResponse: MessageType = {
      //   id: (Date.now() + 1).toString(),
      //   content: aiResponseText,
      //   isUser: false,
      //   timestamp: "Just now",
      // };
  
      const aiGeneratedMsg: MessageType = {
        id: (Date.now() + 2).toString(),
        content: "Response generated.",
        isUser: false,
        timestamp: "Just now",
      };
  
      setMessages((prev) => [...prev, aiGeneratedMsg]);
      setResponseFromAI(aiResponseText);
    } catch (error) {
      console.error(error);
      setResponseFromAI("Error fetching AI response.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSendMessage = async () => {
    await sendPrompt(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ✨ Auto-send Landing prompt when it arrives
  useEffect(() => {
    if (landingPrompt) {
      sendPrompt(landingPrompt);
    }
  }, [landingPrompt]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto thin-scrollbar p-4 space-y-4">
        {messages.map((message) => (
          <Message
            key={message.id}
            content={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
        {isLoading && (
          <div className="flex space-x-2 items-center p-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150" />
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300" />
            </div>
            <span className="text-sm text-foreground/70">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border p-4">
        <div className="relative">
          <Textarea
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-12 max-h-[200px] min-h-[80px] resize-none thin-scrollbar focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            size="icon"
            className={cn(
              "absolute bottom-2 right-2 rounded-full",
              !input.trim() && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
