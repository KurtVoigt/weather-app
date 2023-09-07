import sunnyImg from './images/sunny.jpg';
import cloudyImg from './images/clouds.jpg';
import foggyImg from './images/fog.jpg';
import snowyImg from './images/snow.jpg';
import rainImg from './images/rain.jpg';
import thunderImg from './images/thunder.jpg';

interface apiObj{
    current: WeatherInfo,
    location: ApiLocationObj,
    forecast: ForecastInfo,
}


interface WeatherInfo  {
    condition: condition,
    feelslike_c: number,
    feelslike_f: number,
    gust_kph: number,
    gust_mph: number,
    humidity: number,
    cloud: number,
    temp_c: number,
    temp_f: number,
    location: ApiLocationObj,
}

interface condition {
    code: number,
    text: string,
    icon: string,
}

interface ForecastInfo{
    forecastday: ForecastDaily[];
}

interface ForecastDaily{
    date: string,
    day: ForecastDayInfo,
}

interface ForecastDayInfo{
    avgtemp_f:number,
    condition: condition,
    daily_chance_of_rain: number,
    daily_chance_of_snow:number,
}



interface ApiLocationObj{
    name: string,
    region: string,
    localtime: string,
}


export default function updateUI(info: apiObj):void{
    updateMain(info);
    updateFunFacts(info);
    updateBackgroundImage(info);
    updateForecast(info);

}

function updateMain(info: apiObj): void{
    const descDiv = document.querySelector(".search-main-info");
    const weatherDesc:HTMLElement |null | undefined = descDiv?.querySelector(".weather-description");
    if( weatherDesc){
        const text = weatherDesc.querySelector(".description-text") as HTMLDivElement;
        if(text)
            text.innerText = info.current.condition.text;
        const icon = weatherDesc.querySelector("img") as HTMLImageElement;
        if(icon)
            icon.src = info.current.condition.icon;
    }
    const location:HTMLElement |null | undefined = descDiv?.querySelector(".location");
    if(location)
        location.innerText = info.location.name;

    const date:HTMLElement |null | undefined = descDiv?.querySelector(".date");
    if(date){
        const dateArr = info.location.localtime.split(' ');
        const formattedDate = formatDate(dateArr[0]);
        date.innerText = `${formattedDate} ${dateArr[1]}`;
    }

    const temp:HTMLElement |null | undefined = descDiv?.querySelector(".temp");
    if(temp)
        temp.innerText = info.current.temp_f.toString() + '\xB0' + 'F';

    
} 

function updateFunFacts(info: apiObj){
    const ffDiv = document.querySelector(".fun-facts");
    const feelsLike:HTMLElement | null |undefined = ffDiv?.querySelector(".feels-like");
    if(feelsLike)
        feelsLike.innerText = info.current.feelslike_f.toString() + ' \xB0' + 'F';

    const rainChance:HTMLElement | null |undefined = ffDiv?.querySelector(".rain-chance");
    if(rainChance)
       rainChance.innerText = info.current.cloud.toString() + ' %';

    const humidity:HTMLElement | null |undefined = ffDiv?.querySelector(".humidity");
    if(humidity)
        humidity.innerText = info.current.humidity.toString() + ' %';

    const windSpeed:HTMLElement | null |undefined = ffDiv?.querySelector(".wind-speed");
    if(windSpeed)
        windSpeed.innerText = info.current.gust_mph.toString() + " mph";
}

function updateForecast(info:apiObj){
    const fdiv = document.querySelector(".forecast") as HTMLDivElement;
    fdiv.innerHTML = "";
    for(let i=0; i<info.forecast.forecastday.length; ++i){
       const dayDiv = createForecastDayDiv(info.forecast.forecastday[i]);
        fdiv.appendChild(dayDiv);
    }
}

function createForecastDayDiv(info:ForecastDaily): HTMLDivElement{
    const dayDiv = document.createElement("div");
    dayDiv.className = "day-forecast";
    const dateDiv = document.createElement("div");
    dateDiv.innerText = formatDate(info.date);
    const conditionDiv = document.createElement("div");
    conditionDiv.innerText = info.day.condition.text;
    const tempDiv = document.createElement("div");
    tempDiv.innerText = info.day.avgtemp_f + " \xB0F";
    const rainChanceDiv = document.createElement("div");
    rainChanceDiv.innerText = `Rain: ${info.day.daily_chance_of_rain}%`;
    const snowChanceDiv = document.createElement("div");
    snowChanceDiv.innerText = `Snow: ${info.day.daily_chance_of_snow}%`;

    dayDiv.appendChild(dateDiv);
    dayDiv.appendChild(conditionDiv);
    dayDiv.appendChild(tempDiv);
    dayDiv.appendChild(rainChanceDiv);
    dayDiv.appendChild(snowChanceDiv);

    return dayDiv;
 
}


type cssOption = "sunny" | "cloudy" | "snowy" | "thunder" | "foggy" | "rainy";
function updateBackgroundImage(info:apiObj){
    switch(info.current.condition.code){
        case 1000: 
            document.body.style.backgroundImage = `url(${sunnyImg})`;
            updateinfoBackgroundColor("sunny"); 
            break;

        case 1003: case 1006 : case 1009 : case 1063 : case 1066 : case 1069:
            document.body.style.backgroundImage = `url(${cloudyImg})`;
            updateinfoBackgroundColor("cloudy"); 
            break;

         case 1072: case 1114: case 1117: case 1168: case 1172: case 1207: case 1210: case 1213: case 1216: case 1219: case 1222: case 1225: case 1237: case 1255: case 1258: case 1261: case 1264:  case 1282:
            document.body.style.backgroundImage = `url(${snowyImg})`;
            updateinfoBackgroundColor("snowy"); 
            break;

         case 1087: case 1273: case 1276: case 1279:
            document.body.style.backgroundImage = `url(${thunderImg})`;
            updateinfoBackgroundColor("thunder"); 
            break;

         case 1030: case 1135: case 1147: 
            document.body.style.backgroundImage = `url(${foggyImg})`;
            updateinfoBackgroundColor("foggy"); 
            break;

          case 1150: case 1153: case 1180: case 1183: case 1186: case 1189: case 1192: case 1195: case 1198: case 1201: case 1204: case 1240: case 1243: case 1246: case 1249: case 1252: 
            document.body.style.backgroundImage = `url(${rainImg})`;
            updateinfoBackgroundColor("rainy"); 
            break;


            default:
                document.body.style.backgroundImage = `url(${foggyImg})`;
                updateinfoBackgroundColor("foggy"); 
                break;

   
    }
}


function updateinfoBackgroundColor(weather: cssOption){
    const infoDivs = Array.from(document.getElementsByClassName('colored-background') as HTMLCollectionOf<HTMLElement>);
    switch (weather){
       case "sunny":
           for(let i=0; i<infoDivs.length; i++){
                infoDivs[i].style.backgroundColor = "rgba(23, 163, 209, 0.8)";
            }
       break;
       case "cloudy":
           for(let i=0; i<infoDivs.length; i++){
                infoDivs[i].style.backgroundColor = "rgba(16, 122, 55,0.6)";
            }

        break;
        case "snowy":
           for(let i=0; i<infoDivs.length; i++){
                infoDivs[i].style.backgroundColor = "rgba(239, 237, 240,0.6)";
            }
         break;

        case "rainy":
           for(let i=0; i<infoDivs.length; i++){
                infoDivs[i].style.backgroundColor = "rgba(58,58,59,0.6)";
            }
         break;

        case "thunder":
           for(let i=0; i<infoDivs.length; i++){
                infoDivs[i].style.backgroundColor = "rgba(207,204,66,0.6)";
            }
        break;

        default:
           for(let i=0; i<infoDivs.length; i++){
                infoDivs[i].style.backgroundColor = "rgba(16, 122, 55,0.6)";
            }
         break;

 
    }
}


function formatDate(ymd:string): string{
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ];

    const date = new Date(ymd);
    const year = date.getFullYear();
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const formattedDate = `${month} ${day}, ${year}`;

    return formattedDate
}

export type {apiObj};












