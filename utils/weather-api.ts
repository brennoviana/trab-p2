import { WEATHER_API_KEY } from '@/config/api-config';

export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
}

export async function fetchWeatherData(city: string): Promise<WeatherData> {
  if (!WEATHER_API_KEY) {
    throw new Error(
      'Chave da API não configurada. Por favor, configure sua chave da OpenWeatherMap no arquivo config/api-config.ts'
    );
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${WEATHER_API_KEY}&units=metric&lang=pt_br`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Cidade não encontrada. Verifique o nome e tente novamente.');
      }
      if (response.status === 401) {
        throw new Error('Chave da API inválida. Verifique sua configuração.');
      }
      throw new Error(`Erro ao buscar dados: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro ao conectar com o servidor. Verifique sua conexão.');
  }
}

