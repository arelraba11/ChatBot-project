import { isMathExpression, calculateMath } from '../services/math.service';
import { chatService } from '../services/chat.service';

export async function route(
   prompt: string,
   conversationId: string
): Promise<string> {
   // math handled by backend
   if (isMathExpression(prompt)) {
      return calculateMath(prompt);
   }

   // general chat → LLM
   const response = await chatService.sendMessage(prompt, conversationId);
   return response.message;
}
