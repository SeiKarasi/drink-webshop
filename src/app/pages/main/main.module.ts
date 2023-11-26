import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductListComponent } from '../../shared/components/product-list/product-list.component';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes/shared-pipes.module';


@NgModule({
  declarations: [
    MainComponent,
    ProductListComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatButtonModule,
    MatIconModule,
    SharedPipesModule
  ]
})
export class MainModule { }
