import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService, AuthService, SubscriptionService, AlertService } from 'src/app/core/services';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})

export class AccountComponent implements OnInit {

  currentUser;
  activeSubscription;
  userInfo;
  passwordForm: FormGroup;

  loading = false;
  submitted = false;

  validationErrors = null;

  constructor(
    private formBuilder: FormBuilder,
    private _authService: AuthService,
    private _userService: UserService,
    private _spService: SubscriptionService,
    private _sNotify: SnotifyService,
    private _alertService: AlertService
  ) {
    this.currentUser = this._authService.getCurrentUser();
  }

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      oldPassword: [null, null],
      password: [null, null],
      password_confirmation: [null, null]
    });

    this.loadData();

    this.onChanges();
  }

  loadData(): void {
    this.loading = true;

    let expand = ['country'];
    // get user information
    this._userService.getById(this.currentUser.ID, expand).subscribe((userInfo) => {
      this.userInfo = userInfo;
      const activeSpId = userInfo.activeSubscriptionID;

      // get active subscription
      if (activeSpId) {
        expand = ['subscriptionPlan'];

        this._spService.getById(activeSpId, expand).subscribe((result) => {
          this.activeSubscription = result;

          this.loading = false;
        }, () => {
          this._sNotify.error('Error occured while get user information.', {timeout: 3000});
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    }, () => {
      this._sNotify.error('Error occured while get user information.', {timeout: 3000});
    });
  }

  onChanges(): void {
    const superObj = this;
    for (const fieldName in this.passwordForm.controls) {
      if (fieldName) {
        this.passwordForm.get(fieldName).valueChanges.subscribe(() => {
          if (superObj.validationErrors && (fieldName in superObj.validationErrors)) {
            superObj.validationErrors[fieldName] = null;
          }
        });
      }
    }

    this.passwordForm.valueChanges.subscribe(() => {
      this._alertService.clear();
    });
  }

  onChangePassword(event) {
    event.preventDefault();

    this.submitted = true;
    this.validationErrors = null;

    if (this.passwordForm.invalid) {
      return;
    }

    this.loading = true;

    const data = {
      oldPassword: this.passwordForm.get('oldPassword').value,
      newPassword: this.passwordForm.get('password').value,
    };

    this._userService.changePassword(data).subscribe(() => {
      this.loading = false;

      this.controls.oldPassword.setValue('');
      this.controls.password.setValue('');
      this.controls.password_confirmation.setValue('');

      this._sNotify.success('Password modified successfully.', {timeout: 3000});
    }, (error) => {
      if (error.status === 400) {
        this.validationErrors = error.error.validationErrors;
        this._alertService.error('Validation error!');
      } else {
        this._alertService.error('Error occured while change password!');
      }

      this.loading = false;
    });
  }

  get controls() { return this.passwordForm.controls; }

  isInvalid(field) {
    return ((this.submitted || this.passwordForm.get(field).touched) && this.passwordForm.get(field).errors);
  }

}
