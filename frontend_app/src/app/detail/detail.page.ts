import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../domain/employee';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    }) 
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
