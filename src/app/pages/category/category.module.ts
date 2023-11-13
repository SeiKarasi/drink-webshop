import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes/shared-pipes.module';


@NgModule({
  declarations: [
    CategoryComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    SharedPipesModule
  ]
})
export class CategoryModule { }
