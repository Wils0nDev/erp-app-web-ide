import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ModuloService {

  public datos! : any

  constructor(private httpClient: HttpClient,private userService : UserService) { }


  getModulos(perfil: number , userid : number): Observable<any> {
   
    
    
    let headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': JSON.parse(this.userService.getToken() || '')
    
    });


    return this.httpClient
    //http://172.16.11.123:4200/administracion/login/ValidarCredenciales
    //.post<User>('assets/api/user/login.json', params,{ headers: headers})
      .get<any>(`http://172.16.11.123:4040/module/AccesosModulos/${perfil}/${userid}`,
      { headers : headers})
      .pipe(catchError(this.mensajeError));
  }

  mensajeError(error: HttpErrorResponse) {
    //instanceof : para capturar errores de lado del cliente
    if (error.error instanceof ErrorEvent) {
      console.log('Ocurrio un error en el cliente', error.error.message);
    } else {
      //status : obtenemos el codigo (404,etc), error : obtenemos el mensaje de lado del servidor
      //console.log('Error Status :', error.status)
      return throwError(error.error);
    }

    //retornamos usando la estrategia de Catch y Rethrow : capturar y reelanzar
    return throwError(error.error);
  }

  getDatosUser(){
    let datosUser = localStorage.getItem('datosUser');
    if(datosUser != 'undefinded'){
      this.datos = datosUser
    }else{
      this.datos = null
    }
    return this.datos;
  }

 
}
