import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit, AfterViewInit {
  @Output() locationSelected = new EventEmitter<{ lat: number; lng: number }>(); // Eveniment pentru a transmite locația
  map: any;
  marker: any;

  constructor() {}

  ngOnInit() {
    return;
  }

  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap() {
    this.map = L.map('map', {
      center: [45.0, 25.0], 
      zoom: 6,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      this.setMarker(e.latlng.lat, e.latlng.lng);
      this.emitLocation(e.latlng.lat, e.latlng.lng);
    });
  }

  setMarker(lat: number, lng: number) {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]); 
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map); 
    }
  }

  emitLocation(lat: number, lng: number) {
    this.locationSelected.emit({ lat, lng });
  }
}
