const apiKey = ''; //Skriv in din API-nyckel.
const countryUrl = 'https://restcountries.eu/rest/v2/all'; //Används för att hämta flaggor.

const form = document.querySelector('#form'); //Väljer formuläret med id "form";

const topTitle = document.querySelector('#top-title');
const city = document.querySelector('#city'); //väljer taggen där stadens namn ska stå.
const temp = document.querySelector('#temp'); //väljer taggen där stadens temperatur ska stå.
const wind = document.querySelector('#wind'); //väljer taggen där vindhastighet ska stå.
const humidity = document.querySelector('#humidity'); //väljer taggen där luftfugtigheten ska stå.
const des = document.querySelector('#des'); //väljer taggen där beskrivningen ska stå.
const icon = document.querySelector('#icon'); //väljer taggen där ikonen ska va.
const moreIcons = document.querySelector('#more-icons'); //väljer taggen more-icons ifall fler ikoner ska visas.
const container = document.querySelector('.container'); //väljer containern.
const box1 = document.querySelector('.box-1'); //väljer boxen där all informstion ska stå.
const box2 = document.querySelector('.box-2'); //väljer boxen där smileys ska stå.
const smiley = document.querySelector('#smiley');
const footer = document.querySelector('.footer'); //Väljer footern.
const historyList = document.querySelector('.history-list'); //Lista med historik.
const flag = document.querySelector('#flag');

form.addEventListener('submit', function(e){ 
    const text = document.querySelector('#text');
    let cn = text.value;
    getCityWeatherData(cn); //Kallar på functionen som hämtar datan.
    e.preventDefault();
});


function getCityWeatherData(cityName){
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric&lang=se`;
    fetch(url).then( //Väntar på respons från APIn om vi får använda datan.
        function(response) {
            console.log(response)
            if (response.status >= 200 && response.status < 300){
                return response.json(); //returnerar datan vi behöver liknande ett javascript object.
            } else if (response.status == 401){
                throw response.status + ": " + response.statusText;
            } else if (response.status == 404){
                throw response.status + ": Staden kunde inte hittas";
            } else if (response.status == 400){
                throw response.status + ": Du har inte skrivit in någon stad";
            } else {
                throw response.status + ": Något gick fel";
            }
        }
    ).then( //Här får vi ut vår data från APIn efter att responsen fungerade.
        function(data){
            console.log(data);

            const searched = cityName.charAt(0).toUpperCase() + cityName.slice(1);
            topTitle.innerText = searched;
            city.innerText = `${data.name}, ${data.sys.country}`;
            temp.innerText = `${data.main.temp} C°`;
            let description = `Just nu är det: ${data.weather[0].description}`;
            const iconCode = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            moreIcons.innerHTML = ''; // Ifall väderbeskrivningen inte har fler än en beskrivning och därmed inte fler ikoner.
            if (data.weather.length > 1){ //Skulle vädret ha flera beskrivningar och ikoner (weather-arrayn ha fler än ett element).
                for (let i = 1; i < data.weather.length; i++){

                    let newIcon = document.createElement('img');
                    newIcon.src = `http://openweathermap.org/img/wn/${data.weather[i].icon}.png`;
                    newIcon.classList.add('another-icon');
                    moreIcons.appendChild(newIcon);
                    if (data.weather[i].description == data.weather[i-1].description) {
                        description = description + ' och ' + data.weather[i].description;
                    }
                    else {
                        description = description + ' och ' + data.weather[i].description;
                    }
                    
                }
            }
            des.innerText = `${description}.`;
            icon.style.display = 'inline';
            icon.src = iconCode;
            wind.innerText = `Vindhastighet: ${data.wind.speed} m/s`;
            humidity.innerText = `Luftfuktighet: ${data.main.humidity}%`;

            let l = 90 - (data.main.temp * 1.2); //Används för att bestämma färgen på bakgrunden.


            console.log(l)
            container.style.backgroundColor = `hsl(44, 100%, ${l}%)`;

            if (data.main.temp < 0) {
                smiley.innerText = '🥶';
            } else if (data.main.temp >= 0 && data.main.temp < 5) {
                smiley.innerText = '😶';
            } else if (data.main.temp >= 5 && data.main.temp < 16) {
                smiley.innerText = '🙂';
            } else if (data.main.temp >= 16 && data.main.temp < 34) {
                smiley.innerText = '😎';
            } else if (data.main.temp >= 34 && data.main.temp < 40) {
                smiley.innerText = '😓';
            } else if (data.main.temp >= 40) {
                smiley.innerText = '🥵';
            }

            const historyItem = document.createElement('li');
            historyItem.innerText = cityName;
            historyItem.classList.add('history-item');
            historyList.appendChild(historyItem);

            getCountryFlag(data.sys.country);
        }
    ).catch(
        function(error){
            console.log('Ett fel uppstod', error);
            topTitle.innerText = cityName;
            temp.innerText = error;
            des.innerText = '';
            city.innerText = ``;
            icon.src = '';
            wind.innerText = ``;
            humidity.innerText = ``;
            container.style.backgroundColor = 'ivory';
            box1.style.color = 'black';
            icon.style.display = 'none';
            moreIcons.innerHTML = '';
            flag.style.display = 'none';
        }
    );
}

function getCountryFlag(country) { //Hämtar landets flagga.
    fetch(countryUrl).then(
        response => response.json()
    ).then(
        data => {
            console.log(data);
            for (let i = 0; i < data.length; i++){
                if (data[i].alpha2Code == country) {
                    flag.style.display = 'inline';
                    flag.src = data[i].flag;
                }
            }
        }
    )
}
