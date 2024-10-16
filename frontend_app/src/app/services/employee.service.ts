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
}
