import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import citiesData from "./cities.json";

const cities = citiesData.cities;

const API_URL = "https://api.openweathermap.org/data/2.5/weather";
const API_KEY = "5bdbd25cec0f9658a4b814b0cf22c8bd";

const backgroundImageMap = {
  "clear sky": require("./assets/sunny.jpg"),
  "few clouds": require("./assets/cloudy.jpg"),
  "scattered clouds": require("./assets/cloudy.jpg"),
  "broken clouds": require("./assets/cloudy.jpg"),
  "shower rain": require("./assets/rainy.jpg"),
  "rain": require("./assets/rainy.jpg"),
  "thunderstorm": require("./assets/stormy.jpg"),
  "snow": require("./assets/snowy.jpg"),
  "mist": require("./assets/misty.jpg"),
};

const App = () => {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    fetchWeatherData(selectedCity.latitude, selectedCity.longitude);
  }, []);

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `${API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.log("Hava durumu verileri alınırken bir hata oluştu:", error);
    }
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    fetchWeatherData(city.latitude, city.longitude);
  };

  const translateDescription = (description) => {
    switch (description) {
      case "clear sky":
        return "Açık Hava";
      case "few clouds":
        return "Az Bulutlu";
      case "scattered clouds":
        return "Parçalı Bulutlu";
      case "broken clouds":
        return "Yer Yer Bulutlu";
      case "shower rain":
        return "Sağanak Yağışlı";
      case "rain":
        return "Yağmurlu";
      case "thunderstorm":
        return "Gök Gürültülü Fırtına";
      case "snow":
        return "Karlı";
      case "mist":
        return "Sisli";
      default:
        return description;
    }
  };

  return (
    <ImageBackground
      source={
        weatherData
          ? backgroundImageMap[weatherData.weather[0].description]
          : null
      }
      style={styles.container}
    >
      <Text style={styles.header}>Hava Durumu Uygulaması</Text>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Şehir Seçin:</Text>
        <Picker
          selectedValue={selectedCity}
          style={styles.picker}
          onValueChange={(itemValue) => handleCityChange(itemValue)}
        >
          {cities.map((city, index) => (
            <Picker.Item key={index} label={city.name} value={city} />
          ))}
        </Picker>
      </View>
      {weatherData ? (
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherTemp}>
            Sıcaklık: {weatherData.main.temp} °C
          </Text>
          <Text style={styles.weatherDesc}>
            {translateDescription(weatherData.weather[0].description)}
          </Text>
        </View>
      ) : (
        <Text style={styles.loadingText}>
          Hava durumu verileri yükleniyor...
        </Text>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  pickerContainer: {
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    padding: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  picker: {
    width: 200,
  },
  weatherContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    padding: 20,
  },
  weatherLocation: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  weatherTemp: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  weatherDesc: {
    fontSize: 16,
    color: "#333",
  },
  loadingText: {
    fontSize: 16,
    color: "#333",
  },
});

export default App;
