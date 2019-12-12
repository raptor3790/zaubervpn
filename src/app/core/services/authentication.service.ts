import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { config } from 'src/config';
import { HttpService } from './http.service';
import { AlertService } from './alert.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    isLoggedIn = false;

    private curUserInfo = new BehaviorSubject<any>(this.getCurrentUser());
    currentUser = this.curUserInfo.asObservable();

    constructor(private http: HttpClient,
        private router: Router,
        private httpService: HttpService,
        private _alertService: AlertService
    ) {
        if (!!this.getToken()) {
            try {
                this.setCurrentUser(this.getCurrentUser());
            } catch (error) {
                this.logout();
                this.router.navigate(['/auth/login']);
            }
        }
    }

    login(params) {
        return this.http.post<any>(`${config.apiUrl}/session/create`, params)
            .pipe(map(data => {
                // login successful if there's a jwt token in the response
                if (data && data.sessionID) {
                    this.setLoggedin(data.sessionID, data.user);
                } else {
                    return false;
                }

                return data.user;
            }));
    }

    logout() {
        const token = this.getToken();
        this.http.get(`${config.apiUrl}/session/delete/${token}`).subscribe((result) => {
        }, (err) => {
        });

        // remove user from local storage to log user out
        setTimeout(() => {
            this.clear();
        });
    }

    setLoggedin(token, user) {
        this.setToken(token);
        this.setCurrentUser(user);
    }

    setToken(token) {
        localStorage.setItem('token', token);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    setCurrentUser(user: any) {
        localStorage.setItem('user', JSON.stringify(user));
        this.curUserInfo.next(user);
        this.isLoggedIn = true;
    }

    getCurrentUser(): any {
        const curUser = localStorage.getItem('user');
        return JSON.parse(curUser);
    }

    clear() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.isLoggedIn = false;
    }

    isAdmin() {
        return (this.getCurrentUser().roleid === 1);
    }

    isSupport() {
        return (this.getCurrentUser().roleid === 2);
    }

    sendPasswordResetLink(email): Observable<any> {
        return this.httpService.post(`${config.apiUrl}/passwordreset/sendPasswordResetLink`, email, this.getToken());
    }

    changePassword(data) {
        return this.httpService.post(`${config.apiUrl}/passwordreset/resetPassword`, data, this.getToken());
    }
}
