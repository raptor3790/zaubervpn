import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'src/config';
import { AuthService } from './authentication.service';

@Injectable()
export class SubscriptionService {
    private token;
    constructor(private http: HttpService,
        private _authService: AuthService) {
        this.token = this._authService.getToken();
    }

    create(params: any) {
        return this.http.post(`${config.apiUrl}/subscription/create`, params, this.token);
    }

    getList(expand?) {
        const expandArg = this.genExpandArgs(expand);

        return this.http.get(`${config.apiUrl}/subscription${expandArg}`, this.token);
    }

    getById(id, expands?) {
        const expandArg = this.genExpandArgs(expands);

        return this.http.get(`${config.apiUrl}/subscription/${id}${expandArg}`, this.token);
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
