import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { HttpService } from 'src/app/core/services/http.service';
import { AlertService, AuthService } from '../core/services';

import { AlertComponent } from './directives';
import { LoadingComponent } from './components/loading/loading.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  declarations: [
    AlertComponent,
    LoadingComponent
  ],
  exports: [
    // Shared Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // Shared Components
    AlertComponent,
    LoadingComponent
  ],
  providers: [
    AlertService,
    HttpService
  ]
})
export class SharedAppModule { }
