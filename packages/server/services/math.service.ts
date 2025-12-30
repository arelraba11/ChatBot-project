export function isMathExpression(text: string): boolean {
   const hasNumber = /\d/.test(text);
   const hasOperator = /[+\-*/()%^]/.test(text);
   return hasNumber && hasOperator;
}

function normalizeExponent(expression: string): string {
   // replaces a^b with Math.pow(a,b)
   return expression.replace(
      /(\d+(?:\.\d+)?|\([^()]+\))\s*\^\s*(\d+(?:\.\d+)?|\([^()]+\))/g,
      'Math.pow($1,$2)'
   );
}

export function calculateMath(expression: string): string {
   try {
      let safeExpression = expression
         // allow modulo %
         .replace(/[^0-9+\-*/().%^ ]/g, '')
         .trim();

      if (!safeExpression) {
         return 'Invalid expression';
      }

      // normalize exponentiation
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
