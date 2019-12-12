import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-protected-header',
  templateUrl: './protected-header.component.html',
  styleUrls: ['./protected-header.component.scss']
})
export class ProtectedHeaderComponent implements OnInit {

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit(): void {

  }

  onLogOut(event): void {
    event.preventDefault();

    this._authService.logout();
    setTimeout(() => {
      this._router.navigate(['auth/login']);
    }, 500);
  }
}
