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
    document.getElementById("clock").textContent = `${time.toLocaleString("en-us", timeOptions)}`;
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
                    console.log("weather", res);
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

} else {
    console.log("This browser does not support Geo Location services.");
}