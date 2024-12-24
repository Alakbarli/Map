import { JsonPipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as L from "leaflet";
import { MapService } from '../../services/map.service';
import { ApiService } from '../../services/api.service';
import { environment } from '../../../enviroments/enviroment';
const iconRetinaUrl = 'public/marker-icon-2x.png';
const iconUrl = 'public/marker-icon.png';
const shadowUrl = 'public/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-shape',
  standalone: true,
  imports: [],
  templateUrl: './shape.component.html',
  styleUrl: './shape.component.scss'
})
export class ShapeComponent  implements OnInit,AfterViewInit,OnDestroy{
  private map?:L.Map;

  countryData:Array<any>=[];
  constructor(private mapService:MapService,private api:ApiService){

  }
  ngOnDestroy(): void {
  }
  ngAfterViewInit(): void {
    this.initMap();
    
  }
  ngOnInit(): void {
    this.getCountryData()
    this.getLocation();
  }
  initMap(){
    this.map = L.map('map', {
      center: [ 40.40050871474247, 47.61794526591817 ],
      zoom: 6
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  //////////////////////////////////

  location?:GeolocationPosition;
  
  
 
 
  getLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos=>{
       this.location=pos;
       this.mapService.addMarker(this.location?.coords.latitude,this.location?.coords.longitude,this.map!);
      })
     }
  }

  getCountryData(){
    this.api.get(`${environment.assetsUrl}azerbaycanUmumi.json`).subscribe({
      next:json=>{
        this.countryData=json;
        this.initStatesLayer()
        console.log(json)
      },
      error:err=>{
        console.log(err)
      }
    })
  }

  private initStatesLayer() {
    const stateLayer = L.geoJSON(this.countryData, {
      style: (feature) => ({
        weight: 3,
        opacity: 0.5,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: '#6DB65B'
      })
    });

    this.map!.addLayer(stateLayer);
  }

}
