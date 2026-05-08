import { useState } from 'react'

function Dashboard() {

    const [location, setLocation] = useState([]);
    const [hourlyData, sethourlyData] = useState(null);
    const [dailyData, setDailyData] = useState(null);


    async function handleLocationClick(loc) {

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&past_days=14&hourly=temperature_2m,relative_humidity_2m,weather_code,pressure_msl,surface_pressure,cloud_cover,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m&&daily=uv_index_max,rain_sum,showers_sum,snowfall_sum,precipitation_sum,sunrise,sunset,daylight_duration,sunshine_duration,shortwave_radiation_sum#hourly_weather_variablescurrent_weather=true`);
        const data = await response.json();
        sethourlyData(data.hourly);
        setDailyData(data.daily);
        console.log(data.hourly);
        console.log(data.daily);

    }

    async function handleSearch() {

        const input = document.getElementById('location-input');
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${input.value.replaceAll(" ", "+").toLowerCase()}`);
        const coordinates = await response.json();
        const data = coordinates.results;
        console.log(data);
        setLocation(data);

    }

    return (
    
    <>

    <input type="text" id="location-input" placeholder="Enter location..." />
    <button onClick={handleSearch}>Search</button>
    <ul>
        {location.map((loc, index) => (
            <li key={index} onClick={() => handleLocationClick(loc)}>
                {loc.name}, {loc.country}, {loc.admin1}
            </li>
        ))}
    </ul>

    

    </>

    )

}

export default Dashboard;