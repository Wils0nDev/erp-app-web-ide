import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { VentasComponent } from './ventas.component';
import { AddventaComponent } from './addventa/addventa.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NginitDirective } from '../utils/nginit.directive';
import { ListventasComponent } from './listventas/listventas.component';

@NgModule({
  declarations: [VentasComponent, AddventaComponent,NginitDirective, ListventasComponent  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class VentasModule { }
