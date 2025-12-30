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

      return `The temperature in ${city} is ${temperature}°C with ${description}`;
   } catch {
      return 'Unable to fetch weather data';
   }
}
