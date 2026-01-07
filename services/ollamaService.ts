import { Message } from "../types";

export interface StreamCallbacks {
  onChunk: (text: string, thinking?: string) => void;
  onComplete: (usage?: any) => void;
  onError: (error: Error) => void;
}

export interface OllamaConfig {
  baseUrl: string;
  model: string;
}

export const sendMessageStream = async (
  model: string,
  history: Message[],
  newMessage: string,
  callbacks: StreamCallbacks,
  config: OllamaConfig
) => {
  try {
    const baseUrl = config.baseUrl || 'http://localhost:11434';
    
    const messages = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    messages.push({ role: 'user', content: newMessage });

    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: true
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let fullContent = "";
    let fullThinking = "";
    let promptEvalCount = 0;
    let evalCount = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          
          // Handle Ollama's native think field (used by models like DeepSeek R1)
          if (data.message?.think) {
            fullThinking += data.message.think;
          }
          
          if (data.message?.content) {
            let chunkContent = data.message.content;
            fullContent += chunkContent;
          }
          
          // Extract thinking from <think> or <thinking> tags in the full content
          // This handles cases where the tags are split across chunks
          const thinkTagRegex = /<think(?:ing)?>([\s\S]*?)<\/think(?:ing)?>/g;
          const thinkingFromFull = fullContent.match(thinkTagRegex);
          if (thinkingFromFull) {
            for (const match of thinkingFromFull) {
              const thinkingContent = match.replace(/<\/?think(?:ing)?>/g, '').trim();
              if (thinkingContent && !fullThinking.includes(thinkingContent)) {
                fullThinking += (fullThinking ? '\n' : '') + thinkingContent;
              }
            }
            // Remove the thinking tags from the display content
            fullContent = fullContent.replace(thinkTagRegex, "").trim();
          }

          callbacks.onChunk(fullContent, fullThinking || undefined);
          
          if (data.prompt_eval_count !== undefined) {
            promptEvalCount = data.prompt_eval_count;
          }
          if (data.eval_count !== undefined) {
            evalCount = data.eval_count;
          }
          if (data.done) {
            break;
          }
        } catch {
        }
      }
    }

    callbacks.onComplete({
      promptTokenCount: promptEvalCount,
      candidatesTokenCount: evalCount,
      totalTokenCount: promptEvalCount + evalCount
    });

  } catch (error) {
    console.error("Ollama API Error:", error);
    callbacks.onError(error instanceof Error ? error : new Error("Unknown error"));
  }
};

export const fetchOllamaModels = async (baseUrl: string): Promise<string[]> => {
  try {
    const response = await fetch(`${baseUrl || 'http://localhost:11434'}/api/tags`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }

    const data = await response.json();
    return data.models?.map((model: any) => model.name) || [];
  } catch (error) {
    console.error("Error fetching Ollama models:", error);
    return [];
  }
};
