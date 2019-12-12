import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'src/config';
import { AuthService } from './authentication.service';

@Injectable()
export class SubscriptionPlanService {
    private token;
    constructor(private http: HttpService,
        private _authService: AuthService) {
            this.token = this._authService.getToken();
    }

    readAvailable(params?) {
        let url = `${config.apiUrl}/subscriptionPlan/readAvailable`;

        if (params) {
            url += '?';

            let countryID = null;
            if ('countryID' in params) {
                countryID = params.countryID;
                url += `countryID=${countryID}`;
            }

            if ('active' in params) {
                if (countryID) {
                    url += '&';
                }
                url += `active=${params.active}`;
            }
        }

        return this.http.get(url, this.token);
    }
}
