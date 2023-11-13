import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card'
import {MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { MatIconModule } from '@angular/material/icon';
import { SharedPipesModule } from '../../../shared/pipes/shared-pipes/shared-pipes.module';

@NgModule({
  declarations: [
    ProductComponent,
    DateFormatPipe
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    FlexLayoutModule,
    SharedPipesModule
  ]
})
export class ProductModule { }
