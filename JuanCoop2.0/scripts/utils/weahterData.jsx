import React from "react";
import styles from "@screens/stylesheets/utils/weatherData"

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";

const weatherIcons = {
  a01d: require("../../assets/weather/a01d.png"),
  a01n: require("../../assets/weather/a01n.png"),
  a02d: require("../../assets/weather/a02d.png"),
  a02n: require("../../assets/weather/a02n.png"),
  a03d: require("../../assets/weather/a03d.png"),
  a03n: require("../../assets/weather/a03n.png"),
  a04d: require("../../assets/weather/a04d.png"),
  a04n: require("../../assets/weather/a04n.png"),
  a05d: require("../../assets/weather/a05d.png"),
  a05n: require("../../assets/weather/a05n.png"),
  a06d: require("../../assets/weather/a06d.png"),
  a06n: require("../../assets/weather/a06n.png"),
  c01d: require("../../assets/weather/c01d.png"),
  c01n: require("../../assets/weather/c01n.png"),
  c02d: require("../../assets/weather/c02d.png"),
  c02n: require("../../assets/weather/c02n.png"),
  c03d: require("../../assets/weather/c03d.png"),
  c03n: require("../../assets/weather/c03n.png"),
  c04d: require("../../assets/weather/c04d.png"),
  c04n: require("../../assets/weather/c04n.png"),
  d01d: require("../../assets/weather/d01d.png"),
  d01n: require("../../assets/weather/d01n.png"),
  d02d: require("../../assets/weather/d02d.png"),
  d02n: require("../../assets/weather/d02n.png"),
  d03d: require("../../assets/weather/d03d.png"),
  d03n: require("../../assets/weather/d03n.png"),
  f01d: require("../../assets/weather/f01d.png"),
  f01n: require("../../assets/weather/f01n.png"),
  r01d: require("../../assets/weather/r01d.png"),
  r01n: require("../../assets/weather/r01n.png"),
  r02d: require("../../assets/weather/r02d.png"),
  r02n: require("../../assets/weather/r02n.png"),
  r03d: require("../../assets/weather/r03d.png"),
  r03n: require("../../assets/weather/r03n.png"),
  r04d: require("../../assets/weather/r04d.png"),
  r04n: require("../../assets/weather/r04n.png"),
  r05d: require("../../assets/weather/r05d.png"),
  r05n: require("../../assets/weather/r05n.png"),
  r06d: require("../../assets/weather/r06d.png"),
  r06n: require("../../assets/weather/r06n.png"),
  s01d: require("../../assets/weather/s01d.png"),
  s01n: require("../../assets/weather/s01n.png"),
  s02d: require("../../assets/weather/s02d.png"),
  s02n: require("../../assets/weather/s02n.png"),
  s03d: require("../../assets/weather/s03d.png"),
  s03n: require("../../assets/weather/s03n.png"),
  s04d: require("../../assets/weather/s04d.png"),
  s04n: require("../../assets/weather/s04n.png"),
  s05d: require("../../assets/weather/s05d.png"),
  s05n: require("../../assets/weather/s05n.png"),
  s06d: require("../../assets/weather/s06d.png"),
  s06n: require("../../assets/weather/s06n.png"),
  t01d: require("../../assets/weather/t01d.png"),
  t01n: require("../../assets/weather/t01n.png"),
  t02d: require("../../assets/weather/t02d.png"),
  t02n: require("../../assets/weather/t02n.png"),
  t03d: require("../../assets/weather/t03d.png"),
  t03n: require("../../assets/weather/t03n.png"),
  t04d: require("../../assets/weather/t04d.png"),
  t04n: require("../../assets/weather/t04n.png"),
  t05d: require("../../assets/weather/t05d.png"),
  t05n: require("../../assets/weather/t05n.png"),
  default: require("../../assets/weather/c01d.png"),
};

export const WeatherModalContent = (props) => {
  const {
    weatherModalVisible,
    onClose,
    weatherCurrent,
    weatherDaily,
    loadingWCurrent,
    loadingWDaily,
    errorWCurrent,
    errorWDaily,
  } = props;
   

  return (
    <Modal
      visible={weatherModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={styles.container}
      >
        <View
          style={styles.weatherDailyContainer}
        >
          <Text
            style={styles.titleText}
          >
            Weather Information
          </Text>
          <View style={styles.marginContainer}>
            {loadingWCurrent ? (
              <ActivityIndicator size="large" color="#4CAF50" />
            ) : errorWCurrent || weatherCurrent === null ? (
              <Text style={ styles.noLoadText }>
                Weather is Unavailable Currently...
              </Text>
            ) : (
              <View style={styles.itemsCenter}>
                <Image
                  source={
                    weatherIcons[weatherCurrent?.data[0]?.weather?.icon] ||
                    weatherIcons["default"]
                  }
                  style={styles.dailyImg}
                />
                <Text style={ styles.textdesign }>
                  City: {weatherCurrent?.data[0].city_name}
                </Text>
                <Text>Temperature: {weatherCurrent?.data[0].temp}°C</Text>
                <Text>
                  Weather: {weatherCurrent?.data[0].weather.description}
                </Text>
                <Text>Wind Speed: {weatherCurrent?.data[0].wind_spd} m/s</Text>
              </View>
            )}
          </View>
          <View>
            {loadingWDaily ? (
              <ActivityIndicator size="large" color="#4CAF50" />
            ) : errorWDaily ||
              !weatherDaily ||
              !weatherDaily.data ||
              weatherDaily.data.length === 0 ? (
              <Text style={ styles.noLoadText }>
                Weather is Unavailable Currently...
              </Text>
            ) : (
              <ScrollView horizontal={true} style={{ marginBottom: 8 }}>
                {weatherDaily.data.map((item, index) => (
                  <View
                    key={item._id || index}
                    style={ styles.weatherWeeklyContainer }
                  >
                    <Text style={ styles.date }>
                      {item.valid_date}
                    </Text>
                    <Image
                      source={
                        weatherIcons[item?.weather?.icon] ||
                        weatherIcons["default"]
                      }
                      style={ styles.weeklyImg }
                    />
                    <Text
                      style={ styles.ellpses }
                      ellipsizeMode="tail"
                      numberOfLines={1}
                    >
                      {item.weather.description}
                    </Text>
                    <Text style={styles.closeText}>{item.temp}°C</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

