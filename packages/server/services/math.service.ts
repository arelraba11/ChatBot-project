export function isMathExpression(text: string): boolean {
   const hasNumber = /\d/.test(text);
   const hasOperator = /[+\-*/()%^]|ועוד|פלוס|מינוס|פחות|כפול|חלקי|לחלק/.test(
      text
   );
   return hasNumber && hasOperator;
}

/**
 * Normalizes common Hebrew math words into mathematical operators.
 * This allows deterministic evaluation without using NLP or LLMs.
 */
function normalizeHebrewMath(text: string): string {
   return text
      .replace(/ועוד/g, '+')
      .replace(/פלוס/g, '+')
      .replace(/פחות/g, '-')
      .replace(/מינוס/g, '-')
      .replace(/כפול/g, '*')
      .replace(/חלקי/g, '/')
      .replace(/לחלק/g, '/');
}

/**
 * Replaces exponentiation (a^b) with Math.pow(a, b)
 */
function normalizeExponent(expression: string): string {
   return expression.replace(
      /(\d+(?:\.\d+)?|\([^()]+\))\s*\^\s*(\d+(?:\.\d+)?|\([^()]+\))/g,
      'Math.pow($1,$2)'
   );
}

export function calculateMath(expression: string): string {
   try {
      // Normalize Hebrew math words
      const normalized = normalizeHebrewMath(expression);

      let safeExpression = normalized.replace(/[^0-9+\-*/().%^ ]/g, '').trim();

      if (!safeExpression) {
         return 'Invalid expression';
      }

      // Normalize exponentiation
      safeExpression = normalizeExponent(safeExpression);

      const result = eval(safeExpression);

      if (typeof result !== 'number' || Number.isNaN(result)) {
         return 'Invalid calculation';
      }

      return result.toString();
   } catch {
      return 'Calculate error';
   }
}
