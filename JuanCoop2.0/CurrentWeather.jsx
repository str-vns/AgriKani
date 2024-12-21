import React, { createContext, useContext, useEffect, useState } from 'react';

const WeatherContext = createContext(null); 

export const WeatherProvider = ({ children }) => {
    const [currentWeather, setCurrentWeather] = useState(null);
   

    useEffect(() => {

      const fetchWeather = async () => 
      {
        const response = await fetch('https://api.weatherbit.io/v2.0/current?city=Manila&country=PH&key=7f1c9aeb7a02428cb625c5bbce429192');
        const data = await response.json();
        setCurrentWeather(data);
      }
    
        fetchWeather();
    }, []);
    

    return (
        <WeatherContext.Provider value={currentWeather}>
          {children}
        </WeatherContext.Provider>
    );
}

export const useWeather = () => {
    return useContext(WeatherContext);
}
