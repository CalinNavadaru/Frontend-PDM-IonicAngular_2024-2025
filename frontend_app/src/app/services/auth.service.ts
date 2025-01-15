import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, lastValueFrom, map, Observable, of } from 'rxjs';
import { urlBackendHttp } from 'src/url';
import { EmployeeUpdatesWebSocketService } from './employee-updates-web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  getToken(): string | null {
    return localStorage.getItem('jwtToken'); 
  }
  setToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${urlBackendHttp}token/`, { username, password }, {headers: headers});
  }

  register(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${urlBackendHttp}register/`, { username, password }, {headers: headers});
  }

  refresh(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const refreshToken = localStorage.getItem("jwtToken_refresh");
    const body = { refresh: refreshToken };
    return this.http.post<any>(`${urlBackendHttp}token/verify/`, body);
  }

  verify(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const accessToken = localStorage.getItem("jwtToken");
    const body = { token: accessToken };
    return this.http.post<any>(`${urlBackendHttp}token/verify/`, body);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = localStorage.getItem('jwtToken');
    console.log("[A] " + token);
    if (!token) {
      return false;
    }
    try {
      await lastValueFrom(this.verify());
      return true;
    } catch (error) {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('jwtToken_refresh');
  }
}
