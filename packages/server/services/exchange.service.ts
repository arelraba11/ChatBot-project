export type CurrencyCode = 'USD' | 'EUR' | 'ILS';

export function detectExchangeCurrency(text: string): CurrencyCode | null {
   const t = text.toLowerCase();

   if (t.includes('usd') || t.includes('dollar')) return 'USD';
   if (t.includes('eur') || t.includes('euro')) return 'EUR';
   if (t.includes('ils') || t.includes('shekel')) return 'ILS';

   return null;
}

export function getExchangeRate(currency: CurrencyCode): string {
   const rates: Record<CurrencyCode, number> = {
      USD: 3.2,
      EUR: 4.05,
      ILS: 1,
   };

   return `The exchange rate for ${currency} is ${rates[currency]} ILS`;
}
