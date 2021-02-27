import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { VentasComponent } from './ventas.component';
import { AddventaComponent } from './addventa/addventa.component';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [VentasComponent, AddventaComponent],
  imports: [
    CommonModule,
    VentasRoutingModule,
    MaterialModule
  ]
})
export class VentasModule { }
