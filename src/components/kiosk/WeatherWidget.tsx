
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Language } from '@/lib/translations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sun, Cloud, CloudRain, CloudSnow, CloudFog, Wind, Zap, Thermometer, Droplets, CloudSun, MountainSnow, CloudDrizzle, Haze, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherData {
  icon: React.ReactNode;
  temperature: number;
  aqiValue: number; 
  aqiCategoryKey: string; 
  weatherDescriptionKey: string; 
  locationName?: string;
}

interface WeatherWidgetProps {
  lang: Language;
  t: (key: string, params?: Record<string, string | number>) => string;
  className?: string;
}

const DEFAULT_LOCATION = { latitude: 37.5665, longitude: 126.9780 }; // Seoul

interface SimulatedWeatherApiResponse {
  weather: Array<{
    id: number; 
    main: string; 
    description: string; 
    icon: string; 
  }>;
  main: {
    temp: number; 
    humidity: number;
  };
  name: string; 
}

interface SimulatedAqiApiResponse {
  list: Array<{
    main: {
      aqi: number; 
    };
    components: {
      pm2_5: number; 
      pm10: number; 
    };
  }>;
}

const getWeatherIcon = (
  conditionCode: number,
  lang: Language,
  t: (key: string, params?: Record<string, string | number>) => string,
): { icon: React.ReactNode; descriptionKey: string } => {
  if (conditionCode >= 200 && conditionCode < 300) return { icon: <Zap />, descriptionKey: "weather.description.thunderstorm" };
  if (conditionCode >= 300 && conditionCode < 400) return { icon: <CloudDrizzle />, descriptionKey: "weather.description.lightRain" };
  if (conditionCode >= 500 && conditionCode < 600) return { icon: <CloudRain />, descriptionKey: "weather.description.rain" };
  if (conditionCode >= 600 && conditionCode < 700) return { icon: <CloudSnow />, descriptionKey: "weather.description.snow" };
  if (conditionCode >= 700 && conditionCode < 800) {
    if (conditionCode === 701 || conditionCode === 741) return { icon: <CloudFog />, descriptionKey: "weather.description.fog" };
    if (conditionCode === 711) return { icon: <MountainSnow />, descriptionKey: "weather.description.smoke" };
    if (conditionCode === 721) return { icon: <Haze />, descriptionKey: "weather.description.haze" };
    if (conditionCode === 731 || conditionCode === 761) return { icon: <Wind />, descriptionKey: "weather.description.dust" };
    return { icon: <CloudFog />, descriptionKey: "weather.description.mist" };
  }
  if (conditionCode === 800) return { icon: <Sun />, descriptionKey: "weather.description.clear" };
  if (conditionCode === 801) return { icon: <CloudSun />, descriptionKey: "weather.description.fewClouds" };
  if (conditionCode === 802) return { icon: <Cloud />, descriptionKey: "weather.description.scatteredClouds" };
  if (conditionCode === 803 || conditionCode === 804) return { icon: <Cloud />, descriptionKey: "weather.description.brokenClouds" };
  
  return { icon: <Cloud />, descriptionKey: "weather.description.clouds" };
};

const getAqiCategoryKey = (aqiIndex: number): string => {
  if (aqiIndex === 1) return "weather.aqi.good";
  if (aqiIndex === 2) return "weather.aqi.fair";
  if (aqiIndex === 3) return "weather.aqi.moderate";
  if (aqiIndex === 4) return "weather.aqi.unhealthy";
  if (aqiIndex === 5) return "weather.aqi.veryUnhealthy";
  return "weather.aqi.moderate";
};

export function WeatherWidget({ lang, t, className }: WeatherWidgetProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAndSetWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let lat = DEFAULT_LOCATION.latitude;
      let lon = DEFAULT_LOCATION.longitude;

      if (typeof window !== 'undefined' && navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          lat = position.coords.latitude;
          lon = position.coords.longitude;
        } catch (geoError) {
          console.warn("Geolocation failed or denied, using default location.", geoError);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000)); 

      const mockWeatherConditionId = [800, 801, 802, 500, 600, 211, 721][Math.floor(Math.random() * 7)];
      const mockTemp = Math.floor(Math.random() * 15) + 10; 
      const mockAqiIndex = Math.floor(Math.random() * 5) + 1; 
      const mockPm25 = Math.floor(Math.random() * 70) + 5;   

      const weatherJson: SimulatedWeatherApiResponse = {
        weather: [{ id: mockWeatherConditionId, main: "Simulated", description: "simulated", icon: "01d" }],
        main: { temp: mockTemp, humidity: 60 },
        name: lat === DEFAULT_LOCATION.latitude ? "Seoul (Default)" : "Current Location",
      };
      const aqiJson: SimulatedAqiApiResponse = {
        list: [{ main: { aqi: mockAqiIndex }, components: { pm2_5: mockPm25, pm10: mockPm25 + 10 } }],
      };

      if (!weatherJson.weather || !weatherJson.weather.length || !aqiJson.list || !aqiJson.list.length) {
        throw new Error("Invalid API response structure");
      }

      const { icon, descriptionKey } = getWeatherIcon(weatherJson.weather[0].id, lang, t);
      
      setWeatherData({
        icon: icon,
        temperature: Math.round(weatherJson.main.temp),
        aqiValue: Math.round(aqiJson.list[0].components.pm2_5),
        aqiCategoryKey: getAqiCategoryKey(aqiJson.list[0].main.aqi),
        weatherDescriptionKey: descriptionKey,
        locationName: weatherJson.name,
      });

    } catch (err) {
      console.error("Failed to fetch weather data:", err);
      setError(t("weather.error"));
      setWeatherData(null); 
    } finally {
      setLoading(false);
    }
  }, [lang, t]);

  useEffect(() => {
    fetchAndSetWeather();
    const intervalId = setInterval(fetchAndSetWeather, 30 * 60 * 1000); 
    return () => clearInterval(intervalId);
  }, [fetchAndSetWeather]);

  if (loading) {
    return (
      <Card className={cn("w-full mx-auto p-4 rounded-lg shadow-md bg-sky-100 dark:bg-slate-700 text-sky-800 dark:text-slate-100 flex flex-col", className)}>
        <CardHeader className="p-2 pb-1">
          <CardTitle className="text-lg font-semibold text-center">{t("weather.title")}</CardTitle>
        </CardHeader>
        <CardContent className="p-2 flex flex-col items-center justify-center space-y-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </CardContent>
      </Card>
    );
  }

  if (error || !weatherData) {
    return (
      <Card className={cn("w-full mx-auto p-4 rounded-lg shadow-md bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 flex flex-col", className)}>
        <CardHeader className="p-2 pb-1">
          <CardTitle className="text-lg font-semibold text-center">{t("weather.title")}</CardTitle>
        </CardHeader>
        <CardContent className="p-2 flex flex-col items-center justify-center space-y-2 text-center">
          <AlertTriangle size={32} className="mb-2"/>
          <p className="text-sm">{error || t("weather.error")}</p>
        </CardContent>
      </Card>
    );
  }
  
  const aqiDescription = `${t("weather.label.pm25")}: ${weatherData.aqiValue}µg/m³ (${t(weatherData.aqiCategoryKey)})`;

  return (
    <Card className={cn(
      "w-full mx-auto p-4 rounded-lg shadow-md bg-sky-100 dark:bg-slate-700 text-sky-800 dark:text-slate-100 flex flex-col",
      className
    )}>
      <CardHeader className="p-2 pb-1">
        <CardTitle className="text-lg font-semibold text-center">{t("weather.title")} {weatherData.locationName && <span className="text-xs font-normal">({weatherData.locationName})</span>}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex flex-row items-center justify-start space-x-4">
        {/* Icon on the left */}
        <div className="text-5xl text-yellow-500 dark:text-yellow-400">
          {React.cloneElement(weatherData.icon as React.ReactElement, { size: 64 })}
        </div>
        {/* Details on the right, stacked vertically */}
        <div className="flex flex-col items-start text-left">
          <p className="text-3xl font-bold">{weatherData.temperature}°C</p>
          <p className="text-sm">{t(weatherData.weatherDescriptionKey)}</p>
          <div className="pt-1">
            <p className="text-xs font-medium">{t("weather.airQuality")}</p>
            <p className="text-xs">{aqiDescription}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
