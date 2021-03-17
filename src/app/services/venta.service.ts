import { Injectable } from '@angular/core';
import { Observable, Observer, pipe, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { GLOBAL } from './global'
import { Venta } from '../models/venta';
import { UserService } from './user.service';
import { Filtroventa } from '../interfaces/filtroventa';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  public idenitity! : string | null;
  public token! : string | null;
  public sucursales! : string | null ;
  constructor(private httpClient: HttpClient, private userService : UserService) { }


  enviarVenta(venta : Venta):Observable<any>{
     //(gethash)  ?    userLogin.gethash = gethash : null;

     let json = JSON.stringify(venta);
     let params = json;
     let headers = new HttpHeaders(
       { 'Content-Type': 'application/json',
         'Authorization': JSON.parse(this.userService.getToken() || '')
      
      });
 
     return this.httpClient
 
       //http://172.16.11.123:4200/administracion/login/ValidarCredenciales
       .post<Venta>('http://172.16.11.123:4040/sale/RegistrarVenta', params,{ headers: headers})
 
       //.get<any>('assets/api/user/login.json')
       .pipe(catchError(this.mensajeError));
  }


  updateVenta(venta : Venta):Observable<any>{
    //(gethash)  ?    userLogin.gethash = gethash : null;

    let json = JSON.stringify(venta);
    let params = json;
    let headers = new HttpHeaders(
      { 'Content-Type': 'application/json',
        'Authorization': JSON.parse(this.userService.getToken() || '')
     
     });

    return this.httpClient

      //http://172.16.11.123:4200/administracion/login/ValidarCredenciales
      .post<Venta>('http://172.16.11.123:4040/sale/EditarVenta', params,{ headers: headers})

      //.get<any>('assets/api/user/login.json')
      .pipe(catchError(this.mensajeError));
 }

  getVentas(filtroVenta : any) : Observable<any>{

    var json = JSON.stringify(filtroVenta)
     
    
    let headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': JSON.parse(this.userService.getToken() || '')
    
    });
    
   

    return this.httpClient
      .post<any>(`http://172.16.11.123:4040/Sale/BuscarVentas`,json,
      { headers : headers }

      
      )
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


}
