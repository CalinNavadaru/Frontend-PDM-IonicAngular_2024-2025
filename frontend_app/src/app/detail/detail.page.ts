import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../domain/employee';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit, OnDestroy {

  employeeId: number = 0;
  employee: Employee = {} as Employee;
  subscription: Subscription = new Subscription;
  isToastOpen: boolean = false;
  toastMessage: string = "";
  map: any;
  marker: any;

  constructor(private router: Router, private employeeService: EmployeeService, private formBuilder: FormBuilder) { 
    
  } 

  ngOnInit() {
    if (this.router.getCurrentNavigation()?.extras?.state?.['employee_id']) {
      this.employeeId = this.router.getCurrentNavigation()?.extras.state?.['employee_id'];
    }
  }

  ionViewWillEnter() {
  }
  

  ionViewDidEnter() {
    this.subscription = this.employeeService.getEmployee(this.employeeId).subscribe(data => {
      this.employee = data;
      console.log(data.profile_picture);
      this.loadMap();
    }) 
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadMap() {
      this.map = L.map('map', {
        center: [45.0, 25.0],
        zoom: 6,
      });
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
  
      this.marker = L.marker([this.employee.latitude, this.employee.longitude]).addTo(this.map);
    }
}
