const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

type OpenWeatherResponse = {
   main?: {
      temp?: number;
   };
   weather?: {
      description?: string;
   }[];
};

/**
 * Detects a weather query by identifying the phrase "מזג אוויר"
 * and extracting the city name that follows it.
 */
export function detectWeatherCity(text: string): string | null {
   const match = text.match(/מזג\s+אוויר\s+(?:ב|של)?\s*(.+)$/i);
   if (!match || !match[1]) return null;

   let city = match[1].trim();

   city = city.replace(/\b(היום|עכשיו)\b/g, '');
   city = city.replace(/[?!.]+$/, '');
   city = city.replace(/\s+/g, ' ').trim();

   return city || null;
}

/**
 * Fetches current weather data for a given city using the OpenWeather API.
 */
export async function getWeather(city: string): Promise<string> {
   try {
      if (!API_KEY) {
         return 'Weather service is not configured';
      }

      const url =
         `${BASE_URL}?q=${encodeURIComponent(city)}` +
         `&appid=${API_KEY}&units=metric&lang=en`;

      const response = await fetch(url);
      if (!response.ok) {
         throw new Error('Weather API error');
      }

      const data = (await response.json()) as OpenWeatherResponse;

      const temperature = data.main?.temp;
      const description = data.weather?.[0]?.description;

      if (temperature === undefined || !description) {
         return 'Unable to fetch weather data';
      }

      return `הטמפרטורה היא ${temperature}°C, ${description}`;
   } catch {
      return 'Unable to fetch weather data';
   }
}
