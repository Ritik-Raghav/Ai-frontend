export const callGroqAPI = async (prompt: string) => {
  //@ts-ignore
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        // model: "qwen-qwq-32b",
        // model: "deepseek-r1-distill-llama-70b",
        model: "llama3-70b-8192", // or whichever model you are using
        messages: [
          { role: "user", content: prompt }
        ],
      }),
    });
  
    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  };
  