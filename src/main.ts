import './style.scss'
import updateUI, { apiObj }  from './dom-functions';
import { callWeatherApiCoords, callWeatherAPICityName } from './api-functions';
import searchURL from "./images/search.png";



function getCoords(): Promise<GeolocationCoordinates>{
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };
    return new Promise<GeolocationPosition>((resolve, reject) =>{
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
    }).then((pos)=>pos.coords);

}

//hack, but i can't figure out how to get vite to give me image addresses to scss
const searchicon = document.querySelector('.search-icon') as HTMLImageElement;
if(searchicon)
    searchicon.src= `${searchURL}`;

//attempt to get user coords to use their location as default location
const pos = getCoords();

const weather = pos.then((result)=>callWeatherApiCoords(result)).then((result)=>result?.json());
weather.then(
            (result) => {
                updateUI(result);
            });
            //implement error handling
            //
//if user declines coords then default to SD
weather.catch(()=>{
    const sd = callWeatherAPICityName("San Diego");
    sd.then((result)=>result?.json()).then((result=>{updateUI(result)}));
});

//set up search bar and icon to respond to queries
const searchBar = document.querySelector(".city-input") as HTMLInputElement;
searchBar.addEventListener('keypress', (event:KeyboardEvent)=>{
   if(event.key == 'Enter'){
       const citySeach = callWeatherAPICityName(searchBar.value);
       citySeach.then((result)=>result?.json())
       .then((result)=>{
           console.log(citySeach);
           updateUI(result as apiObj);
       });
   }
});

const searchIcon = document.querySelector(".search-icon") as HTMLImageElement;
searchIcon.addEventListener("click", ()=>{
    const citySeach = callWeatherAPICityName(searchBar.value);
       citySeach.then((result)=>result?.json())
       .then((result)=>{
           console.log(citySeach);
           updateUI(result as apiObj);
       });
});
console.log(weather);
