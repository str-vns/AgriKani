import React, { createContext, useContext, useEffect, useState } from 'react';

const WeatherContext = createContext(null); 

export const WeatherProvider = ({ children }) => {
    const [currentWeather, setCurrentWeather] = useState(null);
   

    useEffect(() => {

      const fetchWeather = async () => 
      {
        const response = await fetch('https://api.weatherbit.io/v2.0/current?city=Manila&country=PH&key=b38eb1b293194679af1fd62ae0feb39c');
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
