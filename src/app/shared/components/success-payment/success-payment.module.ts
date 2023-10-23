import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuccessPaymentRoutingModule } from './success-payment-routing.module';
import { SuccessPaymentComponent } from './success-payment.component';


@NgModule({
  declarations: [
    SuccessPaymentComponent
  ],
  imports: [
    CommonModule,
    SuccessPaymentRoutingModule
  ]
})
export class SuccessPaymentModule { }
