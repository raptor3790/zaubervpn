import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { UserService, AlertService, AuthService } from 'src/app/core/services';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})

export class VerifyEmailComponent implements OnInit {

  form: FormGroup;

  loading = false;
  submitted = false;

  validationErrors = null;

  constructor(
    private formBuilder: FormBuilder,
    private _router: Router,
    private _userService: UserService,
    private _sNotify: SnotifyService,
    private _alertService: AlertService,
    private _authService: AuthService
  ) {  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', null],
      verificationCode: ['', null]
    });

    this.onChanges();
  }

  onChanges(): void {
    const superObj = this;
    for (const fieldName in this.form.controls) {
      if (fieldName) {
        this.form.get(fieldName).valueChanges.subscribe(() => {
          if (superObj.validationErrors && (fieldName in superObj.validationErrors)) {
            superObj.validationErrors[fieldName] = null;
          }
        });
      }
    }

    this.form.valueChanges.subscribe(() => {
      this._alertService.clear();
    });
  }

  onSubmit() {
    this.submitted = true;

    this._alertService.clear();

    this.validationErrors = null;

    this.loading = true;

    const data = this.form.value;
    data.deviceID = this.uuidv4();
    data.deviceName = (window.navigator.userAgent).substring(0, 59);

    this._userService.verify(data).subscribe(
      (result) => {
        this._sNotify.success('Your email verified successfully.', { timeout: 3000 });
        this.loading = false;

        if (result && result.status === 'login_success' && result.sessionID) {
          this._authService.setLoggedin(result.sessionID, result.user);
          this._router.navigate(['/account']);
        } else {
          this._router.navigate(['/auth/login']);
        }
      },
      error => {
        if (error.status === 400) {
          this.validationErrors = error.error.validationErrors;
          this._alertService.error('Validation error.');
        } else if (error.status === 404) {
          this._alertService.error(error.error.description);
        } else {
          this._sNotify.error('Error occured while verify email.', { timeout: 3000 });
        }
        this.loading = false;
      }
    );
  }

  onResend(event): void {
    event.preventDefault();

    this.validationErrors = null;

    this.loading = true;
    this._userService.requestVerify(this.form.value).subscribe(
      () => {
        this._sNotify.success('Sent successfully verify code.', { timeout: 3000 });
        this.loading = false;
      },
      error => {
        console.log(error);
        if (error.status === 400) {
          this.validationErrors = error.error.validationErrors;
        } else if (error.status === 404) {
          this._alertService.error(error.error.description);
        } else {
          this._sNotify.error('Error occured while verify email.', { timeout: 3000 });
        }
        this.loading = false;
      }
    );
    // this._router.navigate(['/auth/resendcode']);
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        // tslint:disable-next-line:no-bitwise
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r && 0x3 | 0x8);
        return v.toString(16);
    });
  }
}
