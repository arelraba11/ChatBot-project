import { isMathExpression, calculateMath } from '../services/math.service';
import {
   detectExchangeCurrency,
   getExchangeRate,
} from '../services/exchange.service';
import { chatService } from '../services/chat.service';

export async function route(
   prompt: string,
   conversationId: string
): Promise<string> {
   if (isMathExpression(prompt)) {
      return calculateMath(prompt);
   }

   const currency = detectExchangeCurrency(prompt);
   if (currency) {
      return getExchangeRate(currency);
   }

   const response = await chatService.sendMessage(prompt, conversationId);
   return response.message;
}
