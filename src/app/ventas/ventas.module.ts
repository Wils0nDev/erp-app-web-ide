import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { VentasComponent } from './ventas.component';
import { AddventaComponent } from './addventa/addventa.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NginitDirective } from '../utils/nginit.directive';
import { ListventasComponent } from './listventas/listventas.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ViewActionComponent } from './view-action/view-action.component';
import { DetailventaComponent } from './detailventa/detailventa.component';
import { ActionTableComponent } from './action-table/action-table.component';
import { EditventaComponent } from './editventa/editventa.component';

@NgModule({
  declarations: [VentasComponent, AddventaComponent,NginitDirective, ListventasComponent, ViewActionComponent, DetailventaComponent, ActionTableComponent, EditventaComponent  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers : [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ]
})
export class VentasModule { }
