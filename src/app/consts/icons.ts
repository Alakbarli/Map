import * as L from "leaflet";
export const personIcon = L.icon({
    iconUrl: 'icons/person-location.png',
    iconSize: [40, 40],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className:"person-icon"
  });

  export const pointerInfoIcon = L.icon({
    iconUrl: 'icons/pointer-info.png',
    iconSize: [22, 35],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className:"person-icon"
  });