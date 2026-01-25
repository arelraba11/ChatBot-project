import template from '../../prompts/chatbot.txt';
import { llmClient } from '../../llm/client';
import type { ChatMessage } from '../../repositories/history.repository';

function historyToText(history: ChatMessage[]) {
   return history
      .slice(-20) // keep it small to avoid huge prompts
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');
}

export async function generalChat(history: ChatMessage[], userInput: string) {
   const historyBlock = history.length ? historyToText(history) : '(empty)';

   const fullPrompt = `
${template}

Conversation history:
${historyBlock}

User: ${userInput}
Assistant:
`.trim();

   const response = await llmClient.generateText({
      model: 'gpt-4o-mini',
      prompt: fullPrompt,
      temperature: 0.2,
      maxTokens: 200,
   });

   return { id: response.id, message: response.text };
}
