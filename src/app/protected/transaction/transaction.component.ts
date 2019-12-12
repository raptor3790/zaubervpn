import { Component, OnInit } from '@angular/core';
import { AuthService, SubscriptionService } from 'src/app/core/services';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})

export class TransactionComponent implements OnInit {

  currentUser;
  subscriptions = [];

  loading = false;

  constructor(
    private _authService: AuthService,
    private _sbService: SubscriptionService,
    private _sNotify: SnotifyService
  ) {
    this.currentUser = this._authService.getCurrentUser();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    const expand = ['subscriptionPlan', 'paymentMethod', 'paymentStatus'];

    this._sbService.getList(expand).subscribe((subscriptions) => {
      this.subscriptions = subscriptions;

      this.loading = false;
    }, () => {
      this._sNotify.error('Error occured while get subscriptions.', {timeout: 3000});

      this.loading = false;
    });
  }


}
