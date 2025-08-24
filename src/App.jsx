import { TiWeatherDownpour } from "react-icons/ti";
import { RiWaterPercentFill } from "react-icons/ri";
import { FaWind, FaCloudSun, FaCloudShowersHeavy } from "react-icons/fa";
import { WiBarometer } from "react-icons/wi";
import "./App.css";
import { useEffect, useState } from "react";

export default function App() {
  const [location, setLocation] = useState("Chennai");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  function get() {
    if (!location.trim()) {
      setError("⚠️ Please enter a city name!");
      setStatus(null);
      return;
    }

    setLoading(true);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === "404" || data.cod === "400") {
          setError("City not found!");
          setStatus(null);
        } else {
          setError(null);
          setStatus(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch data");
        setLoading(false);
      });
  }

  useEffect(() => {
    get();
  }, []);

  const getBackground = () => {
    if (!status || !status.weather || status.weather.length === 0) return "sunny";
    const condition = status.weather[0].main;
    if (condition === "Rain") return "rainy";
    if (condition === "Clouds") return "cloudy";
    return "sunny";
  };
  console.log("API Key:", import.meta.env.VITE_OPENWEATHER_API_KEY);


  return (
    <div className={`app ${getBackground()}`}>
      <div className="card">
        <h1 className="title">🌦 Weather App</h1>

        <div className="inputs">
          <input
            type="text"
            placeholder="Enter your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && get()}
          />
          <button onClick={get} disabled={!location.trim()}>
            Search
          </button>
        </div>

                {error && <p className="error">{error}</p>}

        {loading && <p className="loading">Loading weather data...</p>}

        {status && !loading && status.weather && status.weather.length > 0 && status.main && status.wind && (
          <>
            <h2 className="city">{status.name}</h2>

            <div className="icon">
              {status.weather[0].main === "Rain" ? (
                <TiWeatherDownpour />
              ) : status.weather[0].main === "Clouds" ? (
                <FaCloudShowersHeavy />
              ) : (
                <FaCloudSun />
              )}
            </div>

            <p className="temp">{status.main.temp.toFixed()}°C</p>
            <p className="desc">{status.weather[0].description}</p>

            <div className="footer">
              <div>
                <p>Humidity</p>
                <h3>
                  <RiWaterPercentFill /> {status.main.humidity}%
                </h3>
              </div>
              <div>
                <p>Wind</p>
                <h3>
                  <FaWind /> {status.wind.speed} m/s
                </h3>
              </div>
              <div>
                <p>Pressure</p>
                <h3>
                  <WiBarometer /> {status.main.pressure} hPa
                </h3>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
