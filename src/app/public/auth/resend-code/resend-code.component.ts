import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { UserService, AlertService } from 'src/app/core/services';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-resend-code',
  templateUrl: './resend-code.component.html',
  styleUrls: ['./resend-code.component.scss']
})

export class ResendCodeComponent implements OnInit {

  form: FormGroup;

  loading = false;
  submitted = false;

  validationErrors = null;

  constructor(
    private formBuilder: FormBuilder,
    private _router: Router,
    private _userService: UserService,
    private _sNotify: SnotifyService,
    private _alertServie: AlertService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', null]
    });

    this.form.get('username').setValue('');

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
      this._alertServie.clear();
    });
  }

  onSubmit() {
    this.submitted = true;

    this.validationErrors = null;

    this.loading = true;
    this._userService.requestVerify(this.form.value).subscribe(
      () => {
        this._sNotify.success('Sent successfully verify code.', { timeout: 3000 });
        this._router.navigate(['/auth/verifyemail']);
        this.loading = false;
      },
      error => {
        if (error.status === 400) {
          this.validationErrors = error.error.validationErrors;
        } else if (error.status === 404) {
          this._alertServie.error(error.error.description);
        } else {
          this._sNotify.error('Error occured while verify email.', { timeout: 3000 });
        }
        this.loading = false;
      }
    );
  }
}
