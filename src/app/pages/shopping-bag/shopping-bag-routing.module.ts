import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingBagComponent } from './shopping-bag.component';

const routes: Routes = [{ path: '', component: ShoppingBagComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingBagRoutingModule { }
