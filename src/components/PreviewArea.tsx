import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import { Copy, Check, Eye, Code2 } from "lucide-react";

interface PreviewAreaProps {
  content: string;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ content }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedContent, setDisplayedContent] = useState<string[]>([]);
  const [livePreviewMode, setLivePreviewMode] = useState(false);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Handle incoming content changes
  useEffect(() => {
    if (content) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);

      const cleaned = content
        .replace(
          "Hi! It's nice to meet you. Is there something I can help you with, or would you like to chat?",
          ""
        )
        .replace(/<think>[\s\S]*?<\/think>/g, "");

      setDisplayedContent([cleaned]);
    }
  }, [content]);

  // Scroll to bottom of the last content element
  useLayoutEffect(() => {
    const last = contentRefs.current[displayedContent.length - 1];
    if (last) {
      last.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [displayedContent]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const extractCodeBlocks = (markdown: string) => {
    const htmlBlocks: { filename: string; code: string }[] = [];
    const cssBlocks: string[] = [];
    const jsBlocks: string[] = [];
    
    // Standard page filenames in the order they typically appear
    const standardFilenames = [
      "index.html", 
      "about.html", 
      "services.html", 
      "contact.html", 
      "portfolio.html"
    ];
    
    // Improved regex to capture code blocks
    const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
    
    // Additional regex to detect page type based on content
    const pageDetectionRegex = {
      home: /\b(welcome|home\s?page|hero|landing\s?page|intro|main\ssection)\b/i,
      about: /\b(about\s?us|our\steam|mission|company\s(history|overview)|about\ssection|team|who\swe\sare)\b/i,
      services: /\b(services?|what\swe\soffer|service\s(cards?|section)|offerings?)\b/i,
      contact: /\b(contact\s?us|contact\sform|get\s?in\stouch|message\s(us|form)?|send\smessage|reach\s(out)?)\b/i,
      portfolio: /\b(portfolio|our\swork|projects?|gallery|showcase|case\sstud(ies|y))\b/i,
    };
    
    
    // Enhanced filename detection - looks for specific filename patterns
    const filenameRegex = /(?:<!--\s*filename:\s*([\w\s\-\.]+?)\s*-->|\/\/\s*filename:\s*([\w\s\-\.]+)|\/\*\s*filename:\s*([\w\s\-\.]+)\s*\*\/|###?\s+([\w\s\-\.]+?\.html))/gi;
    
    // Fallback pattern for name hints that aren't explicit filenames
    const nameHintRegex = /(?:<!--\s*([\w\s\-]+?)\s*-->|###?\s+([\w\s\-]+))/gi;
    
    let match;
    let lastMatchIndex = 0;
    let htmlCounter = 0;
    
    while ((match = codeRegex.exec(markdown)) !== null) {
      const langRaw = match[1]?.trim().toLowerCase();
      const code = match[2].trim();
      let lang = langRaw;
      
      // Auto-detect language if not specified
      if (!lang) {
        if (/<\/?html|<!DOCTYPE html>/i.test(code)) lang = "html";
        else if (/function\s|\bconsole\.log\b|\bfetch\s*\(|=>/.test(code)) lang = "js";
        else if (/^\s*[.#\w-]+\s*\{[^}]+\}/m.test(code)) lang = "css";
      }
      
      // Skip if not HTML
      if (lang !== "html") {
        // Process other language blocks
        switch (lang) {
          case "css":
            cssBlocks.push(code);
            break;
          case "js":
          case "javascript":
            jsBlocks.push(code);
            break;
        }
        lastMatchIndex = codeRegex.lastIndex;
        continue;
      }
      
      // For HTML blocks, determine the appropriate filename
      let filename = '';
      
      // Extract content between last match and current match to find filename hints
      const precedingContent = markdown.slice(lastMatchIndex, match.index);
      
      // First try to find explicit filename
      const filenameMatch = [...precedingContent.matchAll(filenameRegex)].pop();
      
      if (filenameMatch) {
        // Use explicitly defined filename
        filename = (filenameMatch[1] || filenameMatch[2] || filenameMatch[3] || filenameMatch[4]).trim();
      } else {
        // Check if this is one of the standard pages by analyzing the code content
        if (pageDetectionRegex.home.test(code) || pageDetectionRegex.home.test(precedingContent)) {
          filename = "index.html";
        } else if (pageDetectionRegex.about.test(code) || pageDetectionRegex.about.test(precedingContent)) {
          filename = "about.html";
        } else if (pageDetectionRegex.services.test(code) || pageDetectionRegex.services.test(precedingContent)) {
          filename = "services.html";
        } else if (pageDetectionRegex.contact.test(code) || pageDetectionRegex.contact.test(precedingContent)) {
          filename = "contact.html";
        } else if (pageDetectionRegex.portfolio.test(code) || pageDetectionRegex.portfolio.test(precedingContent)) {
          filename = "portfolio.html";
        } else {
          // Use standard naming scheme if available
          if (htmlCounter < standardFilenames.length) {
            filename = standardFilenames[htmlCounter];
          } else {
            // Fallback to a generic name if we've exhausted standard names
            filename = `page-${htmlCounter + 1}.html`;
          }
        }
      }
      
      lastMatchIndex = codeRegex.lastIndex;
      
      htmlBlocks.push({
        filename,
        code,
      });
      htmlCounter++;
    }
    
    return { htmlBlocks, cssBlocks, jsBlocks };
  };
  

  // Auto-save code blocks to backend
  useEffect(() => {
    const { htmlBlocks, cssBlocks, jsBlocks } = extractCodeBlocks(content);
    if (htmlBlocks.length === 0) return;

    const payload = {
      htmlBlocks,
      css: cssBlocks.join("\n"),
      js: jsBlocks.join("\n"),
    };

    fetch("http://localhost:3000/api/save-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => console.log("Saved:", data))
      .catch((err) => console.error("Error saving code:", err));
  }, [content]);

  // Render live iframe preview
  const renderIframeContent = (markdown: string): string[] => {
    const { htmlBlocks, cssBlocks, jsBlocks } = extractCodeBlocks(markdown);
    const css = cssBlocks.join("\n");
    const js = jsBlocks.join("\n");

    return htmlBlocks.map(
      ({ code }) => `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              body {
                font-family: system-ui, sans-serif;
                padding: 1rem;
                background: #f9f9f9;
              }
              ${css}
            </style>
          </head>
          <body>
            ${code || "<p style='color: gray;'>No HTML found</p>"}
            <script>
              document.addEventListener("DOMContentLoaded", function () {
                try {
                  ${js}
                } catch (e) {
                  console.error("Script error:", e);
                }
              });
            </script>
          </body>
        </html>
      `
    );
  };

  const memoizedIframeDocs = useMemo(
    () => renderIframeContent(displayedContent.join("\n")),
    [displayedContent]
  );

  return (
    <div className="relative h-full w-full flex flex-col bg-gradient-to-br from-background to-muted/40 rounded-2xl overflow-hidden p-8 shadow-2xl">
      <div className="absolute top-4 right-6 z-10">
        <button
          onClick={() => setLivePreviewMode(!livePreviewMode)}
          className="bg-muted/30 hover:bg-muted/50 backdrop-blur-lg text-foreground text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5 transition shadow-md"
        >
          {livePreviewMode ? <Code2 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {livePreviewMode ? "Code" : "Preview"}
        </button>
      </div>

      {displayedContent.length > 0 ? (
        <div
          className={`relative flex-1 overflow-y-auto thin-scrollbar p-8 bg-muted/30 rounded-xl backdrop-blur-lg transition-all duration-500 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          {livePreviewMode ? (
            <iframe
              title="Live Preview"
              className="w-full h-[80vh] rounded-lg border-2 border-muted bg-white"
              sandbox="allow-scripts allow-same-origin"
              srcDoc={memoizedIframeDocs[0] || ""}
            />
          ) : (
            <div className="space-y-8">
              {displayedContent.map((response, index) => (
                <div
                  key={index}
                  ref={(el) => (contentRefs.current[index] = el)}
                  className="border-b border-muted/50 pb-8"
                >
                  <ReactMarkdown
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code({ inline, className, children, ...props }: any) {
                        const codeText = String(children).trim();

                        if (inline) {
                          return (
                            <code className="bg-muted/20 px-1 py-0.5 rounded text-sm">
                              {codeText}
                            </code>
                          );
                        }

                        return (
                          <div className="relative group my-4">
                            <button
                              onClick={() => handleCopy(codeText)}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-muted/40 text-xs text-foreground px-2 py-1 rounded-md"
                            >
                              {copiedCode === codeText ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <pre className="overflow-x-auto rounded-xl p-4 text-sm bg-[#0d1117] font-mono">
                              <code className={className}>{codeText}</code>
                            </pre>
                          </div>
                        );
                      },
                    }}
                  >
                    {response}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center space-y-4">
          <div>
            <h2 className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Preview Area
            </h2>
            <p className="text-foreground/70 max-w-md mx-auto text-lg leading-relaxed">
              This is where AI's generated code and content will be shown beautifully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewArea;
