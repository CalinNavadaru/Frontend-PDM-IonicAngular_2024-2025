import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, of, switchMap, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    router: any;
    http: any;

    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = localStorage.getItem('jwtToken');
        console.log("S-a apelat");
        if (accessToken) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        }

        return next.handle(request).pipe(
            catchError((error) => this.handleError(error, request, next))
        );
    }

    private handleError(error: any, request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (error.status === 401) {
            return this.authService.refresh().pipe(
                switchMap((newTokens: any) => {
                    if (newTokens) {
                        localStorage.setItem('jwtToken', newTokens.access);
                        localStorage.setItem('jwtToken_refresh', newTokens.refresh);

                        const clonedRequest = request.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newTokens.access}`,
                            },
                        });

                        return next.handle(clonedRequest);
                    }
                    this.router.navigate(['/login']);
                    return of(error);
                })
            );
        }
        return of(error);
    }
}

