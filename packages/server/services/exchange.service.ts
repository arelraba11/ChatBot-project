export function detectExchangeCurrency(text: string): string | null {
   const t = text.toLowerCase();
   if (t.includes('usd') || t.includes('דולר')) return 'USD';
   if (t.includes('eur') || t.includes('אירו')) return 'EUR';
   if (t.includes('ils') || t.includes('שקל')) return 'ILS';
   return null;
}

export function getExchangeRate(currency: string): string {
   const rates: Record<string, number> = {
      USD: 3.75,
      EUR: 4.05,
      ILS: 1,
   };

   const rate = rates[currency];
   if (!rate) {
      return 'Unsupported currency';
   }

   return `The exchange rate for ${currency} is ${rate} ₪`;
}
