import type { ChatMessage, GeminiResponse } from '@/types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function sendToGemini(
  apiKey: string,
  message: string,
  imageData: string | null,
  chatHistory: ChatMessage[]
): Promise<{ content: string; type: 'text' | 'markdown' }> {
  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [
    { text: message }
  ];

  if (imageData) {
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Data
      }
    });
  }

  const systemPrompt = `You are a helpful assistant to help students prepare for exams. Users will ask
questions about slides in a pdf, or questions mostly about in the context of the provided images.
Keep your answers direct and short.
IMPORTANT: Format your response as a JSON object: 'content' containing your actual response,
and 'type' which is either 'text' for plain text or 'markdown' for markdown.
Answer the questions in a way that is easy to understand and follow and even if the answer is not in the provided image answer basic knowledge.
Prefer markdown formatting.`;

  const chatHistoryContext = chatHistory
    .filter(msg => msg.role === 'user' || msg.role === 'assistant')
    .map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

  const requestBody = {
    contents: [
      ...chatHistoryContext,
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      },
      {
        role: "user",
        parts: parts
      }
    ]
  };

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${errorText}`);
  }

  const data: GeminiResponse = await response.json();
  
  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('No response from Gemini API');
  }

  const responseText = data.candidates[0].content.parts[0].text;
  
  // Try to extract JSON if present
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        content: parsed.content || responseText,
        type: parsed.type || 'markdown'
      };
    }
  } catch {
    // If JSON parsing fails, return as markdown
  }
  
  return {
    content: responseText,
    type: 'markdown'
  };
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: "Hello" }]
        }]
      })
    });
    
    return response.ok;
  } catch {
    return false;
  }
}
