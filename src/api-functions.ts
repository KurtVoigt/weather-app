const key = '8fccdc2b6e334636965191648232208';


//free tier weather api only allows for 3 day forecast
function callWeatherApiCoords(position:GeolocationCoordinates){
        return fetch(`https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${position.latitude}, ${position.longitude}&days=5`);
}

function callWeatherAPICityName(city:string){
    return fetch(`https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=5`);
}


export {callWeatherAPICityName, callWeatherApiCoords};
