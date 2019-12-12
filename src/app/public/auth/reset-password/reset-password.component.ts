import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { UserService, AlertService } from 'src/app/core/services';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {

  form: FormGroup;

  loading = false;
  submitted = false;

  validationErrors = null;

  constructor(
    private formBuilder: FormBuilder,
    private _router: Router,
    private _userService: UserService,
    private _sNotify: SnotifyService,
    private _alertService: AlertService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', null],
      verificationCode: ['', null],
      password: ['', null],
      password_confirmation: ['', null]
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

    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    const data = {
      username: this.form.get('username').value,
      verificationCode: this.form.get('verificationCode').value,
      newPassword: this.form.get('password').value,
    };

    this._userService.resetPassword(data).subscribe(
      () => {
        this._sNotify.success('Your password modified successfully.', { timeout: 3000 });
        this.loading = false;
        this._router.navigate(['/auth/login']);
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

  onResendCode(event) {
    event.preventDefault();

    this.submitted = true;

    this.validationErrors = null;

    this.loading = true;
    this._userService.requestPassword(this.form.value).subscribe(
      () => {
        this._sNotify.success('Sent successfully request password reset.', { timeout: 3000 });

        this.loading = false;
      },
      error => {
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
    // this._router.navigate(['/auth/forgot']);
  }

  get controls() { return this.form.controls; }

  isInvalid(field) {
    return ((this.submitted || this.form.get(field).touched) && this.form.get(field).errors);
  }
}
