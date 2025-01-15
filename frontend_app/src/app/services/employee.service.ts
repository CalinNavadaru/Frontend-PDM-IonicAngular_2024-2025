import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Employee } from '../domain/employee';
import { urlBackendHttp } from 'src/url';
import { NetworkStatusService } from './network-status.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  queue_data: any[] = [];
  last_state = false;
  constructor(private http: HttpClient, private network_status_service: NetworkStatusService) { 
    this.network_status_service.getNetworkStatus().subscribe(state => {
      if (this.last_state !== state.connected && this.last_state === false) {
        for (let element of this.queue_data) {
          let hardCopy = JSON.parse(JSON.stringify(element));
          this.addEmployee(hardCopy).subscribe(response => {
            console.log("S-au trimis datele");
          });
        }
        this.queue_data = [];
      }
      this.last_state = state.connected;
    });
  }

  getEmployees() {
    let data = this.http.get<Employee[]>(`${urlBackendHttp}employees/`);
    return data;
  }

  getEmployee(id: number) {
    let data = this.http.get<Employee>(`${urlBackendHttp}employees/` + id.toString() + '/');
    return data;
  }

  addEmployee(data: any) {
    let response = this.http.post(`${urlBackendHttp}employees/`, data, {observe: 'response'}).pipe(
      map((r) => {
        console.log('Status Code:', r.status);
        console.log('Response Body:', r.body);
        if (r.status === 0) {
          this.queue_data.push(data);
        }
        return r;
      })
    );
    return response;
  }
}
