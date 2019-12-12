import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'src/config';
import { AuthService } from './authentication.service';

@Injectable()
export class SessionService {
    private token;
    constructor(private http: HttpService,
        private _authService: AuthService) {
            this.token = this._authService.getToken();
    }

    getList() {
        return this.http.get(`${config.apiUrl}/session`, this.token);
    }

    delete(sessionId) {
        return this.http.get(`${config.apiUrl}/session/delete/${sessionId}`, this.token);
    }
}
