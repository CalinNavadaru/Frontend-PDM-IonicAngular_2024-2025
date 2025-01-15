import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavController, SearchbarInputEventDetail } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { urlBackendWebSocket } from 'src/url';
import { Employee } from '../domain/employee';
import { EmployeeNotification } from '../domain/employee-notification';
import { EmployeeUpdatesWebSocketService } from '../services/employee-updates-web-socket.service';
import { EmployeeService } from '../services/employee.service';
import { AuthService } from '../services/auth.service';
import { IonSearchbarCustomEvent } from '@ionic/core';
import { createAnimation, Animation, AnimationBuilder } from '@ionic/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {


  employeeMap: Map<Number, Employee> = new Map();
  updatesObservable!: Observable<EmployeeNotification>;
  subscriptionUpdateService!: Subscription;
  subscriptionEmployeeData!: Subscription;
  chunkSize: number = 10;
  displayedEmployees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  currentIndex: number = 0;
  isLoading: boolean = false;
  lastNameSearch: string = '';
  transition!: AnimationBuilder;


  constructor(private employeeService: EmployeeService, private employeeUpdatesService: EmployeeUpdatesWebSocketService,
    private cdr: ChangeDetectorRef, private navCtrl: NavController, private auth: AuthService) {

  }

  // navigateWithCustomTransition(): Animation {
  //   const transition = createAnimation('my-animation-identifier')
  //     .duration(1500)
  //     .easing('ease-in-out')
  //     .fromTo('transform', 'translateX(100%)', 'translateX(0%)')
  //     .fromTo('opacity', '0', '1'); 
  //   return transition;
  // }

  overrideIonItemAnimation(baseEl: any): Animation {
    const animation = createAnimation()
      .addElement(baseEl)
      .duration(500)
      .easing('ease-out')
      .fromTo('opacity', '0', '1')
      .fromTo('transform', 'translateY(100px)', 'translateY(0)');
    return animation;
  }

  navigateWithCustomTransition(): AnimationBuilder {
    return (baseEl: any) => {
      const animation = createAnimation('my-animation-identifier')
        .addElement(baseEl)  // Use the base element for the animation
        .duration(1500)
        .easing('ease-in-out')
        .fromTo('transform', 'translateX(100%)', 'translateX(0%)')  // Slide in from right
        .fromTo('opacity', '0', '1');  // Fade in
      return animation;  // Return the animation
    };
  }

  ngOnInit(): void {
    const baseEl = document.querySelector('ion-searchbar');
    if (baseEl) {
      this.overrideIonItemAnimation(baseEl).play();
    }
    this.transition = this.navigateWithCustomTransition();
    this.employeeUpdatesService.connect(urlBackendWebSocket);
    this.updatesObservable = this.employeeUpdatesService.getEmployeeUpdates();
  }

  ionViewWillEnter() {
    this.subscriptionEmployeeData = this.employeeService.getEmployees().subscribe(data => {
      this.employeeMap = data.reduce<Map<number, Employee>>((acc, employee) => {
        acc.set(employee.employee_id, employee);
        return acc;
      }, new Map());
      this.displayNextEmployees()
    })
    this.subscriptionUpdateService = this.updatesObservable.subscribe(data => {
      console.log(data);
      console.log(typeof (data));
      this.employeeMap.set(data.employee.employee_id, data.employee);
      this.displayedEmployees.unshift(data.employee);
      if (this.lastNameSearch === data.employee.last_name) {
        this.filteredEmployees.unshift(data.employee);
      }
      this.cdr.detectChanges();
    })
  }

  displayNextEmployees() {
    const selectedEmployees = Array.from(this.employeeMap.values()).slice(this.currentIndex, this.currentIndex + this.chunkSize);
    this.displayedEmployees = [...this.displayedEmployees, ...selectedEmployees];
    this.currentIndex += selectedEmployees.length;

    this.chunkSize = Math.min(this.chunkSize + 5, 30);
  }

  loadMoreEmployees(event: any) {
    if (this.isLoading) return;

    this.isLoading = true;
    this.displayNextEmployees();

    if (this.currentIndex >= this.employeeMap.size) {
      event.target.disabled = true;
    }

    event.target.complete();
    this.isLoading = false;
  }

  ionViewDidEnter() {

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
    this.employeeUpdatesService.close();
    this.auth.logout();
  }

  goToDetail(employeeId: Number) {
    const data = { employee_id: employeeId };
    this.navCtrl.navigateForward(["/detail"], {
      replaceUrl: false,
      skipLocationChange: false,
      state: { employee_id: employeeId },
      animation: this.transition
    });
  }

  onClick() {
    this.navCtrl.navigateForward(['/add'], { replaceUrl: false, skipLocationChange: false });
  }

  onSearchChange(event: IonSearchbarCustomEvent<SearchbarInputEventDetail>) {
    this.filteredEmployees = [];
    const selectedEmployees = Array.from(this.employeeMap.values()).filter((x) => {
      if (x.last_name === this.lastNameSearch) {
        return true;
      }
      return false;
    });
    this.filteredEmployees = [...this.filteredEmployees, ...selectedEmployees];
  }

}
