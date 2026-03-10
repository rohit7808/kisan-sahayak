"use client";

import { useState, useEffect } from 'react';
import { CloudSun, Wind, Droplets, Search, Loader2, MapPin } from 'lucide-react';
import styles from './page.module.css';

// Using OpenMeteo types implicitly for simplicity in this MVP

export default function WeatherPage() {
    const [city, setCity] = useState('');
    const [locationName, setLocationName] = useState('New Delhi');
    const [weatherData, setWeatherData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Initial fetch for New Delhi
    useEffect(() => {
        fetchWeather(28.61, 77.20, 'New Delhi');
    }, []);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!city.trim()) return;

        setLoading(true);
        setError('');
        setWeatherData(null);

        try {
            // 1. Geocoding API to get lat/lon
            const geoRes = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
            );
            const geoData = await geoRes.json();

            if (!geoData.results || geoData.results.length === 0) {
                throw new Error('Location not found');
            }

            const { latitude, longitude, name, admin1, country } = geoData.results[0];
            const displayName = `${name}, ${admin1 || ''} ${country}`;

            // 2. Fetch Weather Data
            await fetchWeather(latitude, longitude, displayName);
            setCity(''); // Clear input on success
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch weather');
            setLoading(false);
        }
    }

    async function fetchWeather(lat: number, lon: number, name: string) {
        try {
            const res = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
            );
            if (!res.ok) throw new Error('Weather data unavailable');
            const data = await res.json();
            setWeatherData(data);
            setLocationName(name);
        } catch (err) {
            setError('Could not load weather details');
        } finally {
            setLoading(false);
        }
    }

    // WMO Weather Code interpretation
    const getWeatherDesc = (code: number) => {
        const codes: Record<number, string> = {
            0: 'Clear sky',
            1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
            45: 'Fog', 48: 'Depositing rime fog',
            51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
            61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
            80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
            // Add more codes as needed
        };
        return codes[code] || 'Variable';
    };

    return (
        <div className={`container ${styles.container}`}>
            <h1 className={styles.title}>Weather Forecast By Location</h1>

            <form onSubmit={handleSearch} className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Enter city or village name..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchBtn} disabled={loading && !weatherData}>
                    {loading && !weatherData ? <Loader2 className={styles.spinner} /> : <Search size={20} />}
                    Search
                </button>
            </form>

            {error && <div style={{ textAlign: 'center', color: 'red', marginBottom: '1rem' }}>{error}</div>}

            {loading && !weatherData && (
                <div style={{ textAlign: 'center', margin: '2rem' }}>
                    <Loader2 size={40} className="animate-spin text-green-600" />
                    <p>Loading weather data...</p>
                </div>
            )}

            {weatherData && (
                <>
                    <h2 className={styles.subtitle} style={{ textAlign: 'center' }}>
                        <MapPin size={20} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '5px' }} />
                        {locationName}
                    </h2>

                    <div className={styles.currentCard}>
                        <div className={styles.mainInfo}>
                            <CloudSun size={64} style={{ marginBottom: '1rem' }} />
                            <div className={styles.temp}>
                                {weatherData.current.temperature_2m}{weatherData.current_units.temperature_2m}
                            </div>
                            <div className={styles.condition}>
                                {getWeatherDesc(weatherData.current.weather_code)}
                            </div>
                        </div>

                        <div className={styles.details}>
                            <div className={styles.detailItem}>
                                <Droplets size={24} />
                                <span>Humidity: {weatherData.current.relative_humidity_2m}{weatherData.current_units.relative_humidity_2m}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Wind size={24} />
                                <span>Wind: {weatherData.current.wind_speed_10m}{weatherData.current_units.wind_speed_10m}</span>
                            </div>
                        </div>
                    </div>

                    <h3 className={styles.subtitle}>7-Day Forecast</h3>
                    <div className={styles.forecastGrid}>
                        {weatherData.daily.time.map((date: string, index: number) => (
                            <div key={date} className={styles.forecastCard}>
                                <div className={styles.date}>
                                    {new Date(date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
                                </div>
                                {/* Simplified icon logic could act here based on daily weather_code if needed */}
                                <div className={styles.highLow}>
                                    <span className={styles.max}>{weatherData.daily.temperature_2m_max[index]}°</span>
                                    <span className={styles.min}>{weatherData.daily.temperature_2m_min[index]}°</span>
                                </div>
                                <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#666' }}>
                                    {getWeatherDesc(weatherData.daily.weather_code[index])}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
