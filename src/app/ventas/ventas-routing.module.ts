import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddventaComponent } from './addventa/addventa.component';
import { DetailventaComponent } from './detailventa/detailventa.component';
import { EditventaComponent } from './editventa/editventa.component';
import { ListventasComponent } from './listventas/listventas.component';
import { VentasComponent } from './ventas.component';

const routes: Routes = [

  {
    path : '',
    component: VentasComponent,
    children:[
      {
        path: 'addventa',
        component: AddventaComponent
      },
      {
        path: 'listventa',
        component : ListventasComponent
      },

      {
        path: 'detailventa/:id',
        component : DetailventaComponent
      },
      {
        path: 'editventa/:id',
        component : EditventaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
