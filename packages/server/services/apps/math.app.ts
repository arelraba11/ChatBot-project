// services/apps/math.app.ts

export function calculateMath(expression: string): string {
   const expr = expression.trim();
   if (!expr) return 'Empty expression.';

   // If you're using the safe Function-based evaluator:
   const ALLOWED_CHARS = /^[0-9+\-*/().\s]+$/;
   if (!ALLOWED_CHARS.test(expr)) {
      return 'Invalid expression. Use only numbers and + - * / ( ) .';
   }
   if (
      expr.includes('**') ||
      expr.includes('//') ||
      expr.includes('/*') ||
      expr.includes('*/')
   ) {
      return 'Invalid expression.';
   }

   try {
      const result = Function(`"use strict"; return (${expr});`)() as unknown;

      if (typeof result !== 'number' || !Number.isFinite(result)) {
         return 'Result is undefined.';
      }

      const pretty = Number.isInteger(result)
         ? result.toFixed(0)
         : result.toString();
      return `The result is ${pretty}`;
   } catch {
      return "I couldn't compute that. Please check the expression.";
   }
}
