import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingBagRoutingModule } from './shopping-bag-routing.module';
import { ShoppingBagComponent } from './shopping-bag.component';


@NgModule({
  declarations: [
    ShoppingBagComponent
  ],
  imports: [
    CommonModule,
    ShoppingBagRoutingModule
  ]
})
export class ShoppingBagModule { }
