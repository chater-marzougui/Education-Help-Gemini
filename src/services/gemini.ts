import type { ChatMessage, GeminiResponse, GeminiModel } from "@/types";

const GEMINI_API_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

export const GEMINI_MODELS = {
  'gemini-2.0-flash-exp': {
    id: 'gemini-2.0-flash-exp' as GeminiModel,
    name: 'Gemini 2.0 Flash',
    description: 'Latest experimental model - Fast and efficient',
  },
  'gemini-1.5-flash': {
    id: 'gemini-1.5-flash' as GeminiModel,
    name: 'Gemini 1.5 Flash',
    description: 'Fast responses with good quality',
  },
  'gemini-1.5-pro': {
    id: 'gemini-1.5-pro' as GeminiModel,
    name: 'Gemini 1.5 Pro',
    description: 'Best quality, slower responses',
  },
} as const;

export async function sendToGemini(
  apiKey: string,
  message: string,
  imageData: string | null,
  chatHistory: ChatMessage[],
  model: GeminiModel = 'gemini-2.0-flash-exp',
  contextImages: string[] = []
): Promise<{ content: string; type: "text" | "markdown" }> {
  const parts: Array<{
    text?: string;
    inlineData?: { mimeType: string; data: string };
  }> = [{ text: message }];

  // Add context images (previous slides) first
  if (contextImages.length > 0) {
    for (const imgData of contextImages) {
      const base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      });
    }
  }

  // Add current slide image last
  if (imageData) {
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data,
      },
    });
  }

  const systemPrompt = `You are an expert educational assistant designed to help students understand and study from PDF slides and course materials.

**Your Primary Goals:**
- Provide clear, concise, and educational explanations
- Help students understand complex concepts
- Answer questions based on the provided slide images
- Offer study tips and memory aids when relevant

**Context Information:**
${contextImages.length > 0 ? `- You have been provided with ${contextImages.length} previous slide(s) for context` : '- No previous slides provided'}
${imageData ? '- The LAST image shown is the current slide the student is asking about' : '- No current slide image provided'}

**Response Guidelines:**
1. Focus primarily on the LAST slide image (current slide) when analyzing or answering
2. Use previous slides only for additional context if needed
3. Structure your answers clearly with headings, bullet points, or numbered lists
4. Highlight key concepts, definitions, and important points
5. If the slide contains formulas or technical content, explain them step-by-step
6. If asked about something not in the images, provide general educational knowledge
7. Keep explanations student-friendly and accessible

**Response Format:**
Return your response as a JSON object with:
- "content": Your complete answer (use Markdown for formatting)
- "type": Always set to "markdown"

Example format:
{
  "content": "## Key Concepts\\n\\n- **Point 1**: Explanation...\\n- **Point 2**: Explanation...",
  "type": "markdown"
}`;

  const chatHistoryContext = chatHistory
    .filter((msg) => msg.role === "user" || msg.role === "assistant")
    .slice(-10) // Keep last 10 messages for context
    .map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

  const requestBody = {
    contents: [
      ...chatHistoryContext,
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "user",
        parts: parts,
      },
    ],
  };

  const apiUrl = `${GEMINI_API_BASE_URL}/${model}:generateContent`;
  const response = await fetch(`${apiUrl}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${errorText}`);
  }

  const data: GeminiResponse = await response.json();

  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("No response from Gemini API");
  }

  const responseText = data.candidates[0].content.parts[0].text;

  // Try to extract JSON if present
  try {
    const jsonMatch = new RegExp(/\{[\s\S]*\}/).exec(responseText);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        content: parsed.content || responseText,
        type: parsed.type || "markdown",
      };
    }
  } catch {
    // If JSON parsing fails, return as markdown
  }

  return {
    content: responseText,
    type: "markdown",
  };
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const apiUrl = `${GEMINI_API_BASE_URL}/gemini-2.0-flash-exp:generateContent`;
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: "Hello" }],
          },
        ],
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}
