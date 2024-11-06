import { Component, OnInit } from '@angular/core';
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
export class DetailPage implements OnInit {

  employeeId: number = 0;
  employee: Employee = {} as Employee;
  subscription: Subscription = new Subscription;
  employeeForm: FormGroup;
  isToastOpen: boolean = false;
  toastMessage: string = "";

  constructor(private router: Router, private employeeService: EmployeeService, private formBuilder: FormBuilder) { 
    this.employeeForm = this.formBuilder.group({
      first_name: ['', [Validators.minLength(3)]],
      last_name: ['', [Validators.minLength(3)]],
      salary: [0, [Validators.min(0)]],
      on_field: [true, []],
      date_join: ['', []]
    });
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

  editEmployee() {
    if (this.employeeForm.valid) {
      const date = new Date(this.employeeForm.value['date_join'])
      this.employeeForm.value['employee_id'] = this.employeeId;
      const filteredValues = Object.fromEntries(
        Object.entries(this.employeeForm.value).map(([key, value]: [string, any]) => {
          const finalValue = value !== 0 && value !== "" && value !== null && value !== undefined ? value : this.employee[key];
          return [key, finalValue];
        })
      );
      console.log(filteredValues['date_join']);
      console.log(filteredValues);
      this.employeeService.updateEmployee(filteredValues, this.employeeId).subscribe(data => {
        console.log(data);
      });
    }
    else {
      console.log(this.employeeForm.errors);
    }
  }

  setOpen(value: boolean) {
    this.isToastOpen = value;  
  }

}
