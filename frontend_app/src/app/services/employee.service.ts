import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../domain/employee';
import { urlBackendHttp } from 'src/url';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  getEmployees() {
    let data = this.http.get<Employee[]>(urlBackendHttp);
    return data;
  }

  getEmployee(id: number) {
    let data = this.http.get<Employee>(urlBackendHttp + id.toString());
    return data;
  }

  updateEmployee(data: any, id: number) {
    let response = this.http.put(urlBackendHttp + id.toString() + '/', data);
    return response;
  }
}
