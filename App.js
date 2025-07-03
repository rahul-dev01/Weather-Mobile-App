import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Keyboard } from 'react-native';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const getWeatherData = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    try {
      const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

      const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
      const data = await response.json();
      

      if (data.cod === 200) {
        setWeather({
          temp: data.main.temp,
          description: data.weather[0].description,
          name: data.name,
        });
        setError('');
        Keyboard.dismiss(); // hide keyboard after search
      } else {
        setWeather(null);
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
      <Text style={styles.title}>🌤️ Weather App</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter city name"
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#1e90ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
  weatherBox: {
    marginTop: 30,
    alignItems: 'center',
  },
  city: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
  },
  temp: {
    fontSize: 50,
    color: '#fff',
  },
  desc: {
    fontSize: 20,
    color: '#ccc',
    marginTop: 10,
    textTransform: 'capitalize',
  },
});
