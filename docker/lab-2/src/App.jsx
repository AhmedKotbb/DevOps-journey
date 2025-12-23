import { useState } from 'react'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'YOUR_API_KEY_HERE'
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather'

  const fetchWeather = async (e) => {
    e.preventDefault()
    if (!city.trim()) {
      setError('Please enter a city name')
      return
    }

    setLoading(true)
    setError('')
    setWeather(null)

    try {
      const response = await fetch(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'City not found')
      }

      setWeather({
        city: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
      })
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="weather-card">
        <h1>🌤️ Weather App</h1>
        <form onSubmit={fetchWeather} className="search-form">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="city-input"
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Loading...' : 'Search'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {weather && (
          <div className="weather-info">
            <div className="location">
              <h2>
                {weather.city}, {weather.country}
              </h2>
            </div>
            <div className="temperature">
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                alt={weather.description}
                className="weather-icon"
              />
              <span className="temp-value">{weather.temp}°C</span>
            </div>
            <div className="description">
              {weather.description.charAt(0).toUpperCase() +
                weather.description.slice(1)}
            </div>
            <div className="details">
              <div className="detail-item">
                <span className="detail-label">Feels like</span>
                <span className="detail-value">{weather.feelsLike}°C</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{weather.windSpeed} m/s</span>
              </div>
            </div>
          </div>
        )}

        {!weather && !error && !loading && (
          <div className="welcome-message">
            Enter a city name to get started!
          </div>
        )}
      </div>
    </div>
  )
}

export default App

