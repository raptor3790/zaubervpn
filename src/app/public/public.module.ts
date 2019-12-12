import { NgModule } from '@angular/core';

import { PublicRoutingModule } from './public-routing.module';
import { SharedAppModule } from '../shared/shared.module';

import { PublicGuard } from 'src/app/core/guards';

import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { PublicHeaderComponent } from './layout/public-header/public-header.component';
import { PublicFooterComponent } from './layout/public-footer/public-footer.component';
import { HomeComponent } from './home/home.component';

import { LoginComponent } from './auth/login';
import { RegisterComponent } from './auth/register';
import { UserService, CountryService, SubscriptionPlanService, PaymentService,
          SubscriptionService, ContactService } from 'src/app/core/services';
import { VerifyEmailComponent } from './auth/verify-email';
import { ResendCodeComponent } from './auth/resend-code';
import { PublicAuthLayoutComponent } from './auth/layout/public-auth-layout/public-auth-layout.component';
import { PublicAuthHeaderComponent } from './auth/layout/public-auth-header/public-auth-header.component';
import { ForgotPasswordComponent } from './auth/forgot-password';
import { ResetPasswordComponent } from './auth/reset-password';
import { PublicSbuscribeComponent } from './auth/subscribe';
import { ContactComponent } from './contact';

@NgModule({
  declarations: [
    PublicLayoutComponent,
    PublicHeaderComponent,
    PublicFooterComponent,
    HomeComponent,

    PublicAuthLayoutComponent,
    PublicAuthHeaderComponent,

    LoginComponent,
    RegisterComponent,
    VerifyEmailComponent,
    ResendCodeComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    PublicSbuscribeComponent,
    ContactComponent
  ],
  imports: [
    PublicRoutingModule,
    SharedAppModule
  ],
  providers: [
    PublicGuard,
    UserService,
    CountryService,
    SubscriptionPlanService,
    SubscriptionService,
    PaymentService,
    ContactService
  ],
})
export class PublicModule { }
