// callGeminiAPI.ts

export const callGeminiAPI = async (prompt: string) => {
    //@ts-ignore
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      }),
    });
  
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }
  
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  };
  