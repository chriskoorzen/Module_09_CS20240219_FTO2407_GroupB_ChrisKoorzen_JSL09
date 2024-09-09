"use strict";
import { OpenWeatherKey } from "./keys.js";

const oneMinute = 60 * 1000;        // 60 seconds x 1000 milliseconds
const oneHour = 60 * 60 * 1000;     // 60 minutes x 60 seconds x 1000 milliseconds

// Get a random background image
fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature")
    .then(result => {
        if (result.ok){ return result.json(); }
        else { console.log(response); throw Error("Scrimba Image API failed"); }
    })
    .then(data => {
        console.log(data.urls.full);
        console.log(data.user.name);
        document.body.style.backgroundImage = `url(${data.urls.full})`;
        document.getElementById("photographer").textContent = data.user.name;
    })
    .catch(error => {
        alert("Something broke. Check console");        // Failures shouldn't be silent
        console.log(error);

        // Fallback Image
        document.body.style.backgroundImage = "url(./include/mountain-photo-by-kalen-emsley.jpeg)";
        document.getElementById("photographer").textContent = "Kalen Emsley";
    });


// Time display
// Run once, then every minute thereafter
function updateTime(){
    const time = new Date();
    const timeOptions = {
        timeZoneName: "short",          // GMT+2
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    }
    document.getElementById("clock").textContent = `${time.toLocaleString("en-us", timeOptions).slice(0,8)}`;
    document.getElementById("timezone").textContent = `${time.toLocaleString("en-us", timeOptions).slice(9)}`;
}
updateTime();
setInterval(() => { updateTime(); }, oneMinute);

// Weather Display
// Run once, then every hour thereafter
function update_weather_data(lat, lon){
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OpenWeatherKey}&units=metric`)
    .then(response => {
        if (response.ok) { return response.json(); }
        else { console.log(response); throw Error("OpenWeatherMap API failed");}
    })
    .then(data => {

        // Main weather widget creation
        console.log("Wind Direction", data.wind.deg);
        const weather_content = `
        <div class="flex flex-row justify-between items-center">
            <div class="mr-8">
                <p class="text-3xl">${data.name}</p>
                ${data.weather.map(obj => "<p>"+obj.description+"</p>").join('')}
            </div>
            <div class="">
                <img class="inline" src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png"/>
                <p>${data.main.temp}&deg;C</p>
            </div>
        </div>
        <hr class="my-3">
        <div id="weather-extra" class="hidden">
            <div>
                <p>Feels like ${data.main.feels_like}&deg;C</p>
                <p>Max ${Math.round(data.main.temp_max)}&deg;C Min ${Math.round(data.main.temp_min)}&deg;C</p>
                <p>Humidity: ${data.main.humidity}%</p>
                <p>Cloud cover: ${data.clouds.all}%</p>
            </div>
            <hr class="my-3">
            <div class="flex flex-row justify-between">
                <div>
                    <p>Wind from ${
                        (data.wind.deg > 337 || data.wind.deg < 23) ? "N":
                        (data.wind.deg >= 23 && data.wind.deg < 68) ? "NE":
                        (data.wind.deg >= 68 && data.wind.deg < 113) ? "E":
                        (data.wind.deg >= 113 && data.wind.deg < 158) ? "SE":
                        (data.wind.deg >= 158 && data.wind.deg < 203) ? "S":
                        (data.wind.deg >= 203 && data.wind.deg < 248) ? "SW":
                        (data.wind.deg >= 248 && data.wind.deg < 293) ? "W":
                        "NW"
                    } direction</p>
                    <p>${data.wind.speed} km/h</p>
                    ${ data.wind.gust ? "<p>Gusts of " + data.wind.gust + "km/h</p>": "" }
                </div>
                <div class="rounded-full bg-stone-600 size-20">
                    <svg class="h-16 mx-auto mt-2" style="rotate:${180+data.wind.deg}deg;" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 40 210" preserveAspectRatio="xMidYMid meet" >
                        <g fill="none" stroke="orange" stroke-width="5" stroke-linejoin="round">
                            <path d="M 20 10 V 100" stroke-dasharray="5,6"></path>
                            <path d="M 20 100 V 200"></path>
                            <path d="M 0 40 L 20 10 L 40 40"></path>
                            <path d="M 0 180 L 20 150 L 40 180"></path>
                            <path d="M 0 200 L 20 170 L 40 200"></path>
                        </g>
                    </svg>
                </div>
            </div>
            <hr class="my-3">
            <div class="flex flex-row justify-between">
                <p>rise: ${ (new Date(data.sys.sunrise*1000)).toLocaleString('en-us', {timeStyle: "short"}) }</p>
                <p>set: ${ (new Date(data.sys.sunset*1000)).toLocaleString('en-us', {timeStyle: "short"}) }</p>
            </div>
        </div>`;

        // Add to document
        const weather = document.getElementById("weather");
        weather.innerHTML = weather_content;

        // Register event listener to toggle 'weather-extra'
        weather.addEventListener("click", () => {
            document.getElementById("weather-extra").classList.toggle("hidden");
        });

    })
    .catch(error => {
        alert("Something broke. Check console");
        console.log(error);
    })
}

function manual_weather(header_message){
    const weather_tab = document.getElementById("weather");

    // Construct a form to receive manual inputs from user
    const c_form = document.createElement("form");

    c_form.innerHTML = `
        <label class="text-sm" for="latitude">Latitude</label>
        <input class="text-black rounded-md text-sm mb-2"
            type="number" id="latitude" min="-90" max="90" step="0.01" required>
        <br>
        <label class="text-sm" for="longitude">Longitude</label>
        <input class="text-black rounded-md text-sm mb-2"
            type="number" id="longitude" min="-180" max="180" step="0.01" required>
        <br>
        <button class="rounded-lg bg-gray-800 p-2" type="submit">Get Weather Forecast</button>
    `;

    weather_tab.innerHTML = `
        <p>${header_message}</p>
        <hr class="my-3">
        <p text-sm>Manually get weather forecast:</p>
    `;
    weather_tab.append(c_form);

    //  Process user inputs
    c_form.addEventListener("submit", (event) =>{
        event.preventDefault();

        const latitude =  c_form.elements["latitude"].value;
        const longitude = c_form.elements["longitude"].value;

        // Call once and set interval
        update_weather_data(latitude,longitude);
        setInterval(() => { update_weather_data(latitude,longitude); }, oneHour);
    })
}

if (navigator.geolocation){                             // Does browser support Geolocation?
    navigator.geolocation.getCurrentPosition(
        success => {
            // Attempt automatic weather retrieval
            const latitude = success.coords.latitude;
            const longitude = success.coords.longitude;

            // Call once and set interval
            update_weather_data(latitude, longitude);
            setInterval(() => { update_weather_data(latitude,longitude); }, oneHour);
        },
        error => {
            // Attempt manual input
            console.log(error);
            console.log("GeoLocation Permission Denied");
            if (error.code === GeolocationPositionError.PERMISSION_DENIED){
                manual_weather("GeoLocation Permission Denied");
            }
        }
    );

} else {
    // Attempt manual input
    console.log("This browser does not support Geo Location services.");
    manual_weather("Browser does not support GeoLocation service");
}


// Market Data Display
// We're interested in Ethereum only
// Run once, then every hour thereafter
function update_market_data(){
    fetch("https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true")
    .then(result => {
        if (result.ok){ return result.json(); }
        else { console.log(response); throw Error("Coin Gecko API failed"); }
    })
    .then(data => {

        // Main crypto coin widget creation
        const coin_content = `
        <div class="flex flex-row justify-between items-center">
            <p class="text-2xl">
                <img class="inline -ml-3" src="https://coin-images.coingecko.com/coins/images/279/small/ethereum.png"><span>${data.name}</span>
            </p>
            <p>$ ${(data.market_data.current_price.usd).toFixed(2)}</p>
            <p>${(data.market_data.price_change_percentage_1h_in_currency.usd).toFixed(2)}%</p>
        </div>
        <div class="flex flex-row justify-between">
            <p><img class="inline" src="./include/icons/coin/arrow-up-green.png"> $ ${(data.market_data.high_24h.usd).toFixed(2)}</p>
            <p><img class="inline" src="./include/icons/coin/arrow-down-red.png"> $ ${(data.market_data.low_24h.usd).toFixed(2)}</p>
        </div>
        <hr class="my-3">
        <div id="crypto-extra" class="hidden">
            <div class="bg-gray-800 p-4 rounded-lg">
                <p class="text-sm ml-2 py-2">Last 7 days: 
                    <span style="color:${data.market_data.price_change_percentage_7d > 0 ? "green":"red"};">
                        ${(data.market_data.price_change_percentage_7d).toFixed(2)} %
                    </span>
                </p>
                <canvas id="crypto-chart" class="w-96"></canvas>
            </div>
        </div>`;

        // Add to document
        const coin = document.getElementById("crypto");
        coin.innerHTML = coin_content;

        // Register event listener to toggle 'crypto-extra'
        coin.addEventListener("click", () => {
            document.getElementById("crypto-extra").classList.toggle("hidden");
        });

        // --- Create a line chart using sparkline data from CoinGecko api ---
        // Sparkline data is updated every 6 hours
        // https://support.coingecko.com/hc/en-us/articles/4538729548569-How-often-does-the-price-data-update-for-the-sparkline-in-coins-markets-update
        // Assume update intervals at 00:00, 06:00, 12:00, 18:00 UTC (tested)
        // Expect a 168-element array (price for each hour for last 7 days)

        // Get last update time
        const timePoint = new Date(data.market_data.last_updated);

        // Determine the last update time and set to the closest
        // known update interval
        timePoint.getUTCHours() < 6 ? timePoint.setUTCHours(0, 0) :
        timePoint.getUTCHours() < 12 ? timePoint.setUTCHours(6, 0) :
        timePoint.getUTCHours() < 18 ? timePoint.setUTCHours(12, 0) :
        timePoint.setUTCHours(18, 0);

        // Rewind to 7 days ago, plus 1 hour to init loop addition below
        timePoint.setUTCHours(timePoint.getUTCHours() - (168 + 1));

        // Build label Array for x-axis
        // This maps price data to its hourly status (168 price data points)
        const labels = new Array();
        for (let i=0; i < 168; i++){
            // Move forward by one hour
            timePoint.setUTCHours(timePoint.getUTCHours() + 1);
            // And get its string 
            labels.push(timePoint.toString().slice(4, 21));
        }

        // Refer to chartjs config docs
        const config = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Price USD $',
                    data: data.market_data.sparkline_7d.price,      // Sparkline - price data array
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,                                   // Slightly smooth out point connections
                    pointStyle: false
                }]
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            display: false  // Do not show x-axis labels, only tooltip on hover
                        }
                    }
                },
                plugins: {
                    legend: {
                        align: 'center',
                        position: 'bottom',
                        labels: {
                            boxHeight: 0,
                            boxWidth: 20
                        }
                    }
                }
            }
        };

        // Build chart using chartjs api
        new Chart(document.getElementById("crypto-chart"), config);

    })
    .catch(error => {
        alert("Something broke. Check console");        // Failures shouldn't be silent
        console.log(error);
    });
}
update_market_data();
setInterval( () => { update_market_data(); }, oneHour);