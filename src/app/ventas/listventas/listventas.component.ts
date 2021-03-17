import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Filtroventa } from 'src/app/interfaces/filtroventa';
import { Cliente } from 'src/app/models/cliente';
import { User } from 'src/app/models/user';
import { Venta } from 'src/app/models/venta';
import { VentaService } from 'src/app/services/venta.service';
import { Formatfecha } from 'src/app/utils/formatfecha';



@Component({
  selector: 'ide-listventas',
  templateUrl: './listventas.component.html',
  styleUrls: ['./listventas.component.css'],
})
export class ListventasComponent implements OnInit {
  displayedColumns: string[] = [
    'transaccin_venta',
    'fecha_hora',
    'cliente',
    'vendedor',
    'importe_total',
    'estadov',
    'acciones',
  ];
  public dataSource! :  any ;
  public venta!: Venta;
  public cliente!: Cliente;
  public user!: User;
  public filtroVenta!: Filtroventa;
  public filterForm! : FormGroup
  
  constructor(private router : Router, private _ventaService: VentaService, private _formatfecha: Formatfecha,) {
    
    this.dataSource = []
    this.filtroVenta = {
      fechaInicio: "",
      fechaFin: "",
      datosCliente: "",
      stadoPago: 0,
      idVenta: 0,
    };
    
  }

  ngOnInit(): void {
   
      
      
    this.getVentas(this.filtroVenta);
    
    this.filter();
  }

  filter() {
    this.filterForm = new FormGroup({
      transactVenta: new FormControl(''),
      stadoPago: new FormControl(''),
      fechaInicio: new FormControl('') ,
      fechaFin: new FormControl(""),
      datosCliente : new FormControl("")
      
    });
  }

  Filtrar(){

    
    this.filtroVenta.idVenta = this.filterForm.value.transactVenta | 0
    this.filtroVenta.stadoPago = this.filterForm.value.stadoPago | 0
    

    if(this._formatfecha.transform(this.filterForm.value.datosCliente) != null ){
      this.filtroVenta.datosCliente = this.filterForm.value.datosCliente
    }else{
      this.filtroVenta.datosCliente = ""
    }

    if(this._formatfecha.transform(this.filterForm.value.fechaInicio) != null ){
      this.filtroVenta.fechaInicio = this._formatfecha.transform(this.filterForm.value.fechaInicio) 
    }else{
      this.filtroVenta.fechaInicio = ""
    }
    
    
    if(this._formatfecha.transform(this.filterForm.value.fechaFin) != null ){
      this.filtroVenta.fechaFin = this._formatfecha.transform(this.filterForm.value.fechaFin) 

    }else{
      this.filtroVenta.fechaFin = ""
    }

    console.log(this.filtroVenta)
    this.getVentas(this.filtroVenta);
  }

  getVentas(filtroVenta : any) {
    this._ventaService
      .getVentas(filtroVenta)
      .pipe(
        catchError((error) => {
          console.log(error);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        
        console.log(res.objeto)
          this.dataSource = res.objeto
      
      });
  }

  onVerVenta(venta : any){
    
    let objetventa = JSON.stringify(venta)
    this.router.navigate([`admin/sales/detailventa/${venta.codigoVenta}`]);

    localStorage.setItem('venta',objetventa)
    localStorage.setItem('action','view')
    

  }

  onEditVenta(venta : any){
    
    let objetventa = JSON.stringify(venta)
    this.router.navigate([`admin/sales/editventa/${venta.codigoVenta}`]);

    localStorage.setItem('venta',objetventa)
    localStorage.setItem('action','edit')
    

  }
}
