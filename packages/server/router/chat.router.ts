import { classifyIntent } from './classifyIntent';
import { calculateMath } from '../services/math.service';
import { getExchangeRate } from '../services/exchange.service';
import { getWeather } from '../services/weather.service';
import { chatService } from '../services/chat.service';

/**
 * Routes user input based on LLM classification result.
 * Executes deterministic logic for known intents and falls back to LLM for general chat.
 */
export async function route(
   prompt: string,
   conversationId: string
): Promise<string> {
   const intent = await classifyIntent(prompt);

   switch (intent.intent) {
      case 'math':
         if (!intent.expression) {
            return 'לא הצלחתי להבין את התרגיל';
         }
         return calculateMath(intent.expression);

      case 'exchange':
         if (!intent.currencyCode) {
            return 'איזה מטבע לבדוק?';
         }
         return getExchangeRate(intent.currencyCode);

      case 'weather':
         if (!intent.city) {
            return 'לא הצלחתי להבין איזו עיר';
         }
         return await getWeather(intent.city);

      case 'general':
      default:
         const response = await chatService.sendMessage(prompt, conversationId);
         return response.message;
   }
}
