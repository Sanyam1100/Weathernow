import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./Searchbox.css";
import { useState } from 'react';
import axios from "axios"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Drawer from '@mui/material/Drawer';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Searchbox() {

    //State variable Declaration
    let [city, setcity] = useState("");
    const [searchedCity, setSearchedCity] = useState('');
    let [weatherData, setWeatherData] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    //Api Url and Key
    const geoApi = "https://api.openweathermap.org/geo/1.0/direct?"
    const apiKey = "97111c194e3316cbe2445e2f26441b23";

    //Data Fetching Function from APIs:
    let getWeather = async () => {
        try{
        //Fetching Coordinates of city Entered
        let geo = await fetch(`${geoApi}q=${city}&appid=${apiKey}`)
        let geoJasonResponse = await geo.json();

        //setting coordinates in variable
        let longitude = geoJasonResponse[0].lon;
        let latitude = geoJasonResponse[0].lat;


        //Weather Info Fetching
        let response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`);
        let data = await response.data;
        console.log(data);
          

        // Formating data 
        let formattedData = {
            currentWeather: {
                time: data.current.time,
                temperature: `${data.current.temperature_2m} °C`,
                windSpeed: `${data.current.wind_speed_10m} km/h`,
            },
            location: {
                latitude: data.latitude,
                longitude: data.longitude,
                elevation: data.elevation,
            },
            hourlyForecast: data.hourly.time.map((time, index) => ({
                time,
                temperature: `${data.hourly.temperature_2m[index]} °C`,
                humidity: `${data.hourly.relative_humidity_2m[index]} %`,
                windSpeed: `${data.hourly.wind_speed_10m[index]} km/h`,
            })).slice(0, 24),
        };
        setWeatherData(formattedData);
        setSearchedCity(city);
        console.log(JSON.stringify(formattedData, null, 2));
        } catch (error) {
            console.error("Error fetching weather data:", error);
            alert("You Have Enter Invalid City Enter Valid City");
        }
    };



    // Handeling Events
    let handelChange = (evt) => {
        setcity(evt.target.value);
    }

    let handelSubmit = (evt) => {
        evt.preventDefault();
        console.log(city);
        getWeather();
        setcity("");
    }


    // Utility function to format time
    const formatTime = (isoTime) => {
        const date = new Date(isoTime);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long', 
            day: 'numeric', 
            hour: 'numeric',
            minute: '2-digit', 
        });
    };


    // Content of Frontend
    return (
        <div className='Search_Box'>
            <div className='Contentone'>
                <h1 className='glass-heading'>Type City Name Below</h1>
                <form className='Search_Feild' onSubmit={handelSubmit}>
                    <TextField id="filled-basic" label="City-Name" variant="filled" required value={city} onChange={handelChange} />
                    <br></br>
                    <br></br>
                    <Button variant="contained" type="submit">Search</Button>
                </form>
            </div>
            <div className="weather-container">
                {weatherData && (
                    <div className="cards-container">
                        {/* Card 1: Weather Details */}
                        <div className="glass-card weather-details">
                            <h2>Weather Details for {searchedCity}</h2>
                            <h3>Current Weather:</h3>
                            <p>Time: {formatTime(weatherData.currentWeather.time)}</p>
                            <p>Temperature: {weatherData.currentWeather.temperature} °C</p>
                            <p>Wind Speed: {weatherData.currentWeather.windSpeed} km/h</p>

                            <h3>Location Details:</h3>
                            <p>Latitude: {weatherData.location.latitude}</p>
                            <p>Longitude: {weatherData.location.longitude}</p>
                            <p>Elevation: {weatherData.location.elevation} meters</p>
                        </div>

                        {/* Card 2: Graph */}
                        <div className="glass-card weather-graph">
                            <h2>Hourly Forecast Graph</h2>
                            <Line
                                data={{
                                    labels: weatherData.hourlyForecast.map((entry) =>{
                                        const date = new Date(entry.time);
                                        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                      }),
                                    datasets: [
                                        {
                                            label: 'Temperature (°C)',
                                            data: weatherData.hourlyForecast.map(
                                                (entry) => parseFloat(entry.temperature)
                                            ),
                                            borderColor: 'rgba(75, 192, 192, 1)',
                                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                            tension: 0.4,
                                        },
                                        {
                                            label: 'Wind Speed (km/h)',
                                            data: weatherData.hourlyForecast.map(
                                                (entry) => parseFloat(entry.windSpeed)
                                            ),
                                            borderColor: 'rgba(255, 99, 132, 1)',
                                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                            tension: 0.4,
                                        },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                        title: { display: true, text: 'Shown in 24h format', color: 'white'},
                                    },
                                    layout: {
                                        padding: {
                                            top: 10,
                                            bottom: 10,
                                            left: 10,
                                            right: 10,
                                        },
                                    },
                                    scales: {
                                        x: {
                                          ticks: {
                                            autoSkip: false,
                                            maxRotation: 45,
                                            minRotation: 0,
                                            font: {
                                              size: 10,
                                              family: 'Arial', 
                                              color: 'white',
                                            },
                                          },
                                          title: {
                                            display: true,
                                            text: 'Time',
                                            color: 'white', 
                                          },
                                        },
                                        y: {
                                          ticks: {
                                            font: {
                                              size: 10,
                                              family: 'Arial',
                                              color: 'white', 
                                            },
                                          },
                                          title: {
                                            display: true,
                                            text: 'Values',
                                            color: 'white', 
                                          },
                                        },
                                      },
                                }}
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Searchbox
