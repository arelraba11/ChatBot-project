export function isMathExpression(text: string): boolean {
   const hasNumber = /\d/.test(text);
   const hasOperator = /[+\-*/()%^]/.test(text);
   return hasNumber && hasOperator;
}

function normalizeMathWords(text: string): string {
   return text
      .replace(/\bplus\b/gi, '+')
      .replace(/\bminus\b/gi, '-')
      .replace(/\btimes\b|\bmultiplied by\b/gi, '*')
      .replace(/\bdivided by\b/gi, '/');
}

function normalizeExponent(expression: string): string {
   return expression.replace(
      /(\d+(?:\.\d+)?|\([^()]+\))\s*\^\s*(\d+(?:\.\d+)?|\([^()]+\))/g,
      'Math.pow($1,$2)'
   );
}

export function calculateMath(expression: string): string {
   try {
      let safeExpression = normalizeMathWords(expression)
         .replace(/[^0-9+\-*/().%^ ]/g, '')
         .trim();

      if (!safeExpression) {
         return 'Invalid expression';
      }

      safeExpression = normalizeExponent(safeExpression);

      const result = eval(safeExpression);

      if (typeof result !== 'number' || Number.isNaN(result)) {
         return 'Invalid calculation';
      }

      return result.toString();
   } catch {
      return 'Calculation error';
   }
}
