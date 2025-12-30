type CurrencyCode = 'USD' | 'EUR' | 'ILS';

/**
 * Detects a currency exchange query and extracts the currency code.
 * Uses deterministic string matching (no LLM).
 */
export function detectExchangeCurrency(text: string): CurrencyCode | null {
   const t = text.toLowerCase();

   if (t.includes('usd') || t.includes('דולר')) return 'USD';
   if (t.includes('eur') || t.includes('אירו')) return 'EUR';
   if (t.includes('ils') || t.includes('שקל')) return 'ILS';

   return null;
}

/**
 * Returns a static exchange rate for a given currency.
 */
export function getExchangeRate(currency: CurrencyCode): string {
   const rates: Record<CurrencyCode, number> = {
      USD: 3.2,
      EUR: 4.05,
      ILS: 1,
   };

   const rate = rates[currency];
   return `שער ${currency} הוא ${rate} ₪`;
}
