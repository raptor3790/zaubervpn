import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services';

@Injectable()
export class PublicGuard implements CanActivate {
  constructor(public authService: AuthService,
    public router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

    if (this.authService.isLoggedIn) {
      this.router.navigate(['/account']);
      return false;
    } else {
      return true;
    }
  }
}
