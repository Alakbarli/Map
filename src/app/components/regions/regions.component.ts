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
  selector: 'app-regions',
  standalone: true,
  imports: [],
  templateUrl: './regions.component.html',
  styleUrl: './regions.component.scss'
})
export class RegionsComponent  implements OnInit,AfterViewInit,OnDestroy{
  private map?:L.Map;

  regionsData:Array<any>=[];
  constructor(private mapService:MapService,private api:ApiService){

  }
  ngOnDestroy(): void {
  }
  ngAfterViewInit(): void {
    this.initMap();
    
  }
  ngOnInit(): void {
    this.getCountryData()
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
  
  

  getCountryData(){

    this.api.get(`${environment.assetsUrl}azerbaycanBolgeler.json`).subscribe({
      next:json=>{
        this.regionsData=json;
        this.initStatesLayer()
        console.log(json)
      },
      error:err=>{
        console.log(err)
      }
    })
  }

  private highlightFeature(e:any) {
    const layer = e.target;
  
    layer.setStyle({
      weight: 10,
      opacity: 1.0,
      color: '#DFA612',
      fillOpacity: 1.0,
      fillColor: '#FAE042'
    });
  }
  
  private resetFeature(e:any) {
    const layer = e.target;
  
    layer.setStyle({
      weight: 3,
      opacity: 0.5,
      color: '#008f68',
      fillOpacity: 0.8,
      fillColor: '#6DB65B'
    });
  }
  
  private initStatesLayer() {
    const regionslayer = L.geoJSON(this.regionsData, {
      style: (feature) => ({
        weight: 3,
        opacity: 0.5,
        color: '#008f68',
        fillOpacity: 0.8,
        fillColor: '#6DB65B'
      }),
      onEachFeature: (feature, layer) => (
        layer.on({
          mouseover: (e) => (this.highlightFeature(e)),
          mouseout: (e) => (this.resetFeature(e)),
          mouseup:(e)=>{
            layer.bindPopup(`<div>${feature?.properties?.name}</div>`,{closeOnClick:true,autoClose:true})
          }
        })
        
      )
    });
    
    this.map!.addLayer(regionslayer);
  }

}
