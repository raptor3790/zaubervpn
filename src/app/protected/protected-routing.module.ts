import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProtectedLayoutComponent } from './layout/protected-layout/protected-layout.component';
import { SubscriptionComponent } from './subscription';
import { AccountComponent } from './account/account.component';
import { TransactionComponent } from './transaction';
import { SessionComponent } from './session';
import { ContactComponent } from './contact';

const routes: Routes = [
  {
    path: '', component: ProtectedLayoutComponent,
    children: [
      {
        path: 'subscription', component: SubscriptionComponent
      },
      {
        path: 'transactions', component: TransactionComponent
      },
      {
        path: 'sessions', component: SessionComponent
      },
      {
        path: 'contact', component: ContactComponent
      },
      {
        path: '', component: AccountComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
