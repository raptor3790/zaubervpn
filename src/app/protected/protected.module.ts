import { NgModule } from '@angular/core';

import { ProtectedRoutingModule } from './protected-routing.module';
import { SharedAppModule } from '../shared/shared.module';

import { SubscriptionPlanService, SubscriptionService, PaymentService, SessionService, ContactService } from '../core/services';

import { ProtectedLayoutComponent } from './layout/protected-layout/protected-layout.component';
import { ProtectedHeaderComponent } from './layout/protected-header/protected-header.component';
import { ProtectedFooterComponent } from './layout/protected-footer/protected-footer.component';
import { SubscriptionComponent } from './subscription';
import { AccountComponent } from './account';
import { TransactionComponent } from './transaction';
import { SessionComponent } from './session';
import { ContactComponent } from './contact';

@NgModule({
  declarations: [
    ProtectedLayoutComponent,
    ProtectedHeaderComponent,
    ProtectedFooterComponent,

    SubscriptionComponent,
    AccountComponent,
    TransactionComponent,
    SessionComponent,
    ContactComponent
  ],
  imports: [
    ProtectedRoutingModule,
    SharedAppModule
  ],
  providers: [
    SubscriptionPlanService,
    SubscriptionService,
    PaymentService,
    SessionService,
    ContactService
  ],
})
export class ProtectedModule { }
