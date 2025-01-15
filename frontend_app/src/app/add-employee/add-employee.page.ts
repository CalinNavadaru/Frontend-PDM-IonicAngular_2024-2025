import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Employee } from '../domain/employee';
import { Router } from '@angular/router';
import { EmployeeService } from '../services/employee.service';

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
    toastMessage: string = "";

  constructor(private router: Router, private employeeService: EmployeeService, private formBuilder: FormBuilder) { 
      this.employeeForm = this.formBuilder.group({
        first_name: ['', [Validators.minLength(3), Validators.required]],
        last_name: ['', [Validators.minLength(3), Validators.required]],
        salary: [1000, [Validators.min(1), Validators.required]],
        on_field: [true, [Validators.required]],
        date_join: [, [Validators.required]]
      });
    } 

  ngOnInit() {
    return;
  }

  addEmployee() {
    if (this.employeeForm.valid) {
      console.log(this.employeeForm.value);
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

}
