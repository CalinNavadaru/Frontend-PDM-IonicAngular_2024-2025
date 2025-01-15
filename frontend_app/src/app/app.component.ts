import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { EmployeeUpdatesWebSocketService } from './services/employee-updates-web-socket.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private auth: AuthService, private employeeUpdatesService: EmployeeUpdatesWebSocketService, private navCtrl: NavController) {}

  Logoutlick() {
    console.log("EXTERNEEEE")
    this.employeeUpdatesService.close();
    this.auth.logout();
    this.navCtrl.navigateRoot('');
  }
}
