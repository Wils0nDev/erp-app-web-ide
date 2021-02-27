import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component : AdminComponent,
    children:[
      
      {
        path: 'sales',
        loadChildren: () => import('../ventas/ventas.module').then(m => m.VentasModule)
      }  
    ]
   
  },
      
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
