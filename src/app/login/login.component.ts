import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { ModuloService } from '../services/modulo.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'ide-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public user!: User;
  public loginForm!: FormGroup;
  hide = true;
  public textLogin!: string;
  public sesion!: boolean;
  public message! : string
  constructor(private userService: UserService, private moduloServicio : ModuloService,  private router: Router) {
    this.user = new User(0, '','',0, 0,'','', '','','', '');
    this.sesion = false;
  }

  ngOnInit(): void {
    this.textLogin = 'Ingresar';
    this.formValidate();
  }

  formValidate() {
    this.loginForm = new FormGroup({
      email: new FormControl(this.user.cuenta, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl(this.user.clave, [Validators.required]),
    });
  }

  onSubmit() {
    this.user.cuenta = this.loginForm.value.email;
    this.user.clave = this.loginForm.value.password;

    this.textLogin = '...Inciando sesion';
    this.sesion = true;

    this.userService
      .signUp(this.user)
      .pipe(
        catchError((error) => {
          this.message = error.mensaje
          this.textLogin = 'Ingresar';
          this.sesion = false;
          return EMPTY;
        })
      )
      .subscribe((response) => {

        
        

        let token: string = JSON.stringify(response.objeto.id_token);
        let sucursales: string = JSON.stringify(response.objeto.sucursales);
        let datosUser: string = JSON.stringify({
          "cod_empresa": response.objeto.cod_empresa,
          "nombre_empresa": response.objeto.nombre_empresa,
          "url_logo": response.objeto.url_logo,
          "cod_usuario": response.objeto.cod_usuario,
          "cod_perfil": response.objeto.cod_perfil,
          "nombres": response.objeto.nombres,
          "apellido_paterno": response.objeto.apellido_paterno,
          "apellido_materno": response.objeto.apellido_materno,
          "documento": response.objeto.documento,
          "cuenta": response.objeto.cuenta,
        });
        localStorage.setItem('token', token);
        localStorage.setItem('sucursales', sucursales);
        localStorage.setItem('datosUser', datosUser)

        this.router.navigate(['/admin']);
      });
  }


  
}
