import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, PublicGuard } from './core/guards';

const routes: Routes = [
  {
    path: 'account',
    loadChildren: './protected/protected.module#ProtectedModule',
    canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: './public/public.module#PublicModule',
    canActivate: [PublicGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
