import { JsonPipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as L from "leaflet";
import { MapService } from '../../services/map.service';
import { PopupService } from '../../services/popup.service';
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
  selector: 'app-popup',
  standalone: true,
  imports: [],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent implements OnInit,AfterViewInit,OnDestroy{
  private map?:L.Map;
  constructor(private mapService:MapService,private popupService:PopupService){

  }
  ngOnDestroy(): void {
  }
  ngAfterViewInit(): void {
    this.initMap();
    this.getLocation()
    console.log(3)
    
  }
  ngOnInit(): void {
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
  location?:GeolocationPosition;
  getLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos=>{
       this.location=pos;
       let content=this.popupService.makePopup({lat:this.location?.coords.latitude,lang:this.location?.coords.longitude});
       this.mapService.addCircleMarkerWithPopup(this.location?.coords.latitude,this.location?.coords.longitude,this.map!,content);
      })
     }
  }
}
