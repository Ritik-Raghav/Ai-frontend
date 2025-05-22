import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Paperclip } from "lucide-react";

//@ts-ignore
const url = import.meta.env.VITE_URL;

const Landing = () => {
  const [prompt, setPrompt] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      window.history.replaceState({}, document.title, "/");
    } else {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setIsLoggedIn(true);
      }
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const alertLogin = () => {
    alert("Please login to use UnLovable");
  };

  const handleSubmit = () => {
    if (!isLoggedIn) {
      alertLogin();
      return;
    }

    if (prompt.trim() !== "") {
      navigate("/chat", { state: { userInput: prompt } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-rose-800 z-0" />

      {/* Header */}
      <header className="relative z-10 p-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-105 hover:opacity-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" className="mr-2 fill-white">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
              2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 
              3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 
              8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
          <h1 className="text-xl font-bold font-mono text-white">UnLovable.ai</h1>
        </Link>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white text-black font-semibold px-2 py-2 rounded-md hover:bg-gray-200 transition"
            >
              Logout
            </Button>
          ) : (
            <a
              href="https://ai-generator-backend-production.up.railway.app/google"
              className="flex items-center gap-2 bg-white text-black font-semibold px-2 py-2 rounded-md hover:bg-gray-200 transition"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Google logo"
                className="w-5 h-5"
              />
              Login with Google
            </a>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-white mb-4">
            Build something <span className="text-gradient">UnLovable</span>
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Idea to app in seconds, with your personal full-stack engineer
          </p>
        </div>

        {/* Prompt input */}
        <div className="w-full max-w-3xl bg-black/40 rounded-lg p-4 backdrop-blur-sm border border-white/10">
          <Textarea
            placeholder="Ask UnLovable to create something . . ."
            value={prompt}
            rows={prompt === "" ? 1 : 6}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="bg-transparent thin-scrollbar border-none resize-none text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Actions */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => {
                if (!isLoggedIn) alertLogin();
              }}
            >
              <Paperclip className="mr-1 h-4 w-4" />
              Attach
            </Button>

            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10 mr-2"
                onClick={() => {
                  if (!isLoggedIn) alertLogin();
                }}
              >
                Public
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={prompt.trim() === ""}
                className="bg-white/20 text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-2 justify-center mt-8">
          {[
            "🪙 Crypto portfolio tracker",
            "🌐 Personal website",
            "🏠 Real estate listings",
            "📱 SaaS landing page",
          ].map((suggestion, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="bg-black/30 text-white border-white/20 hover:bg-black/40"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Landing;
