import classifierTemplate from '../prompts/classifier.txt';
import { llmClient } from '../llm/client';
import { getWeather } from './apps/weather.app';
import { calculateMath } from './apps/math.app';
import { getExchangeRate } from './apps/exchange.app';
import { generalChat } from './apps/general.app';
import { historyRepository } from '../repositories/history.repository';

type Classification = {
   intent: 'weather' | 'math' | 'exchange' | 'general';
   city: string | null;
   expression: string | null;
   currencyCode: string | null;
};

function fillTemplate(userInput: string) {
   return classifierTemplate.replace('{{USER_INPUT}}', userInput);
}

async function classify(userInput: string): Promise<Classification> {
   const prompt = fillTemplate(userInput);

   const r = await llmClient.generateText({
      model: 'gpt-4o-mini',
      prompt,
      temperature: 0,
      maxTokens: 120,
   });

   // parse JSON strictly
   let obj: any;
   try {
      obj = JSON.parse(r.text);
   } catch {
      // fallback if model messed up
      return {
         intent: 'general',
         city: null,
         expression: null,
         currencyCode: null,
      };
   }

   const intent = obj.intent;
   if (!['weather', 'math', 'exchange', 'general'].includes(intent)) {
      return {
         intent: 'general',
         city: null,
         expression: null,
         currencyCode: null,
      };
   }

   return {
      intent,
      city: typeof obj.city === 'string' ? obj.city : null,
      expression: typeof obj.expression === 'string' ? obj.expression : null,
      currencyCode:
         typeof obj.currencyCode === 'string' ? obj.currencyCode : null,
   };
}

export const routerService = {
   async handleUserMessage(conversationId: string, userInput: string) {
      console.log('ROUTER SERVICE HIT 🧠', { conversationId, userInput });

      // Reset command
      if (userInput.trim() === '/reset') {
         await historyRepository.resetAll();
         return { message: 'בוצע reset ✅ התחלנו שיחה חדשה.' };
      }

      const decision = await classify(userInput);

      let assistantMessage = '';

      if (decision.intent === 'weather' && decision.city) {
         assistantMessage = await getWeather(decision.city);
      } else if (decision.intent === 'math' && decision.expression) {
         assistantMessage = calculateMath(decision.expression);
      } else if (decision.intent === 'exchange' && decision.currencyCode) {
         assistantMessage = getExchangeRate(decision.currencyCode, userInput);
      } else {
         const history = historyRepository.get(conversationId);
         console.log('HISTORY LENGTH:', history.length);
         const r = await generalChat(history, userInput);
         assistantMessage = r.message;
      }

      // Save memory after each interaction
      historyRepository.append(conversationId, {
         role: 'user',
         content: userInput,
      });
      historyRepository.append(conversationId, {
         role: 'assistant',
         content: assistantMessage,
      });
      await historyRepository.save();

      return { message: assistantMessage, intent: decision.intent };
   },
};
