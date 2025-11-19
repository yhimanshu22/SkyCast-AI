import { GoogleGenAI } from "@google/genai";
import { WeatherData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to parse the JSON from the model's response
const cleanAndParseJSON = (text: string): any => {
  try {
    let cleanText = text.replace(/```json\n?/g, "").replace(/```/g, "");
    const firstOpen = cleanText.indexOf("{");
    const lastClose = cleanText.lastIndexOf("}");
    if (firstOpen !== -1 && lastClose !== -1) {
      cleanText = cleanText.substring(firstOpen, lastClose + 1);
    }
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Failed to parse JSON from model response:", text);
    throw new Error("Failed to parse weather data format.");
  }
};

export const fetchWeather = async (query: string): Promise<WeatherData> => {
  try {
    // Using gemini-2.5-flash as the engine for "WeatherNext 2"
    const model = "gemini-2.5-flash";
    
    const prompt = `
      You are "WeatherNext 2", an advanced, production-grade weather forecasting AI.
      
      Your task:
      1. Use Google Search and Google Maps to find the most accurate, real-time weather, location, Air Quality (AQI), and OFFICIAL WEATHER ALERTS for: "${query}".
      2. Analyze the data to provide a helpful summary.
      3. Return strictly valid JSON matching the schema below.

      JSON Schema:
      {
        "location": "City, Country (Official Name)",
        "coordinates": {
          "lat": number,
          "lon": number
        },
        "current": {
          "temp": number (Celsius),
          "condition": "Short string (e.g., Sunny, Heavy Rain)",
          "humidity": "String with %",
          "windSpeed": "String with km/h",
          "feelsLike": number (Celsius),
          "pressure": "String with hPa",
          "uvIndex": "String",
          "aqi": {
            "index": number (US AQI Standard 0-500),
            "category": "String (e.g., Good, Moderate, Unhealthy)",
            "description": "Short string explaining health implication (e.g., 'Safe for outdoor activities')"
          }
        },
        "forecast": [
          {
            "day": "Day name (e.g., Mon)",
            "date": "Short date (e.g., Oct 24)",
            "tempHigh": number (Celsius),
            "tempLow": number (Celsius),
            "condition": "Short string"
          }
          // Ensure exactly 5 days
        ],
        "alerts": [
           {
             "title": "Official Alert Title (e.g., Severe Thunderstorm Warning)",
             "severity": "advisory OR watch OR warning",
             "description": "One sentence summary of the alert"
           }
        ],
        "analysis": "A professional, 2-sentence weather analysis advising on outdoor activities or clothing."
      }
      
      Instructions for Alerts:
      - Only include alerts if there are active official government warnings (NOAA, Met Office, etc.).
      - If no alerts, return an empty array [].
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        // Enable both Search and Maps for maximum accuracy ("WeatherNext 2" capability)
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
      },
    });

    const text = response.text;
    if (!text) throw new Error("No data received from WeatherNext 2 AI.");

    const parsedData = cleanAndParseJSON(text);

    // Process Grounding Metadata for both Web and Maps
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources = groundingChunks
      .map((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          return { title: chunk.web.title, uri: chunk.web.uri, type: 'web' as const };
        }
        if (chunk.maps?.placeAnswerSources?.[0]) {
           // Note: Maps chunks structure can vary, we look for the URI usually in the top level map object or constructed
           // However, usually grounding returns web chunks for weather. 
           // If map tool is active, we might get map chunks for location.
           // We will prioritize explicit links if present.
        }
        // Fallback for generic chunks if they have a URI
        return null;
      })
      .filter(Boolean) as Array<{ title: string; uri: string; type: 'web' | 'map' }>;

    // Explicitly check for Map grounding URI if available directly
    groundingChunks.forEach((chunk: any) => {
      if (chunk.maps?.uri) {
        sources.push({
          title: "Google Maps",
          uri: chunk.maps.uri,
          type: 'map'
        });
      }
    });

    return {
      ...parsedData,
      sources,
    };

  } catch (error) {
    console.error("WeatherNext 2 Fetch Error:", error);
    throw error;
  }
};

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  return fetchWeather(`coordinates ${lat}, ${lon}`);
};