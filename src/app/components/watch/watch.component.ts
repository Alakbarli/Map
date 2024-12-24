import { JsonPipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as L from "leaflet";
import { MapService } from '../../services/map.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { personIcon, pointerInfoIcon } from '../../consts/icons';
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
  selector: 'app-watch',
  standalone: true,
  imports: [JsonPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.scss'
})
export class WatchComponent implements OnInit, AfterViewInit, OnDestroy {
  private map?: L.Map;
  private markers = new Map<number, L.Marker>();
  private lastMarkerId = 1;
  private lastPosition?: GeolocationPosition;
  center: boolean = true;
  constructor(private mapService: MapService,private popUp:PopupService) {

  }
  ngOnDestroy(): void {
    this.unWatch()
  }
  ngAfterViewInit(): void {
    this.initMap();
    this.watchLocation()

  }
  ngOnInit(): void {
  }
  initMap() {
    this.map = L.map('map', {
      center: [40.40050871474247, 47.61794526591817],
      zoom: 6
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

  }

  watchId?: number;

  locations: Array<GeolocationPosition> = [];

  watchLocation() {
    if (navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition(pos => {
        //if (true) {
        if (pos.coords.longitude != this.lastPosition?.coords.longitude && pos.coords.latitude != this.lastPosition?.coords.latitude) {
          if(this.markers.has(this.lastMarkerId)){
            const lastMarker=this.markers.get(this.lastMarkerId);
            lastMarker!.setIcon(pointerInfoIcon);
          }
          this.locations?.push(pos);
          const marker = L.marker([pos.coords.latitude, pos.coords.longitude], { icon: personIcon })
          .bindPopup(this.popUp.makePopup({lat:pos.coords.latitude,lang:pos.coords.longitude,date:pos.timestamp}));
          marker.addTo(this.map!);
          this.markers.set(++this.lastMarkerId, marker);
          this.lastPosition=pos


          //this.mapService.addMarker(pos.coords.latitude,pos.coords.longitude,this.map!);

          if (this.center) {
            this.map?.panTo([pos.coords.latitude, pos.coords.longitude]);
          }

          console.log(pos)
        }

      },
        err => {
          console.log(err)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
    }
  }
  unWatch() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  centerLocation(){

  }
}
