<template xmlns:v-bind="http://www.w3.org/1999/xhtml">

    <loading-widget v-bind="loader">
        <div class="sidebar-box shadow mt15">
            <ul>
                <li><h2 class="text-center">Weather</h2></li>
                <li v-for="(day, index) in weatherForecast" v-bind:class="{highlighted: index == 0}">
                    <div class="weather-box">
                        <div class="weather-desc">
                            {{ day.date }}<span v-if="index == 0" class="today">  (today)</span><br>
                            <span>{{ day.weather_desc }}</span><br>
                            clouds: <span>{{ day.clouds | round }}%, {{ day.pressure | round(2) }} hpa</span>
                        </div>
                        <div class="temp">
                            <span v-bind:class="tempIndicator(day.temp_min)">{{ day.temp_min | round(1) }}C</span>
                            <span v-bind:class="tempIndicator(day.temp_max)">{{ day.temp_max | round(1) }}C</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </loading-widget>

</template>

<script>

import LoadingWidget from './LoadingWidget.vue'
import moment from 'moment-timezone'
import Helper from '../helpers/helpers'

export default {
    components:{
        'loading-widget': LoadingWidget,
    },
    data () {
        return {
            weatherForecast: [],
            apiCallForecast: 'http://api.openweathermap.org/data/2.5/forecast?id=683506&units=metric&APPID=10b14281af9f77b3b8560f8aa58b7c9f',
            timeZone: 'Europe/Bucharest',
            loader: {
                loading: true,
                error: false,
                msg: "We're sorry, we're not able to retrieve this information at the moment, please try back later.",
            }
        }
    },
    methods: {

        // funkcija koja vraća naziv class-e ovisno o temperaturi
        tempIndicator(temp){

            temp.toFixed(1);

            if(temp < 14){return 'bgBlue'}
            if(temp < 20){return 'bgOrange'}
            if(temp < 25){return 'bgGreen'}
            if(temp >= 25){return 'bgRed'}
        },

        // funkcija za dohvaćanje vremenske prognoze sa api-ja
        // ukoliko je request uspješan podaci se šalju na daljnju obradu zajedno sa vremenskom zonom
        // ukoliko je došlo do greške, na ekranu se ispisuje poruka
        // dok se request ne izvrši na ekranu se vrti loading
        fetchForecast(){
            this.axios
                    .get(this.apiCallForecast)
                    .then(response => {
                        this.calculateForecast(response.data.list, this.timeZone)
                        console.log(response.data.list)
                    })
                    .catch(error => {
                        console.log(error)
                        this.loader.error = true;
                    }).finally(() => {this.loader.loading = false;});
        },

        // dobiveni podaci su za sljedećih 5dana u intervalu od 3sata
        // pošto su podaci mjereni po UTC vremenu trebamo ih pretvoriti u potrebnu vremensku zonu (UTC +03:00)
        // za prvi dan sprema trenutne vrijednosti pressure, cloud i weather desc, a najniži i najvišu temp računa tijekom ostatka dana
        // za sve ostale dane računa srednje vrijednosti pressure i clouds, najnižu i najvišu temp tijekom dana, te weather description uzima od 12:00h do 15:00h
        // na kraju izračuna svaki dan se sprema u listu
        calculateForecast(weatherData, timezone){

            var counter = 0, temp_min = 0, temp_max = 0, pressure = 0, clouds = 0, weather_desc = "", firstDay = true, currentDay;

            for(var i = 0; i < weatherData.length; i++){

                var utcTime = moment.tz(weatherData[i].dt_txt,"UTC");
                var correctedTimeZone = moment(utcTime).tz(timezone);

                if(i == 0){
                    currentDay = correctedTimeZone;
                }

                var sameDay = moment(currentDay).isSame(correctedTimeZone, 'day');

                if(sameDay){

                    if(counter == 0){
                        temp_min = weatherData[i].main.temp_min;
                        temp_max = weatherData[i].main.temp_max;
                    }
                    if(temp_min > weatherData[i].main.temp_min){
                        temp_min = weatherData[i].main.temp_min;
                    }
                    if(temp_max < weatherData[i].main.temp_max){
                        temp_max = weatherData[i].main.temp_max;
                    }
                    if(firstDay && i == 0){
                        pressure = weatherData[i].main.pressure;
                        clouds = weatherData[i].clouds.all;
                        weather_desc = weatherData[i].weather[0].description;
                    }
                    if(!firstDay){
                        pressure = pressure + weatherData[i].main.pressure;
                        clouds = clouds + weatherData[i].clouds.all;

                        if(counter == 4){
                            weather_desc = weatherData[i].weather[0].description;
                        }
                    }

                    counter ++;

                }

                if(!sameDay){

                    if(!firstDay){
                        pressure = pressure/8;
                        clouds = clouds/8;
                    }

                    // spremanje dobivenih vrijednosti za trenutni dan
                    this.weatherForecast.push({
                        'date': currentDay.format("ddd D MMM"),
                        'temp_min': temp_min,
                        'temp_max': temp_max,
                        'pressure': pressure,
                        'clouds': clouds,
                        'weather_desc': weather_desc
                    });

                    // kada se svih 5 dana spremi u listu podaci se sprmaju u local storage s trajanjem od pola sata
                    if(this.weatherForecast.length == 5){
                        Helper.setLocalItem("weatherForecast", this.weatherForecast, 1800);
                        break;
                    }

                    temp_min = 0, temp_max = 0, pressure = 0, clouds = 0, weather_desc = "", counter = 0, firstDay = false;
                    currentDay = correctedTimeZone;
                    i--;
                }

                if(sameDay && i == weatherData.length - 1){

                    pressure = pressure/8;
                    clouds = clouds/8;

                    this.weatherForecast.push({
                        'date': currentDay.format("ddd D MMM"),
                        'temp_min': temp_min,
                        'temp_max': temp_max,
                        'pressure': pressure,
                        'clouds': clouds,
                        'weather_desc': weather_desc
                    });

                    Helper.setLocalItem("weatherForecast", this.weatherForecast, 1800);
                }
            }

        }
    },
    created(){
        // provjera da li podaci već postoje u local storage
        // ukoliko podaci već postoje ispisuju se na ekranu
        // ukoliko podaci ne postoje poziva s funkcija za njihovo dohvaćanje
        if(Helper.getLocalItem('weatherForecast')){
            this.weatherForecast = Helper.getLocalItem('weatherForecast');
            this.loader.loading = false;
        }else{
            this.fetchForecast();
        }
    }
}

</script>

<style lang="scss" rel="stylesheet/scss" scoped>

    h2{
        @extend .l700;
        font-size:17px;
        color:$dark-grey;
    }

    li{padding:12px 18px;}

    .sidebar-box{
        min-height:430px;
    }

    .weather-box{
        display: -webkit-flex;
        display:flex;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        line-height:1.4;

        @media (max-width: $xs) {
            -webkit-flex-direction:column;
            flex-direction: column;
        }
    }

    .weather-desc{
        @extend .os600;
        font-size:13px;
        color:#000000;

        span{color:$dark-grey}

        .today{@extend .os600i}
    }

    .temp{

        @media (max-width: $xs) {
            margin-top: 5px;
        }

        span{
            display:inline-block;
            padding: 2px 0px;
            width: 40px;
            color: #ffffff;
            text-align:center;
            font-size:11px;
            @extend .os700;
        }
    }

</style>
