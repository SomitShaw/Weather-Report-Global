import React, { useState, useEffect } from "react";
import axios from "axios";

// Define the WeatherData type
type WeatherData = {
  location: {
    city: string;
    region: string;
    country: string;
  };
  current_observation: {
    condition: {
      temperature: number;
      text: string;
      code: string;
    };
    atmosphere: {
      humidity: number;
    };
    wind: {
      speed: number;
    };
    astronomy: {
      sunrise: string;
      sunset: string;
    };
  };
};

const WeatherCard = ({ weatherData }: { weatherData: WeatherData }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-xl shadow-lg w-full md:w-96">
      <div className="text-center mb-4">
        <h2 className="text-4xl font-bold">{weatherData.location.city}</h2>
        <p className="text-sm">
          {weatherData.location.region}, {weatherData.location.country}
        </p>
      </div>

      <div className="flex justify-center items-center space-x-6">
        <div className="text-6xl font-bold">
          {weatherData.current_observation.condition.temperature}°C
        </div>
        <div>
          <img
            className="w-20"
            src={`https://openweathermap.org/img/wn/${weatherData.current_observation.condition.code}.png`}
            alt="weather-icon"
          />
          <p className="text-lg">
            {weatherData.current_observation.condition.text}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p>Humidity:</p>
          <p className="font-bold">
            {weatherData.current_observation.atmosphere.humidity}%
          </p>
        </div>
        <div>
          <p>Wind:</p>
          <p className="font-bold">
            {weatherData.current_observation.wind.speed} km/h
          </p>
        </div>
        <div>
          <p>Sunrise:</p>
          <p className="font-bold">
            {weatherData.current_observation.astronomy.sunrise}
          </p>
        </div>
        <div>
          <p>Sunset:</p>
          <p className="font-bold">
            {weatherData.current_observation.astronomy.sunset}
          </p>
        </div>
      </div>
    </div>
  );
};

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<string>("London"); // Default location
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeather(location);
  }, [location]);

  const fetchWeather = async (location: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://open-weather13.p.rapidapi.com/city/${location}/EN`,
        {
          headers: {
            "X-RapidAPI-Host": "open-weather13.p.rapidapi.com",
            "X-RapidAPI-Key": "API-Key-HERE", // Replace with your RapidAPI key
          },
        }
      );

      const data = response.data;
      const formattedData: WeatherData = {
        location: {
          city: data.name,
          region: data.sys.country,
          country: data.sys.country,
        },
        current_observation: {
          condition: {
            temperature: data.main.temp,
            text: data.weather[0].description,
            code: data.weather[0].icon,
          },
          atmosphere: {
            humidity: data.main.humidity,
          },
          wind: {
            speed: data.wind.speed,
          },
          astronomy: {
            sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
            sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
          },
        },
      };

      setWeatherData(formattedData);
    } catch (err) {
      setError("Error fetching weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const handleSearch = () => {
    fetchWeather(location);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center flex-col">
      <div className="mb-4">
        <input
          type="text"
          value={location}
          onChange={handleLocationChange}
          placeholder="Enter city name"
          className="p-2 rounded border border-gray-300"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded ml-2"
        >
          Search
        </button>
      </div>
      {loading ? (
        <p>Loading weather data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        weatherData && <WeatherCard weatherData={weatherData} />
      )}
    </div>
  );
};

export default WeatherApp;
