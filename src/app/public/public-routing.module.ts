import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login';
import { RegisterComponent } from './auth/register';
import { VerifyEmailComponent } from './auth/verify-email';
import { ResendCodeComponent } from './auth/resend-code';
import { PublicAuthLayoutComponent } from './auth/layout/public-auth-layout/public-auth-layout.component';
import { ForgotPasswordComponent } from './auth/forgot-password';
import { ResetPasswordComponent } from './auth/reset-password';
import { PublicSbuscribeComponent } from './auth/subscribe';
import { ContactComponent } from './contact';

const routes: Routes = [
  {
    path: '', component: PublicLayoutComponent,
    children: [
      {
        path: '', component: HomeComponent
      },
    ]
  },
  {
    path: 'auth', component: PublicAuthLayoutComponent,
    children: [
      {
        path: 'contact', component: ContactComponent
      },
      {
        path: 'login', component: LoginComponent
      },
      {
        path: 'register', component: RegisterComponent,
      },
      {
        path: 'verifyemail', component: VerifyEmailComponent
      },
      {
        path: 'resendcode', component: ResendCodeComponent
      },
      {
        path: 'forgot', component: ForgotPasswordComponent
      },
      {
        path: 'resetpassword', component: ResetPasswordComponent
      },
      {
        path: 'subscribe/:planID', component: PublicSbuscribeComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
