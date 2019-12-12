import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

import { config } from 'src/config';
import { AuthService } from './authentication.service';

@Injectable()
export class PaymentService {
    private token;
    constructor(private http: HttpService,
        private _authService: AuthService) {
            this.token = this._authService.getToken();
    }

    getHistory() {
        return this.http.get(`${config.apiUrl}/users`, this.token);
    }

    getById(id: number) {
        return this.http.get(`${config.apiUrl}/user/` + id, this.token);
    }

    stripe_payment(params: any) {
        return this.http.post(`${config.apiUrl}/payment/stripe`, params, this.token);
    }

    stripe_payment_pub(params: any) {
        return this.http.post(`${config.apiUrl}/payment/stripe/public`, params, this.token);
    }
}
