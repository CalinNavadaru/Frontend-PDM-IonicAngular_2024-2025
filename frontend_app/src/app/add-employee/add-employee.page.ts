import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Employee } from '../domain/employee';
import { Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import * as L from 'leaflet';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.page.html',
  styleUrls: ['./add-employee.page.scss'],
})
export class AddEmployeePage implements OnInit {

  employeeId: number = 0;
  employee: Employee = {} as Employee;
  subscription: Subscription = new Subscription;
  employeeForm: FormGroup;
  isToastOpen: boolean = false;
  image: string | undefined = '';
  toastMessage: string = "";
  map: any;
  marker: any;

  constructor(private router: Router, private employeeService: EmployeeService, private formBuilder: FormBuilder,
    private actionSheetController: ActionSheetController
  ) {
    this.employeeForm = this.formBuilder.group({
      first_name: ['', [Validators.minLength(3), Validators.required]],
      last_name: ['', [Validators.minLength(3), Validators.required]],
      salary: [1000, [Validators.min(1), Validators.required]],
      on_field: [true, [Validators.required]],
      date_join: [, [Validators.required]],
      profile_picture: ['', Validators.required],
      // location: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
    });
  }

  ngOnInit() {

    return;
  }

  ionWillEnter() {
  }

  ionViewDidEnter() {
    this.loadMap();

  }

  addEmployee() {
    if (this.employeeForm.valid) {
      const date = this.employeeForm.value['date_join'].split('T')[0]
      this.employeeForm.value['date_join'] = date;
      console.log(this.employeeForm.value);
      this.employeeService.addEmployee(this.employeeForm.value).subscribe(data => {
        console.log(data);
      }, error => {
        alert("The employee's data couldn't be added.");
        console.log(error);
      });
    }
    else {
      console.log(this.employeeForm.errors);
    }
  }

  setOpen(value: boolean) {
    this.isToastOpen = value;
  }

  get first_name() {
    return this.employeeForm.get('first_name');
  }

  get last_name() {
    return this.employeeForm.get('last_name');
  }

  get salary() {
    return this.employeeForm.get('salary');
  }

  get on_field() {
    return this.employeeForm.get('on_field');
  }

  get date_join() {
    return this.employeeForm.get('date_join');
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Choose an option',
      buttons: [
        {
          text: 'Galerie',
          handler: async () => {
            const photo = await Camera.getPhoto({
              resultType: CameraResultType.Base64,
              source: CameraSource.Photos,
              quality: 100
            });
            this.employeeForm.patchValue({
              profile_picture: photo.base64String
            });
            console.log(photo.base64String);
          }
        },
        {
          text: 'Cameră',
          handler: async () => {
            const photo = await Camera.getPhoto({
              resultType: CameraResultType.Base64,
              source: CameraSource.Camera,
              quality: 100
            });
            this.employeeForm.patchValue({
              profile_picture: photo.base64String
            });
          }
        },
        {
          text: 'Anulează',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }


  loadMap() {
    this.map = L.map('map', {
      center: [45.0, 25.0],
      zoom: 6,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.marker = L.marker([45.0, 25.0]).addTo(this.map);

    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng
      this.setMarker(e.latlng.lat, e.latlng.lng);
      this.updateLocation(lat, lng);
    });

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.updateLocation(position.lat, position.lng);
    });
  }

  setMarker(lat: number, lng: number) {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
  }

  updateLocation(lat: number, lng: number) {
    this.employeeForm.patchValue({
      latitude: lat,
      longitude: lng,
    });
  }
}
