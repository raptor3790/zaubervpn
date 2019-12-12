import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';

import { UserService, AlertService } from 'src/app/core/services';
import { CountryService } from 'src/app/core/services/country.service';

declare let $;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  userTypes = {
    INDIVIDUAL: 1,
    COMPANY: 2
  };

  loading = false;
  submitted = false;

  countries = [];

  validationErrors = null;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _userService: UserService,
    private _countryService: CountryService,
    private _ngZone: NgZone,
    private _sNotify: SnotifyService,
    private _alertService: AlertService
  ) { }

  ngOnInit() {
    const superObj = this;
    $('select').niceSelect();
    this.registerForm = this._fb.group({
      type: [this.userTypes.INDIVIDUAL, Validators.required],
      roleID: [3, null],
      email: [null, [Validators.required, Validators.email]],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      password: [null, [Validators.required, Validators.minLength(6)]],
      password_confirmation: [null, null],
      countryID: [null, [Validators.required]],
      companyName: [null, Validators.required],
      companyAddress: [null, Validators.required],
      companyRegistrationNumber: [null, Validators.required],
      companyVATNumber: [null, Validators.required],
      contactFirstName: [null, Validators.required],
      contactLastName: [null, Validators.required],
    });

    this.onChanges();
    this.loadData();

    $('#select-type').on('change', function(e) {
      superObj._ngZone.run(() => {
        superObj.registerForm.get('type').setValue(e.target.value);
      });
    });

    $('#select-country').on('change', function(e) {
      superObj._ngZone.run(() => {
        superObj.registerForm.get('countryID').setValue(e.target.value);
      });
    });
  }

  loadData(): void {
    this.loading = true;

    this._countryService.getAll().subscribe((countries) => {
      this.countries = countries;
      this.loading = false;
      setTimeout(() => {
        $('select').niceSelect('update');
      });
    }, () => {
      this.loading = false;
    });
  }

  onChanges(): void {
    const superObj = this;
    for (const fieldName in this.registerForm.controls) {
      if (fieldName) {
        this.registerForm.get(fieldName).valueChanges.subscribe(() => {
          if (superObj.validationErrors && (fieldName in superObj.validationErrors)) {
            superObj.validationErrors[fieldName] = null;
          }
        });
      }
    }

    this.registerForm.valueChanges.subscribe(() => {
      this._alertService.clear();
    });
  }

  onSubmit(event) {
    event.preventDefault();
    this.submitted = true;

    this.validationErrors = null;
    this._alertService.clear();

    if (this.controls.email.invalid ||
      this.controls.password.invalid ||
      this.controls.password_confirmation.invalid ||
      this.controls.countryID.invalid) {
        return;
    }

    // stop here if form is invalid
    if (this.controls.type.value === this.userTypes.INDIVIDUAL) {
      if (this.controls.firstName.invalid ||
        this.controls.lastName.invalid) {
          return;
        }
    } else {
      if (this.controls.companyName.invalid ||
        this.controls.companyAddress.invalid ||
        this.controls.companyRegistrationNumber.invalid ||
        this.controls.companyVATNumber.invalid ||
        this.controls.contactFirstName.invalid ||
        this.controls.contactLastName.invalid) {
          return;
      }
    }

    this.loading = true;

    this._userService.register(this.registerForm.value)
      .subscribe(
        data => {
          this._sNotify.success('User registered successfully!', { timeout: 3000 });
          this._router.navigate(['/auth/verifyemail']);
        },
        error => {
          if (error.status === 400) {
            this._alertService.error('Validation error while register user!');
            this.validationErrors = error.error.validationErrors;
          } else {
            this._sNotify.error('Error occured while register user!', { timeout: 3000 });
          }
          this.loading = false;
        });
  }

  get controls() { return this.registerForm.controls; }

  isInvalid(field) {
    return ((this.submitted || this.registerForm.get(field).touched) && this.registerForm.get(field).errors);
  }
}
