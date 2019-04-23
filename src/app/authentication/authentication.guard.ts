import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from './authentication.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    
    constructor(private authenticationService: AuthenticationService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const isAuthenticated = this.authenticationService.getIsAuthenticated();

        if (!isAuthenticated) {
            this.router.navigate(['login']);
        }

        return isAuthenticated;
    }
}