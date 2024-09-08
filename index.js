"use strict";
import { OpenWeatherKey } from "./keys.js"


// Get a random background image
fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature")
    .then(res => res.json())
    .then(data => {
        console.log(data.urls.full);
        console.log(data.user.name);
        document.body.style.backgroundImage = `url(${data.urls.full})`;
        document.getElementById("photographer").textContent = data.user.name;
    })
    .catch(error => {
        alert("Something broke. Check console");        // Failures shouldn't be silent
        console.log(error);
        document.body.style.backgroundImage = "url(./include/mountain-photo-by-kalen-emsley.jpeg)";
        document.getElementById("photographer").textContent = "Kalen Emsley";
    });


// Time display
// Run once, then every minute thereafter
const oneMinute = 60 * 1000;        // 60 seconds x 1000 milliseconds
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
if (navigator.geolocation){                             // Does browser support Geolocation?
    navigator.geolocation.getCurrentPosition(
        success => {
            const lat = success.coords.latitude;
            const lon = success.coords.longitude;
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OpenWeatherKey}&units=metric`)
                .then(res => res.json())
                // catch non-200 HTTP responses
                .then(res => {

                    // Main weather widget creation
                    const weather_content = `
                    <div class="flex flex-row justify-between items-center">
                        <div class="mr-8">
                            <p class="text-3xl">${res.name}</p>
                            ${res.weather.map(obj => "<p>"+obj.description+"</p>").join('')}
                        </div>
                        <div class="">
                            <p>icon</p>
                            <p>${res.main.temp}&deg;C</p>
                        </div>
                    </div>
                    <hr class="my-3">
                    <div id="weather-extra" class="hidden">
                        <div>
                            <p>Feels like ${res.main.feels_like}&deg;C</p>
                            <p>Max ${Math.round(res.main.temp_max)}&deg;C Min ${Math.round(res.main.temp_min)}&deg;C</p>
                            <p>Humidity: ${res.main.humidity}%</p>
                            <p>Cloud cover: ${res.clouds.all}%</p>
                        </div>
                        <hr class="my-3">
                        <div class="flex flex-row justify-between">
                            <div>
                                <p>Wind</p>
                                <p>${res.wind.speed} km/h</p>
                                <p>Gusts of ${res.wind.gust} km/h</p>
                            </div>
                            <div class="rounded-full bg-stone-600 size-20">${res.wind.deg}</div>
                        </div>
                        <hr class="my-3">
                        <div class="flex flex-row justify-between">
                            <p>rise: ${ (new Date(res.sys.sunrise*1000)).toLocaleString('en-us', {timeStyle: "short"}) }</p>
                            <p>set: ${ (new Date(res.sys.sunset*1000)).toLocaleString('en-us', {timeStyle: "short"}) }</p>
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
        },
        error => {
            alert("Something broke. Check console");
            console.log(error);
        }
    );

// Market Data Display
// We're interested in Ethereum only
fetch("https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true")
    .then(res => res.json())
    .then(data => {

        // Main crypto coin widget creation
        const coin_content = `
        <div class="flex flex-row justify-between items-center">
            <p class="text-2xl">${data.name}</p>
            <p>$ ${(data.market_data.current_price.usd).toFixed(2)}</p>
            <p>${(data.market_data.price_change_percentage_1h_in_currency.usd).toFixed(2)}%</p>
        </div>
        <div class="flex flex-row justify-between">
            <p><img class="inline" src="./include/icons/coin/arrow-up-green.png"> $ ${(data.market_data.high_24h.usd).toFixed(2)}</p>
            <p><img class="inline" src="./include/icons/coin/arrow-down-red.png"> $ ${(data.market_data.low_24h.usd).toFixed(2)}</p>
        </div>
        <hr class="my-3">
        <div id="crypto-extra" class="hidden">
            <div class="bg-gray-800 w-fit p-4 rounded-lg">
                <p class="text-sm ml-6 py-2">Last 7 days: 
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

    })
    .catch(error => {
        alert("Something broke. Check console");        // Failures shouldn't be silent
        console.log(error);
    });
