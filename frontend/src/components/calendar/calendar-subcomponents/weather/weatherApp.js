import React, { useState } from 'react';

import { fetchWeather } from './weather';
import './weatherApp.css';

const WeatherApp = () => {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState({});
    const [show, setshow] = useState(true);

    const search = async (e) => {
        if (e.key === 'Enter') {
            const data = await fetchWeather(query);

            setWeather(data);
            setQuery('');
            setshow(true);
        }
    }


    return (


        <div id="root1">
            <div className="main-container">
                <h5 className="h5style">
                    Search for weather...
                </h5>
                <input type="text" className="search" placeholder="Enter your location" value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={search}/>
                <div className="interaction">
                    {show?
                <div>
                     {weather.main && (
                        <div className="city">
                            <h2 className="city-name">
                                <span>{weather.name}</span>
                                <sup>{weather.sys.country}</sup>
                            </h2>
                            <div className="city-temp">
                                {Math.round(weather.main.temp)}
                                <sup>&deg;C</sup>
                            </div>
                            <div className="info">
                                <p>{weather.weather[0].description}</p>
                            </div>
                            <div>
                                <button className="buttonweather" onClick={() =>setshow(false)  && setshow(true)} >Hide</button>
                            </div>
                        </div>
                    )}
                </div> :null   
                }
                    
                   
                </div>

            </div>


        </div>

    );
}

export default WeatherApp;