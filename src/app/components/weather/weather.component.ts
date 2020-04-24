import {Component, Input, OnInit} from '@angular/core';
import {WeatherService} from '../../services/weather.service';
import {City} from '../../Entity/City';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {

  citySearch;
  dataWeather;
  cities: City[] = [];
  city = new City();
  town = new City();
  ApiKey = 'b54039ab4f134181ad6eba46afcadf92';

  constructor(private weatherAPI: WeatherService, private geolocation: Geolocation) {

  }

  ngOnInit() {
      this.TempemperatureByLatLon();
  }

  TempemperatureByLatLon() {
      this.geolocation.getCurrentPosition().then((resp) => {
          this.city.long = resp.coords.longitude;
          this.city.lat = resp.coords.latitude;
          this.weatherAPI.getTemperature(
              'https://api.weatherbit.io/v2.0/current?&lat=' + this.city.lat + '&lon=' + this.city.long + '&key=' + this.ApiKey)
              .subscribe((data) => {
                  this.dataWeather = data;
                  this.city.name = this.dataWeather.data[0].city_name;
                  this.city.country = this.dataWeather.data[0].country_code;
                  this.city.temp = this.dataWeather.data[0].temp;
                  this.city.dateTime = this.dataWeather.data[0].datetime;
                  this.city.description = this.dataWeather.data[0].weather.description;
                  this.city.icon = this.dataWeather.data[0].weather.icon;
              });
      });
  }

  TemperatureByCity() {
      this.weatherAPI.getTemperature(
        'https://api.weatherbit.io/v2.0/forecast/daily?city=' + this.citySearch + '&key=' + this.ApiKey)
          .subscribe((data) => {
            this.dataWeather = data;
            this.city.name = this.dataWeather.city_name;
            this.city.country = this.dataWeather.country_code;
            this.city.maxTemp = this.dataWeather.data[0].max_temp;
            this.city.minTemp = this.dataWeather.data[0].min_temp;
            this.city.temp = this.dataWeather.data[0].temp;
            this.city.dateTime = this.dataWeather.data[0].datetime;
            this.city.description = this.dataWeather.data[0].weather.description;
            this.city.icon = this.dataWeather.data[0].weather.icon;
            this.cities = [];
            for (let i = 1; i <= 4; i++) {
                this.town = new City();
                this.town.name = this.dataWeather.city_name;
                this.town.country = this.dataWeather.country_code;
                this.town.maxTemp = this.dataWeather.data[i].max_temp;
                this.town.minTemp = this.dataWeather.data[i].min_temp;
                this.town.temp = this.dataWeather.data[i].temp;
                this.town.dateTime = this.dataWeather.data[i].datetime;
                this.town.description = this.dataWeather.data[i].weather.description;
                this.town.icon = this.dataWeather.data[i].weather.icon;
                this.cities.push(this.town);
              }
          });
  }

}
