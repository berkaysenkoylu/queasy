import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.authenticationService.getToken();
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + authToken)
        });

        return next.handle(authRequest);
    }
}