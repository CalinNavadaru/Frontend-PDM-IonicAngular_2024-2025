import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EmployeeNotification } from '../domain/employee-notification';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeUpdatesWebSocketService {

  private socket!: WebSocket;
  private messages: Subject<EmployeeNotification>;

  constructor(private auth: AuthService) { 
    this.messages = new Subject<EmployeeNotification>;
  }

  public connect(url: string) {
    const token = this.auth.getToken();
    this.socket = new WebSocket(url + `?token=${token}`);
    
    this.socket.onopen = () => {
      console.log("Websocket deschis");
    }

    this.socket.onmessage = (event: MessageEvent) => {
      let employeeNotification: EmployeeNotification = JSON.parse(event.data)["message"] as EmployeeNotification;
      this.messages.next(employeeNotification);
    }

    this.socket.onerror = (error: Event) => {
      console.error('WebSocket error: ', error);
    };

    this.socket.onclose = (event: CloseEvent) => {
      console.log('WebSocket inchis', event);
    };
  }

  public close() {
    this.socket.close();
  }

  public getEmployeeUpdates() {
    return this.messages.asObservable();
  }
}
