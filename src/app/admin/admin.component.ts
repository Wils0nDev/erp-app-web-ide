import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Sucursal } from '../models/sucursal'
import {FormControl} from '@angular/forms';
import { Modulo } from '../models/modulos'
import { ModuloService } from '../services/modulo.service';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';


@Component({
  selector: 'ide-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public identity : string = ''
  public selected ! : string 
  panelOpenState = false;
  public sucursal! : Sucursal[];
  public modulos! : Modulo[];

  constructor(private userService : UserService, private moduloServicio : ModuloService , private router : Router ) {
    this.selected  = '1';

    this.modulos = [ ]
  }


  ngOnInit(): void {
    this.getSucursal();
    this.getModulos();
  }

  getSucursal(){
    this.sucursal = JSON.parse(this.userService.getSucursales() || '')
    }

  getModulos(){
    let datos : any = JSON.parse(this.moduloServicio.getDatosUser())

    this.moduloServicio.getModulos(datos.cod_perfil,datos.cod_usuario)
    .pipe(
      catchError((error) => {
        console.log(error);
        return EMPTY;
      })
    )
    .subscribe((response) => { 
      this.modulos = response.objeto
      console.log(this.modulos)
    })
    
  }
  

  cerrarSesion(){
    this.userService.logout()
    this.router.navigate(['/'])
  }

}
