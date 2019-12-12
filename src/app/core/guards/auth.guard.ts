import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
        private authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if (this.authService.isLoggedIn) {
            return of(true);
        } else {
            // not logged in so redirect to login page with the return url
            this.router.navigate(['/auth/login']);
            return of(false);
        }
    }
}
