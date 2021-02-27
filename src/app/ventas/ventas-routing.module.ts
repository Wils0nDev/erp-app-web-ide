import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddventaComponent } from './addventa/addventa.component';
import { VentasComponent } from './ventas.component';

const routes: Routes = [

  {
    path : '',
    component: VentasComponent,
    children:[
      {
        path: 'addventa',
        component: AddventaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
