import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { urlBackendWebSocket } from 'src/url';
import { Employee } from '../domain/employee';
import { EmployeeNotification } from '../domain/employee-notification';
import { EmployeeUpdatesWebSocketService } from '../services/employee-updates-web-socket.service';
import { EmployeeService } from '../services/employee.service';
import { NavigationOptions } from '@ionic/angular/common/providers/nav-controller';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  employeeList: Employee[] = [];
  employeeMap: Map<Number, Employee> = new Map();
  updatesObservable!: Observable<EmployeeNotification>;
  subscriptionUpdateService!: Subscription;
  subscriptionEmployeeData!: Subscription;

  constructor(private employeeService: EmployeeService, private employeeUpdatesService: EmployeeUpdatesWebSocketService,
    private cdr: ChangeDetectorRef, private navCtrl: NavController) {

    }
  ngOnInit(): void {
    console.log(3);
  }

  ionViewWillEnter() {
    this.employeeUpdatesService.connect(urlBackendWebSocket);
    this.updatesObservable = this.employeeUpdatesService.getEmployeeUpdates();
  }

  ionViewDidEnter() {
    this.subscriptionEmployeeData = this.employeeService.getEmployees().subscribe(data => {
      this.employeeMap = data.reduce<Map<number, Employee>>((acc, employee) => {
        acc.set(employee.employee_id, employee);
        return acc;
      }, new Map());
    })
    this.subscriptionUpdateService = this.updatesObservable.subscribe(data => {
      console.log(data);
      console.log(typeof (data));
      this.employeeMap.set(data.employee.employee_id, data.employee);
      this.cdr.detectChanges();
    })
  }

  ionViewWillLeave() {
    if (this.subscriptionEmployeeData) {
      this.subscriptionEmployeeData.unsubscribe();
    }
    if (this.subscriptionUpdateService) {
      this.subscriptionUpdateService.unsubscribe();
    }
  }

  ngDestroy() {
    if (this.subscriptionEmployeeData) {
      this.subscriptionEmployeeData.unsubscribe();
    }
    if (this.subscriptionUpdateService) {
      this.subscriptionUpdateService.unsubscribe();
    }
  }

  goToDetail(employeeId: Number) {
    const data = {employee_id: employeeId};
    this.navCtrl.navigateForward(["/detail"], {state: {employee_id: employeeId}})
  }

}
