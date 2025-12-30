import { llmClient } from '../llm/client';

type ChatMessage = {
   role: 'user' | 'assistant';
   content: string;
};

type ChatResponse = {
   id: string;
   message: string;
};

const HISTORY_FILE = 'history.json';

const instructions = `
You are a helpful AI assistant.
Answer the user's questions clearly and concisely.
`;

let history: ChatMessage[] = [];
let shouldSendWelcomeBack = false;

// Load history on startup
if (await Bun.file(HISTORY_FILE).exists()) {
   history = await Bun.file(HISTORY_FILE).json();

   if (history.length > 0) {
      shouldSendWelcomeBack = true;
   }
} else {
   history = [];
}

function buildPromptFromHistory(
   history: ChatMessage[],
   userPrompt: string
): string {
   const historyText = history
      .map((msg) =>
         msg.role === 'user'
            ? `User: ${msg.content}`
            : `Assistant: ${msg.content}`
      )
      .join('\n');

   return `
${instructions}

Conversation so far:
${historyText}

User: ${userPrompt}
Assistant:
`.trim();
}

export const chatService = {
   async sendMessage(prompt: string): Promise<ChatResponse> {
      // Reset command
      if (prompt.trim() === '/reset') {
         history = [];
         shouldSendWelcomeBack = false;

         await Bun.write(HISTORY_FILE, JSON.stringify(history, null, 2));

         return {
            id: 'reset',
            message:
               'The conversation has been reset. You can start a new one.',
         };
      }

      // Send welcome-back message once, before any LLM response
      if (shouldSendWelcomeBack) {
         shouldSendWelcomeBack = false;

         return {
            id: 'welcome-back',
            message:
               'Welcome back! Your previous conversation has been restored.',
         };
      }

      const fullPrompt = buildPromptFromHistory(history, prompt);

      const response = await llmClient.generateText({
         model: 'gpt-4o-mini',
         instructions: '', // already embedded in the prompt
         prompt: fullPrompt,
         temperature: 0.2,
         maxTokens: 200,
      });

      history.push({ role: 'user', content: prompt });
      history.push({ role: 'assistant', content: response.text });

      await Bun.write(HISTORY_FILE, JSON.stringify(history, null, 2));

      return {
         id: response.id,
         message: response.text,
      };
   },
};
