import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PatientsRoutingModule} from './patients-routing.module';
import {PatientsComponent} from './patients.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {NumberToBooleanModule} from '../../customPipes/numberToBoolean/number-to-boolean.module';


@NgModule({
  declarations: [
    PatientsComponent
  ],
  imports: [
    CommonModule,
    PatientsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NumberToBooleanModule
  ]
})
export class PatientsModule {
}
