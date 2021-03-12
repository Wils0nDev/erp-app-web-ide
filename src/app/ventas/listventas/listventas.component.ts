import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Filtroventa } from 'src/app/interfaces/filtroventa';
import { Cliente } from 'src/app/models/cliente';
import { User } from 'src/app/models/user';
import { Venta } from 'src/app/models/venta';
import { VentaService } from 'src/app/services/venta.service';



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
  constructor(private _ventaService: VentaService) {
    
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
      fechaFin: new FormControl(''),

      
    });
  }

  Filtrar(){

    
    this.filtroVenta.idVenta = this.filterForm.value.transactVenta | 0
    this.filtroVenta.stadoPago = this.filterForm.value.stadoPago | 0
    this.filtroVenta.fechaInicio = this.filterForm.value.fechaInicio 
    this.filtroVenta.fechaFin = this.filterForm.value.fechaFin 

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
        
          this.dataSource = res.objeto
      
      });
  }
}
