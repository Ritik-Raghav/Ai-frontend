import { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import ChatContainer from "@/components/ChatContainer";
import PreviewArea from "@/components/PreviewArea";

const Index = () => {
  const location = useLocation();
  const landingPrompt = location.state?.userInput || "";

  const [responseFromAI, setResponseFromAI] = useState("");

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel - Chat */}
        <div className="w-[350px] border-r border-border h-full">
          <ChatContainer
            setResponseFromAI={setResponseFromAI}
            landingPrompt={landingPrompt} // ✨ pass it
          />
        </div>

        {/* Right panel - Preview */}
        <div className="w-4/5 p-4 h-full overflow-auto">
          <PreviewArea content={responseFromAI} />
        </div>
      </div>
    </div>
  );
};

export default Index;
