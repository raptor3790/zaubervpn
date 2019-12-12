import { Component, OnInit } from '@angular/core';
import { AuthService, AlertService } from 'src/app/core/services';
import { SnotifyService } from 'ng-snotify';
import { SessionService } from 'src/app/core/services/session.service';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})

export class SessionComponent implements OnInit {

  currentUser;
  sessions = [];

  loading = false;

  constructor(
    private _authService: AuthService,
    private _sessionService: SessionService,
    private _sNotify: SnotifyService,
    private _alertService: AlertService
  ) {
    this.currentUser = this._authService.getCurrentUser();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this._sessionService.getList().subscribe((sessions) => {
      console.log(sessions);
      this.sessions = sessions;

      this.loading = false;
    }, () => {
      this._sNotify.error('Error occured while get sessions.', {timeout: 3000});

      this.loading = false;
    });
  }

  onDelete(sessionId) {
    const r = confirm('Are you sure delete this session?');

    if (r) {
      this.loading = true;

      this._sessionService.delete(sessionId).subscribe(() => {
        this.loading = false;

        this._sNotify.success('Session deleted successfully.', {timeout: 3000});
      }, (err) => {
        this.loading = false;

        console.log(err);
        this._sNotify.error('Error occured while delete session.', {timeout: 3000});
      });
    }
  }
}
