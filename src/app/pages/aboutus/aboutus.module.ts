import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutusRoutingModule } from './aboutus-routing.module';
import { AboutusComponent } from './aboutus.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    AboutusComponent
  ],
  imports: [
    CommonModule,
    AboutusRoutingModule,
    FlexLayoutModule,
    MatIconModule
  ]
})
export class AboutusModule { }
