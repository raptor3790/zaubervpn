import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'src/config';
import { AuthService } from './authentication.service';

@Injectable()
export class CountryService {
    private token;
    constructor(private http: HttpService,
        private _authService: AuthService) {
            this.token = this._authService.getToken();
    }

    getAll() {
        return this.http.get(`${config.apiUrl}/country`, this.token);
    }

    getById(id: number) {
        return this.http.get(`${config.apiUrl}/users/` + id, this.token);
    }

    register(user: any) {
        return this.http.post(`${config.apiUrl}/users/register`, user, this.token);
    }

    update(user: any) {
        return this.http.put(`${config.apiUrl}/users/${user.id}`, user, this.token);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id, this.token);
    }
}
