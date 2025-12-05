import { GoogleGenAI } from "@google/genai";
import { AppSettings, Message, Attachment, GroundingSource } from "../types";

// Helper to sanitize model names based on features
const resolveModelName = (settings: AppSettings): string => {
  return settings.model;
};

export const streamGeminiResponse = async (
  settings: AppSettings,
  history: Message[],
  currentMessage: string,
  attachments: Attachment[],
  onChunk: (text: string) => void,
  onDone: (finalText: string, groundingSources?: GroundingSource[]) => void,
  onError: (error: Error) => void
) => {
  // API Key is exclusively from environment variable
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    onError(new Error("Internal Configuration Error: API_KEY is missing from environment."));
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // Construct content parts
    const parts: any[] = [];
    
    // 1. Add attachments (Images/Docs converted to Base64)
    if (attachments && attachments.length > 0) {
      attachments.forEach(att => {
        // Strip data:image/png;base64, prefix if present for clean base64
        const base64Data = att.data.includes('base64,') 
          ? att.data.split('base64,')[1] 
          : att.data;
          
        parts.push({
          inlineData: {
            mimeType: att.mimeType,
            data: base64Data
          }
        });
      });
    }

    // 2. Add text prompt
    parts.push({ text: currentMessage });

    // 3. Configure tools and settings
    const config: any = {
      systemInstruction: settings.systemInstruction,
      temperature: settings.enableThinking ? undefined : settings.temperature, // Temperature usually ignored or must be low for reasoning
    };

    // Web Search (Grounding)
    if (settings.enableWebSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    // Thinking Mode
    if (settings.enableThinking && settings.thinkingBudget > 0) {
        // Only apply thinking budget if model supports it (simplified check)
        if (settings.model.includes('thinking') || settings.model.includes('pro')) {
             config.thinkingConfig = { thinkingBudget: settings.thinkingBudget };
        }
    }

    // 4. Create Chat Session to maintain history context
    // We need to map our Message type to Gemini's Content type
    const historyContents = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }] // Simplified history
    }));

    const chat = ai.chats.create({
      model: resolveModelName(settings),
      config: config,
      history: historyContents
    });

    // 5. Stream Request
    const resultStream = await chat.sendMessageStream({
      message: parts
    });

    let fullText = "";
    let capturedGrounding: GroundingSource[] = [];

    for await (const chunk of resultStream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
      
      // Capture grounding chunks if available
      const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
          groundingChunks.forEach((g: any) => {
              if (g.web?.uri && g.web?.title) {
                  capturedGrounding.push({
                      title: g.web.title,
                      uri: g.web.uri
                  });
              }
          });
      }
    }

    // Deduplicate grounding sources
    const uniqueGrounding = Array.from(new Map(capturedGrounding.map(item => [item.uri, item])).values());

    onDone(fullText, uniqueGrounding.length > 0 ? uniqueGrounding : undefined);

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    onError(error instanceof Error ? error : new Error(error.message || "Unknown error occurred"));
  }
};