import { Component, Input, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { IonicModule } from '@ionic/angular';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-employee-card',
  templateUrl: './employee-card.component.html',
  styleUrls: ['./employee-card.component.scss'],
  standalone: true,
  imports: [IonicModule, DatePipe, CurrencyPipe]
})
export class EmployeeCardComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  salary: number = 0;
  onField: boolean = false;
  dateJoined: string = '';
  @Input() employeeID!: Number;

  constructor(private employeeService: EmployeeService) {

  }

  ngOnInit() {
    this.employeeService.getEmployee(this.employeeID.valueOf()).subscribe(employee => {
      this.firstName = employee.first_name;
      this.lastName = employee.last_name;
      this.salary = employee.salary;
      this.onField = employee.on_field;
      this.dateJoined = employee.date_join.toString();
    })
  }
}
