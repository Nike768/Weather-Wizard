import React, { useState, useEffect } from "react";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import Forcast from "./forcast";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";

const dateBuilder = (d) => {
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState({
    lat: undefined,
    lon: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    sunrise: undefined,
    sunset: undefined,
    errorMsg: undefined,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (navigator.geolocation) {
          const position = await getPosition();
          const weather = await getWeather(position.coords.latitude, position.coords.longitude);
          setWeatherData(weather);
        } else {
          throw new Error("Geolocation not available");
        }
      } catch (err) {
        console.error("Error fetching weather data: ", err);
        // If user denied location service then standard location weather will be shown based on latitude & longitude.
        const weather = await getWeather(28.67, 77.22);
        setWeatherData(weather);
        alert("You have disabled location service. Allow 'This APP' to access your location. Your current location will be used for calculating Real time weather.");
      }
    };

    fetchData();

    const timerID = setInterval(() => {
      fetchData();
    }, 600000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  const getPosition = (options) => {
    return new Promise(function (resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  const getWeather = async (lat, lon) => {
    const api_call = await fetch(
      `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
    );
    const data = await api_call.json();
    let icon = "CLEAR_DAY";
    switch (data.weather[0].main) {
      case "Haze":
        icon = "CLEAR_DAY";
        break;
      case "Clouds":
        icon = "CLOUDY";
        break;
      case "Rain":
        icon = "RAIN";
        break;
      case "Snow":
        icon = "SNOW";
        break;
      case "Dust":
        icon = "WIND";
        break;
      case "Drizzle":
        icon = "SLEET";
        break;
      case "Fog":
      case "Smoke":
        icon = "FOG";
        break;
      case "Tornado":
        icon = "WIND";
        break;
      default:
        icon = "CLEAR_DAY";
    }

    return {
      lat: lat,
      lon: lon,
      city: data.name,
      temperatureC: Math.round(data.main.temp),
      temperatureF: Math.round(data.main.temp * 1.8 + 32),
      humidity: data.main.humidity,
      main: data.weather[0].main,
      country: data.sys.country,
      icon: icon,
    };
  };

  return (
    <>
      {weatherData.temperatureC ? (
        <>
          <div className="city">
            <div className="title">
              <h2>{weatherData.city}</h2>
              <h3>{weatherData.country}</h3>
            </div>
            <div className="mb-icon">
              {" "}
              <ReactAnimatedWeather
                icon={weatherData.icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
              <p>{weatherData.main}</p>
            </div>
            <div className="date-time">
              <div className="dmy">
                <div id="txt"></div>
                <div className="current-time">
                  <Clock format="hh:mm" interval={1000} ticking={true} />
                </div>
                <div className="current-date">{dateBuilder(new Date())}</div>
              </div>
              <div className="temperature">
                <p>
                  {weatherData.temperatureC}°
                  <span>C</span>
                </p>
              </div>
            </div>
          </div>
          <Forcast icon={weatherData.icon} weather={weatherData.main} />
        </>
      ) : (
        <>
          <img alt="" src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} />
          <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
            Detecting your location
          </h3>
          <h3 style={{ color: "white", marginTop: "10px" }}>
            Your current location will be displayed on the App and used for calculating Real time weather.
          </h3>
        </>
      )}
    </>
  );
};

export default Weather;