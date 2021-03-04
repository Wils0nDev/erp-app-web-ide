import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { BehaviorSubject } from 'rxjs';
import { Detalleventa } from 'src/app/models/detalleventa';
import { Cliente } from 'src/app/models/cliente';
import { Venta } from 'src/app/models/venta';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Formatfecha } from 'src/app/utils/formatfecha';
import { DecimalFormat } from 'src/app/utils/decimal-pipe';
import { VentaService } from 'src/app/services/venta.service';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'ide-addventa',
  templateUrl: './addventa.component.html',
  styleUrls: ['./addventa.component.css']
})
export class AddventaComponent implements OnInit {

  //tabla
  public displayedColumns: string[] = ['position', 'descripcion', 'preciou', 'cantidad','unidades','importe','accion'];
  public displayedVatColumns = ['igv', 'emptyFooter1', 'emptyFooter2','emptyFooter3', 'emptyFooter4', 'emptyFooter5','amounts'];
  public displayedTotalColumns = ['total', 'emptyFooter6', 'emptyFooter7','emptyFooter8', 'emptyFooter9', 'emptyFooter10','amountt']


  public detalleventa! : Detalleventa;
  public producto! : Producto;
  public detallev! : Detalleventa[];
  public cliente! : Cliente;
  public dataSource! : any
  public subject! : BehaviorSubject<any>
  public venta! : Venta
  public addVenta! : FormGroup

  public subtotalfooter! : number
  public totalfooter! : number

  
  constructor(private _formatfecha:Formatfecha, private _formtDecimal : DecimalFormat, private _ventaService : VentaService) { 
    this.cliente = new Cliente("",null,"","","")
    this.producto = new Producto("","")
    this.detalleventa = new Detalleventa(null,1,null,this.producto);
    this.venta = new Venta("",null,null,0,null,null,this.cliente,this.detallev)

  }

  ngOnInit(): void {
    this.producto = new Producto("","");
    this.detallev  = []
    this.subject = new BehaviorSubject(this.detallev);
    this.dataSource = this.subject.asObservable();

    console.log(this.dataSource.source._value.length)
    this.venta.montoTotal = 0;
    this.venta.subTotal = 0;
    this.ventaValidate();


    
  }

  ventaValidate(){
    this.addVenta = new FormGroup({
    
      fechaCreacion: new FormControl("", [
        Validators.required,
        
      ]),

      tipoDocumento : new FormControl("",[
        Validators.required,
      ]),

      numeroDocumento : new FormControl("",[
        Validators.required,
      ]),

      nombres : new FormControl("",[
        Validators.required
      ]),
      apellidoPaterno : new FormControl("",[
        Validators.required
      ]),

      apellidoMaterno : new FormControl("",[
        Validators.required
      ]),

      sku: new FormControl("", [
        Validators.required,
        
      ]),
      descripcion: new FormControl("", [
        Validators.required,
        
      ]),
      precio: new FormControl(null, [
        Validators.required,
        
      ]),

      cantidad: new FormControl(this.detalleventa.cantidad, [
        Validators.required,
        
      ]),
    })
    
  }
  addDetalleProducto(){
      let subtotal : number
      let importe : number  | null
      let cantidadArt :number 

      
      //czlculo de subtotal
      this.addVenta.value.precio != null && this.addVenta.value.cantidad ? importe =  this.addVenta.value.precio * this.addVenta.value.cantidad : importe = 0
      
      importe = parseFloat(importe.toFixed(2))
     
      //producto
     this.producto = new Producto(this.addVenta.value.sku,this.addVenta.value.descripcion)
     
     //detalle del producto
     this.detalleventa = new Detalleventa(parseFloat(this._formtDecimal.transform(this.addVenta.value.precio)),
     parseInt(this.addVenta.value.cantidad),
     importe,this.producto);


     //agrego un detalle al array de detalles
     this.detallev.push(this.detalleventa)
     this.subject.next(this.detallev);

     if(this.venta.subTotal != null){

      this.venta.subTotal = parseFloat(this._formtDecimal.transform(this.venta.subTotal)) + importe
     
      this.subtotalfooter =  this.venta.subTotal
      }


     if(this.venta.montoTotal != null){

          this.venta.montoTotal = parseFloat(this._formtDecimal.transform(this.venta.montoTotal)) + importe
          this.totalfooter =  this.venta.montoTotal
     }
     
     this.venta.numeroArticulos =  this.venta.numeroArticulos  + parseInt(this.addVenta.value.cantidad) 
         
      
     //numero de articulos , la cantidad de items del array
     
     //limpiando  el formulatio de agregar productos
     this.limpiarDetalle()
    
  }

  onSubmit(){

    //Cliente
    this.cliente = new Cliente(
      this.addVenta.value.numeroDocumento,
      this.addVenta.value.tipoDocumento, 
      this.addVenta.value.nombres,
      this.addVenta.value.apellidoPaterno,
      this.addVenta.value.apellidoMaterno,
      )

    //Venta
    let fechaVenta = this._formatfecha.transform(this.addVenta.value.fechaCreacion)


    this.venta = new Venta(fechaVenta,1,1,this.venta.numeroArticulos,this.venta.montoTotal,this.venta.subTotal,this.cliente,this.detallev)

     // this.enviarVenta(this.venta);
     console.log(this.venta )
  }

  enviarVenta(venta : Venta){

    this._ventaService.enviarVenta(venta)
    .pipe(
      catchError((error) => {
        console.log(error);
        return EMPTY;
      })
    )
    .subscribe((response) => { 
      //this.modulos = response.objeto
      console.log(response)
    })
    

  }

  limpiarDetalle(){

    this.addVenta.get("sku")?.reset();
    this.addVenta.get("descripcion")?.reset();
    this.addVenta.get("precio")?.reset();
    this.addVenta.get("cantidad")?.reset("1");
    
  }
}
