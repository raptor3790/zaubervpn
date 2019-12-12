import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import { AuthService } from '../services';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(public authService: AuthService,
              public router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    if (!expectedRole.includes(this.authService.getCurrentUser().roleid)) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
