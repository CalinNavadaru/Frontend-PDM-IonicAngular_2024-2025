import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EmployeeNotification } from '../domain/employee-notification';

@Injectable({
  providedIn: 'root'
})
export class EmployeeUpdatesWebSocketService {

  private socket!: WebSocket;
  private messages: Subject<EmployeeNotification>;

  constructor() { 
    this.messages = new Subject<EmployeeNotification>;
  }

  public connect(url: string) {
    this.socket = new WebSocket(url);
    
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

  public getEmployeeUpdates() {
    return this.messages.asObservable();
  }
}
