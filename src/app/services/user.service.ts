import { Injectable } from '@angular/core';
import { Observable, Observer, pipe, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { GLOBAL } from './global'

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public idenitity! : string | null;
  public token! : string | null;
  public sucursales! : string | null ;
  public datos! : string ;
  constructor(private httpClient: HttpClient) {}

  signUp(userLogin: User): Observable<any> {
    //(gethash)  ?    userLogin.gethash = gethash : null;

    let json = JSON.stringify(userLogin);
    let params = json;
    let headers = new HttpHeaders({ 'Content-Type': 'application/json'});

    return this.httpClient

      //http://172.16.11.123:4200/administracion/login/ValidarCredenciales
      .post<User>('http://172.16.11.123:4040/user/ValidarCredenciales', params,{ headers: headers})

      //.get<any>('assets/api/user/login.json')
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

  getToken() : string | null{

    let token = localStorage.getItem('token');
    if(token != 'undefinded'){
      this.token = token
    }else{
      this.token = null
    }
    return this.token;
  }

  getSucursales(){
    let sucursales = localStorage.getItem('sucursales');
    
    if(sucursales != 'undefinded'){
      this.sucursales = sucursales
    }else{
      this.sucursales = null
    }
    return this.sucursales;
  }

  geDatos(){
    let datos = localStorage.getItem('datosUser');
    
    if(datos != 'undefinded' && datos != null){
      this.datos = datos
    }else{
      this.datos = ''
    }
    return this.datos;
  }

  logout(){
    localStorage.removeItem('token');
    this.idenitity = null;
    this.token = null;

  }
}
