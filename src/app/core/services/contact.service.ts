import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'src/config';
import { AuthService } from './authentication.service';

@Injectable()
export class ContactService {
    private token;
    constructor(private http: HttpService,
        private _authService: AuthService) {
            this.token = this._authService.getToken();
    }

    sendContact(params) {
        return this.http.post(`${config.apiUrl}/contact`, params, this.token);
    }
}
