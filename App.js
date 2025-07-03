import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from 'react-native';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');

  const getWeatherData = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    try {
      const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

      const currentRes = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      const forecastRes = await fetch(
        `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
      );

      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();

      if (currentData.cod === 200 && forecastData.cod === '200') {
        setWeather({
          temp: currentData.main.temp,
          description: currentData.weather[0].description,
          name: currentData.name,
        });

        const dailyData = forecastData.list
          .filter(item => item.dt_txt.includes('12:00:00'))
          .slice(0, 5);

        setForecast(dailyData);
        setError('');
        Keyboard.dismiss();
      } else {
        setWeather(null);
        setForecast([]);
        setError('City not found');
      }
    } catch (err) {
      setError('Something went wrong');
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>🌤️ Weather App</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          placeholderTextColor="#666"
          value={city}
          onChangeText={setCity}
        />

        <TouchableOpacity style={styles.button} onPress={getWeatherData}>
          <Text style={styles.buttonText}>Get Weather</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {weather && (
          <View style={styles.weatherBox}>
            <Text style={styles.city}>{weather.name}</Text>
            <Text style={styles.temp}>{weather.temp}°C</Text>
            <Text style={styles.desc}>{weather.description}</Text>
          </View>
        )}

        {forecast.length > 0 && (
          <View style={styles.forecastBox}>
            <Text style={styles.forecastTitle}>5-Day Forecast</Text>
            {forecast.map((day, index) => (
              <View key={index} style={styles.forecastCard}>
                <Text style={styles.cardDate}>
                  {new Date(day.dt_txt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                  })}
                </Text>
                <Text style={styles.cardTemp}>
                  {Math.round(day.main.temp)}°C
                </Text>
                <Text style={styles.cardDesc}>
                  {day.weather[0].description}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    color: '#e2e8f0',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    color: '#f1f5f9',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  weatherBox: {
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  city: {
    fontSize: 26,
    color: '#f1f5f9',
    fontWeight: 'bold',
  },
  temp: {
    fontSize: 50,
    color: '#38bdf8',
  },
  desc: {
    fontSize: 20,
    color: '#cbd5e1',
    marginTop: 10,
    textTransform: 'capitalize',
  },
  forecastBox: {
    marginTop: 30,
  },
  forecastTitle: {
    fontSize: 22,
    color: '#e2e8f0',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  forecastCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardDate: {
    color: '#facc15',
    fontSize: 18,
    marginBottom: 6,
    fontWeight: '600',
  },
  cardTemp: {
    fontSize: 26,
    color: '#38bdf8',
    fontWeight: 'bold',
  },
  cardDesc: {
    color: '#94a3b8',
    fontSize: 16,
    marginTop: 8,
    textTransform: 'capitalize',
  },
});
