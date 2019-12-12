import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'src/config';
import { AuthService } from './authentication.service';

@Injectable()
export class UserService {
    private token;
    constructor(private http: HttpService,
        private _authService: AuthService) {
            this.token = this._authService.getToken();
    }

    getAll() {
        return this.http.get(`${config.apiUrl}/users`, this.token);
    }

    getById(id: number, expands?) {
        return this.http.get(`${config.apiUrl}/user/${id}`, this.token);
    }

    register(user: any) {
        return this.http.post(`${config.apiUrl}/user/register`, user, this.token);
    }

    update(user: any) {
        return this.http.put(`${config.apiUrl}/users/${user.id}`, user, this.token);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id, this.token);
    }

    verify(params) {
        return this.http.post(`${config.apiUrl}/user/verifyEmail`, params, this.token);
    }

    requestVerify(params) {
        return this.http.post(`${config.apiUrl}/user/requestEmailVerification`, params, this.token);
    }

    changePassword(params) {
        return this.http.post(`${config.apiUrl}/user/changePassword`, params, this.token);
    }

    requestPassword(params) {
        return this.http.post(`${config.apiUrl}/user/requestPasswordReset`, params, this.token);
    }

    resetPassword(params) {
        return this.http.post(`${config.apiUrl}/user/resetPassword`, params, this.token);
    }

    genExpandArgs(expands): string {
        let expandArg = '';
        if (expands) {
            expandArg = '?expand=';
            for (let i = 0; i < expands.length; i++) {
                if (i !== 0) {
                    expandArg += ',';
                }
                expandArg += expands[i];
            }
        }

        return expandArg;
    }
}
