import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CancelPaymentRoutingModule } from './cancel-payment-routing.module';
import { CancelPaymentComponent } from './cancel-payment.component';


@NgModule({
  declarations: [
    CancelPaymentComponent
  ],
  imports: [
    CommonModule,
    CancelPaymentRoutingModule
  ]
})
export class CancelPaymentModule { }
