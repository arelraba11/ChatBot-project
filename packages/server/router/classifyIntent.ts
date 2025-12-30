import fs from 'fs';
import path from 'path';
import { llmClient } from '../llm/client';

const classifierPrompt = fs.readFileSync(
   path.join(__dirname, '../prompts/classifier.txt'),
   'utf-8'
);

export type IntentResult = {
   intent: 'weather' | 'math' | 'exchange' | 'general';
   city: string | null;
   expression: string | null;
   currencyCode: string | null;
};

const VALID_INTENTS = ['weather', 'math', 'exchange', 'general'] as const;

export async function classifyIntent(prompt: string): Promise<IntentResult> {
   const response = await llmClient.generateText({
      model: 'gpt-4o-mini',
      instructions: classifierPrompt,
      prompt,
      temperature: 0,
      maxTokens: 150,
   });

   try {
      const parsed = JSON.parse(response.text);

      if (!VALID_INTENTS.includes(parsed.intent)) {
         throw new Error('Invalid intent');
      }

      return {
         intent: parsed.intent,
         city: parsed.city ?? null,
         expression: parsed.expression ?? null,
         currencyCode: parsed.currencyCode ?? null,
      };
   } catch {
      // Fallback: treat as general chat
      return {
         intent: 'general',
         city: null,
         expression: null,
         currencyCode: null,
      };
   }
}
