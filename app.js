const cityinput = document.querySelector('.city-input')
const SearchBtn = document.querySelector('.search-btn')
const weatherInfoSection = document.querySelector('.weather-info')
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')
const countryTxt = document.querySelector('.country-txt')
const apiKey = 'bb91818a02861e335655ea8a06766284'
const temperatureTxt = document.querySelector('.temperature-txt')
const weatherConditionTxt = document.querySelector('.weather-condition-txt')
const humidityTxt = document.querySelector('.humidity-value-txt')
const windSpeedTxt = document.querySelector('.Wind-value-txt')
const weatherSummary = document.querySelector('.weather-summary-img')
const currentDate = document.querySelector('.current-date-time-txt')
const forecastsContainer = document.querySelector('.forecast-item-container')
SearchBtn.addEventListener('click', () => {
    if(cityinput.value.trim() != ''){
         updateWeatherInfo(cityinput.value)
        cityinput.value = ''
        cityinput.blur()
    }
})


cityinput.addEventListener('keydown', (event)=>{
    
    if(event.key == 'Enter' && cityinput.value.trim() != ''){
         updateWeatherInfo(cityinput.value)
        cityinput.value = ''
        cityinput.blur()
    }
    
}
) 

async function getFetchData(endpoint, city) {
       const apiUrl= `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`
          const response = await fetch(apiUrl)

          return response.json()
    }

function getWeatherIcon(id){
       if(id<=232) return 'thunderstorm.svg'
       if(id<=321) return 'drizzle.svg'
       if(id<=531) return 'rain.svg'
       if(id<=622) return 'snow.svg'
       if(id<=781) return 'atmosphere.svg'
       if(id<=800) return 'clear.svg'
       else return 'clouds.svg'
}

 function getCurrentDate(){
    const currentDate = new Date()
    const option = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-US', option)
 }

async function updateWeatherInfo(city) {
        const weatherData = await getFetchData('weather', city)

        if(weatherData.cod != 200){
            showDisplaySection(notFoundSection)
            return
        }
        

        const {
            name: country,
            main: { temp, humidity },
            weather: [{ id, main }],
            wind: { speed }, 
        } = weatherData

        countryTxt.textContent = country
        temperatureTxt.textContent = Math.round(temp) + ' °C'
        weatherConditionTxt.textContent = main
        humidityTxt.textContent = humidity + ' %'
        windSpeedTxt.textContent = speed + ' m/s'

       currentDate.textContent = getCurrentDate()
       console.log(getCurrentDate())
       weatherSummary.src = `assets/weather/${getWeatherIcon(id)}`
       await updateForecastsInfo(city)
        showDisplaySection(weatherInfoSection)
}

async function updateForecastsInfo(city){
     const forecastsData = await getFetchData('forecast', city)

       const timeTaken = '12:00:00'
       const todayDate = new Date().toISOString().split('T')[0]
       
       forecastsContainer.innerHTML = ''
       forecastsData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)){
           updateForecastsItems(forecastWeather)
        }
       })
      
}
function updateForecastsItems(forecastWeather){
       console.log(forecastWeather)
      const{
       dt_txt: date,
       weather: [{id}],
       main: {temp}
      } = forecastWeather

       const dateTaken = new Date(date)
       const dateOption = {
        day: '2-digit',
        month: 'short'
       }
        const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)
      const forecastItem = 
      ` <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}"class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)}°C</h5>
        </div>`

        forecastsContainer.insertAdjacentHTML('beforeend', forecastItem)

}
function showDisplaySection(section){
    [weatherInfoSection, searchCitySection, notFoundSection,]
    .forEach(section=> section.style.display = 'none')
    section.style.display = 'flex'


}
