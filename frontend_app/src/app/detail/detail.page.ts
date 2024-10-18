import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../services/employee.service';
import { Employee } from '../domain/employee';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {


  employeeId: number = 0;
  employee: Employee = {} as Employee;
  subscription: Subscription = new Subscription;
  employeeForm: FormGroup;

  constructor(private router: Router, private employeeService: EmployeeService, private formBuilder: FormBuilder) { 
    this.employeeForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(18)]],
    });
  } 

  ngOnInit() {
    if (this.router.getCurrentNavigation()?.extras?.state?.['employee_id']) {
      this.employeeId = this.router.getCurrentNavigation()?.extras.state?.['employee_id'];
    }
    console.log(this.employeeId);
  }

  ionViewDidEnter() {
    this.subscription = this.employeeService.getEmployee(this.employeeId).subscribe(data => {
      this.employee = data;
    }) 
  }

  editEmployee() {
    if (this.employeeForm.valid) {
      
    }
  }

}
