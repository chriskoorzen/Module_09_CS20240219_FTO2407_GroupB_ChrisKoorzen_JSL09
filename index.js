"use strict";

// Get a random background image
fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature")
    .then(res => res.json())
    .then(data => {
        console.log(data.urls.full);
        console.log(data.user.name);
        document.body.style.backgroundImage = `url(${data.urls.full})`;
        document.getElementById("photographer").textContent = data.user.name;
    });
