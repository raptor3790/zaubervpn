import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnotifyService } from 'ng-snotify';

import { UserService, AlertService, SubscriptionPlanService, PaymentService } from 'src/app/core/services';
import { CountryService } from 'src/app/core/services/country.service';

declare let $;

@Component({
  selector: 'app-public-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})

export class PublicSbuscribeComponent implements OnInit {

  registerForm: FormGroup;

  userTypes = {
    INDIVIDUAL: 1,
    COMPANY: 2
  };   // individual or company
  paymentTypes = {
    STRIPE: 3,
    PAYPAL: 4
  };
   // stripe or paypal
  paymentError = false;

  loading = false;
  submitted = false;

  countries = [];   // registered countries
  planList = [];    // available plans for selected country

  monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];    // month list for display in stripe
  yearList = [];  // year list for display in stripe

  selectedPlanID = 1;   // selected subscription plan id
  curAmount = 0;
  curVat = 0;
  totalAmount = 0;
  selectedCurrency = 'USD';
  currencySign = '$';

  validationErrors = null;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _activatedRouter: ActivatedRoute,
    private _userService: UserService,
    private _countryService: CountryService,
    private _spService: SubscriptionPlanService,
    private _ngZone: NgZone,
    private _sNotify: SnotifyService,
    private _alertService: AlertService,
    private _paymentService: PaymentService,
  ) {
    // get selected subscription plan id
    this.selectedPlanID = parseInt(this._activatedRouter.snapshot.params.planID, 10);
  }

  // init forms and events
  ngOnInit() {
    const superObj = this;

    $('.form-select').niceSelect();
    this.registerForm = this._fb.group({
      type: [this.userTypes.INDIVIDUAL, Validators.required],
      roleID: [3, null],
      email: [null, [Validators.required, Validators.email]],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      password: [null, [Validators.required, Validators.minLength(6)]],
      countryID: [null, [Validators.required]],
      companyName: [null, Validators.required],
      companyAddress: [null, Validators.required],
      companyRegistrationNumber: [null, Validators.required],
      companyVATNumber: [null, Validators.required],
      contactFirstName: [null, Validators.required],
      contactLastName: [null, Validators.required],
      paymentType: [this.paymentTypes.STRIPE, null],
      stripeName: [null, Validators.required],
      stripeNumber: [null, Validators.required],
      stripeYear: [null, Validators.required],
      stripeMonth: [null, Validators.required],
      stripeCVC: [null, Validators.required],
      stripePostal: [null, null],
      checkTerms: [null, null]
    });

    // set stripe expire to current year and month
    const curDate = new Date();
    const curYear = curDate.getFullYear();
    for (let i = curYear; i < curYear + 20; i++) {
      this.yearList.push(i);
    }

    this.registerForm.get('stripeMonth').setValue(curDate.getMonth() + 1);
    this.registerForm.get('stripeYear').setValue(curYear);

    this.onChanges();
    this.loadData();

    // event for select user type - individual or company
    $('#select-type').on('change', function (e) {
      superObj._ngZone.run(() => {
        superObj.registerForm.get('type').setValue(e.target.value);
      });
    });

    // event for select country
    $('#select-country').on('change', function (e) {
      superObj._ngZone.run(() => {
        superObj.registerForm.get('countryID').setValue(e.target.value);

        superObj.loading = true;
        superObj._spService.readAvailable({ countryID: e.target.value }).subscribe((plans) => {
          superObj.planList = plans;

          if (plans && plans.length > 0) {
            superObj.selectedPlanID = plans[0].ID;
            superObj.changeAmounts();
          }
          superObj.loading = false;
        }, (err) => {
          superObj.loading = false;
          console.log(err);
        });
      });
    });
  }

  // load data from server
  loadData(): void {
    this.loading = true;

    // load country from server
    this._countryService.getAll().subscribe((countries) => {
      this.countries = countries;
      this.loading = false;
      setTimeout(() => {
        $('select').niceSelect('update');
      });
    }, () => {
      this.loading = false;
    });

    // load global available subscription plans from server
    this._spService.readAvailable().subscribe((plans) => {
      this.planList = plans;
      this.changeAmounts();
    }, () => {
    });
  }

  // event for enter any information in to form input
  onChanges(): void {
    const superObj = this;

    // initialize error messages when enter to each form input
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

  onSelectPlan(planId): void {
    if (!this.paymentError) {
      this.selectedPlanID = planId;
      this.changeAmounts();
    }
  }

  onSelectPayment(paymentType): void {
    if (!this.paymentError) {
      this.registerForm.get('paymentType').setValue(paymentType);
    }
  }

  // calculate prices when change country or plan
  changeAmounts(): void {
    const selectedPlan = this.planList.find(x => x.ID === this.selectedPlanID);
    this.selectedCurrency = selectedPlan.currency ? selectedPlan.currency.name : 'USD';
    this.currencySign = selectedPlan.currency ? selectedPlan.currency.sign : '$';
    this.curAmount = selectedPlan.price * selectedPlan.months;
    this.curVat = selectedPlan.VAT ? selectedPlan.VAT : 0;
    this.totalAmount = this.curAmount + (this.curAmount * this.curVat / 100);
    this.totalAmount = Math.round(this.totalAmount * 1e12) / 1e12;
  }

  // form submit
  onSubmit(event) {

    event.preventDefault();
    this.submitted = true;

    this.validationErrors = null;
    this._alertService.clear();

    // mandatory validation
    if (this.controls.email.invalid ||
      this.controls.password.invalid ||
      this.controls.countryID.invalid) {
      this._sNotify.error('Some informations are invalid. Please check again1.', { timeout: 3000 });
      return;
    }

    // validations according to User Type
    if (this.controls.type.value === this.userTypes.INDIVIDUAL) {
      if (this.controls.firstName.invalid ||
        this.controls.lastName.invalid) {
        this._sNotify.error('Some informations are invalid. Please check again2.', { timeout: 3000 });
        return;
      }
    } else {
      if (this.controls.companyName.invalid ||
        this.controls.companyAddress.invalid ||
        this.controls.companyRegistrationNumber.invalid ||
        this.controls.companyVATNumber.invalid ||
        this.controls.contactFirstName.invalid ||
        this.controls.contactLastName.invalid) {
        this._sNotify.error('Some informations are invalid. Please check again3.', { timeout: 3000 });
        return;
      }
    }

    // validations for stripe
    if (this.controls.paymentType.value === this.paymentTypes.STRIPE) {
      if (this.controls.stripeNumber.invalid ||
        this.controls.stripeName.invalid ||
        this.controls.stripeCVC.invalid) {
        return;
      }
    }

    // check accept terms and conditions
    if (!this.controls.checkTerms.value) {
      alert('Please check terms and conditions.');
      return;
    }

    this.loading = true;

    const data = this.registerForm.value;

    // register user and create subscription, first register user
    this._userService.register(data)
      .subscribe(
        (user) => {

          // if stripe payment proceed payment and create subscription
          if (this.controls.paymentType.value === this.paymentTypes.STRIPE) {

            data.userID = user.ID;
            data.amount = this.totalAmount;
            data.currency = this.selectedCurrency;
            data.planID = this.selectedPlanID;

            this._paymentService.stripe_payment_pub(data).subscribe((subscription) => {
              this.loading = false;

              this._sNotify.success('Subscription created successfully.', {timeout: 3000});
              this.toVerifyEmail();
            // payment error occured
            }, (paymentErr) => {
              console.log('public stripe payment error', paymentErr);
              this.loading = false;
              this.registerForm.disable();
              this.paymentError = true;

              if (paymentErr.status === 400 || paymentErr.error.error === 1090) {
                this._sNotify.error('Error occured while payment!', { timeout: 3000 });
                this._alertService.error(paymentErr.error.description);
              } else {
                this._sNotify.error('Error occured while create subscription!', { timeout: 3000 });
              }
            });

          } else { // if payment is paypal navigate to verify email
            this.loading = false;

            this.toVerifyEmail();
          }
        },

        // user register error
        userErr => {
          this.loading = false;

          if (userErr.status === 400) {
            this._sNotify.error('Validation error while register user!', { timeout: 3000 });
            this.validationErrors = userErr.error.validationErrors;
          } else {
            this._sNotify.error('Error occured while create register user!', { timeout: 3000 });
          }
        });
  }

  toVerifyEmail(): void {
    this._router.navigate(['/auth/verifyemail']);
  }

  get controls() { return this.registerForm.controls; }

  isInvalid(field) {
    return ((this.submitted || this.registerForm.get(field).touched) && this.registerForm.get(field).errors);
  }
}
