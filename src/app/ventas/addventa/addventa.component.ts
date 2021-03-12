import { Component, Input, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { BehaviorSubject, Observable } from 'rxjs';
import { Detalleventa } from 'src/app/models/detalleventa';
import { Cliente } from 'src/app/models/cliente';
import { Venta } from 'src/app/models/venta';
import {
  FormGroup,
  Validators,
  FormControl,
  FormGroupDirective,
} from '@angular/forms';
import { Formatfecha } from 'src/app/utils/formatfecha';
import { DecimalFormat } from 'src/app/utils/decimal-pipe';
import { VentaService } from 'src/app/services/venta.service';
import { catchError, map } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Directive } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'ide-addventa',
  templateUrl: './addventa.component.html',
  styleUrls: ['./addventa.component.css'],
})
export class AddventaComponent implements OnInit {
  //tabla
  public displayedColumns: string[] = [
    'item',
    'sku',
    'descripcion',
    'preciou',
    'cantidad',
    'unidades',
    'importe',
    'accion',
  ];
  public displayedVatColumns = [
    'igv',
    'emptyFooter1',
    'emptyFooter2',
    'emptyFooter3',
    'emptyFooter4',
    'emptyFooter5',
    'emptyFooteritem1',
    'amounts',
  ];
  public displayedTotalColumns = [
    'total',
    'emptyFooter6',
    'emptyFooter7',
    'emptyFooter8',
    'emptyFooter9',
    'emptyFooter10',
    'emptyFooteritem2',
    'amountt',
  ];

  public detalleventa!: Detalleventa;
  public producto!: Producto;
  public detallev!: Detalleventa[];
  public cliente!: Cliente;
  public dataSource!: any;
  public subject!: BehaviorSubject<any>;
  public venta!: Venta;
  public addVenta!: FormGroup;

  public subtotalfooter!: number | null;
  public totalfooter!: number | null;

  public igv!: number;
  public datosUser! : any
  public user! : User

  public item! : number

  constructor(
    private _formatfecha: Formatfecha,
    private _formtDecimal: DecimalFormat,
    private _ventaService: VentaService,
    private _clienteService: ClienteService,
    private _productoService: ProductoService,
    private _userService : UserService
  ) {
    this.cliente = new Cliente('', null, '', '', '');
    this.producto = new Producto('', '', 'unidades');
    this.user = new User(0,'','',0,0,'','','','','','')

    this.detalleventa = new Detalleventa(0,
      null,
      1,
      null,
      this.producto,
      'unidades'
    );
    this.venta = new Venta(
      '',
      null,
      null,
      0,
      0,
      0,
      this.cliente,
      this.detallev,
      0
    );
    this.subtotalfooter = 0;
    this.totalfooter = 0;
    this.igv = 0;
    this.item = 0;
  }

  ngOnInit(): void {
    this.producto = new Producto('', '', 'unidades');
    this.detallev = [];
    this.subject = new BehaviorSubject(this.detallev);
    this.dataSource = this.subject.asObservable();
    this.venta.montoTotal = 0;
    this.venta.subTotal = 0;
    this.datosUser = JSON.parse(this._userService.geDatos())
    console.log(this.datosUser)
    this.ventaValidate();
  }

  ventaValidate() {
    this.addVenta = new FormGroup({
      fechaCreacion: new FormControl(this.venta.fechaCreacion, [
        Validators.required,
      ]),

      tipoDocumento: new FormControl(this.cliente.tipoDocumento, [
        Validators.required,
      ]),

      numeroDocumento: new FormControl(this.cliente.numeroDocumento, [
        Validators.required,
        Validators.pattern('^[0-9]+'),
        Validators.minLength(8),
        Validators.maxLength(10),
      ]),

      nombres: new FormControl(this.cliente.nombres, [Validators.required]),
      apellidoPaterno: new FormControl(this.cliente.apellidoPaterno, [
        Validators.required,
      ]),

      apellidoMaterno: new FormControl(this.cliente.apellidoMaterno, [
        Validators.required,
      ]),

      sku: new FormControl(this.producto.sku, [Validators.required]),
      descripcion: new FormControl(this.producto.descripcion, [
        Validators.required,
      ]),
      precio: new FormControl(this.detalleventa.precio, [
        Validators.required,
        Validators.pattern('^[0-9]+([.][0-9]+)?$'),
      ]),

      cantidad: new FormControl(this.detalleventa.cantidad, [
        Validators.required,
        Validators.min(1),
      ]),

      unidadesMedida: new FormControl('', [Validators.required]),
      vendedorName : new FormControl({value: this.datosUser.nombres,disabled: true}),
    });
  }
  addDetalleProducto() {
    
    let subtotal: number;
    let importe: number | null;
    let cantidadArt: number;
    let uMedida: string;

    this.igv = 0;
    this.item++
    

    uMedida = this.addVenta.value.unidadesMedida;
    this.subtotalfooter = 0;
    this.totalfooter = 0;
    this.venta.montoTotal = 0;

    //czlculo de subtotal
    this.addVenta.value.precio != null && this.addVenta.value.cantidad
      ? (importe = this.addVenta.value.precio * this.addVenta.value.cantidad)
      : (importe = 0);

    importe = parseFloat(importe.toFixed(2));

    //producto
    this.producto = new Producto(
      this.addVenta.value.sku,
      this.addVenta.value.descripcion,
      this.addVenta.value.unidadesMedida
    );

    
    //detalle del producto
    this.detalleventa = new Detalleventa(this.item,
      parseFloat(this._formtDecimal.transform(this.addVenta.value.precio)),
      parseInt(this.addVenta.value.cantidad),
      importe,
      this.producto,
      uMedida
    );

    //agrego un detalle al array de detalles
    this.detallev.push(this.detalleventa);
    this.subject.next(this.detallev);

    if (this.venta.subTotal != null) {
      this.venta.subTotal =
        parseFloat(this.venta.subTotal.toFixed(2)) + importe;

      this.subtotalfooter = this.venta.subTotal;
    }


    this.igv = parseFloat((this.igv + this.venta.subTotal * 0.18).toFixed(2));

    if (this.venta.montoTotal != null) {
      
      this.venta.montoTotal = parseFloat((this.venta.subTotal + this.igv).toFixed(2));
      this.totalfooter = this.venta.montoTotal;
    }

   
    this.venta.numeroArticulos =
      this.venta.numeroArticulos + parseInt(this.addVenta.value.cantidad);

    //numero de articulos , la cantidad de items del array

    //limpiando  el formulatio de agregar productos
    this.limpiarDetalleForm();
  }

  editDetalle(i: number) {
    let cant = this.detallev[i].cantidad || 0;
    let prec = this.detallev[i].precio || 0;
    let importe = 0;
    let subtotal = 0;
    let tototal = 0;
    let cants = String(cant);
    let numart = 0;

    this.subtotalfooter = 0;
    this.totalfooter = 0;
    this.venta.subTotal = 0;
    this.venta.montoTotal = 0;
    this.detallev[i].cantidad = parseInt(cants);
    this.detallev[i].importe = cant * prec;

    importe = this.detallev[i].importe || 0;

    this.detallev.forEach((element) => {
      if (element.importe) {
        subtotal = subtotal + element.importe;
      }
      if (element.cantidad) {
        numart = numart + element.cantidad;
      }
    });

    this.igv = 0;
    this.venta.subTotal = parseFloat(subtotal.toFixed(2));
    this.subtotalfooter = this.venta.subTotal;

    this.igv = this.igv + this.venta.subTotal * 0.18;

    this.igv = parseFloat(this.igv.toFixed(2));
    this.venta.montoTotal = parseFloat(
      (this.venta.subTotal + this.igv).toFixed(2)
    );
    this.totalfooter = this.venta.montoTotal;

    this.venta.numeroArticulos = numart;
  }

  deleteDetalle(i: number) {
    let cant = this.detallev[i].cantidad || 0;
    let prec = this.detallev[i].precio || 0;
    let importe = 0;
    let subtotal = 0;
    let tototal = 0;
    let cants = String(cant);
    let numart = 0;
    let canti: number = 0;

    this.detallev[i].cantidad = parseInt(cants);
    this.detallev[i].importe = cant * prec;
    canti = this.detallev[i].cantidad || 0;
    importe = this.detallev[i].importe || 0;


    this.venta.subTotal = parseFloat(
      (this.venta.subTotal - importe).toFixed(2)
    );

    this.subtotalfooter = this.venta.subTotal;

    let igvc;
    this.igv = this.igv - importe * 0.18;
    igvc = parseFloat(this.igv.toFixed(2));

    this.venta.montoTotal = parseFloat((this.venta.subTotal + igvc).toFixed(2));
    this.totalfooter = this.venta.montoTotal;
    this.igv = igvc;

    if (this.detallev[i].cantidad != null) {
      this.venta.numeroArticulos = this.venta.numeroArticulos - canti;
    }

    this.detallev.splice(i, 1);
    this.subject.next(this.detallev);
  }

  onSubmit(formDirective: FormGroupDirective) {
    //Cliente
    this.cliente = new Cliente(
      this.addVenta.value.numeroDocumento,
      this.addVenta.value.tipoDocumento,
      this.addVenta.value.nombres,
      this.addVenta.value.apellidoPaterno,
      this.addVenta.value.apellidoMaterno
    );

    //Venta
    let fechaVenta = this._formatfecha.transform(
      this.addVenta.value.fechaCreacion
    );

    this.venta = new Venta(
      fechaVenta,
      1,
      1,
      this.venta.numeroArticulos,
      this.venta.montoTotal,
      this.venta.subTotal,
      this.cliente,
      this.detallev,
      this.igv
    );

    //console.log(this.venta);

     this.enviarVenta(this.venta);

    this.limpiarEstadosDeForm(formDirective);
    this.limpiarDetalleTable();
  }

  enviarVenta(venta: Venta) {
    this._ventaService
      .enviarVenta(venta)
      .pipe(
        catchError((error) => {
          return EMPTY;
        })
      )
      .subscribe((response) => {
        Swal.fire(response.mensaje, response.objeto.mensaje, 'success');
        this.item = 0;
      });
  }

  limpiarDetalleForm() {
    this.addVenta.get('sku')?.reset();
    this.addVenta.get('descripcion')?.reset();
    this.addVenta.get('precio')?.reset();
    this.addVenta.get('cantidad')?.reset('1');
  }

  limpiarDetalleTable() {
    this.detallev = [];
    this.subject.next(this.detallev);
    this.subtotalfooter = 0;
    this.totalfooter = 0;
    this.addVenta.get('cantidad')?.reset('1');
    this.venta = new Venta(
      '',
      null,
      null,
      0,
      0,
      0,
      this.cliente,
      this.detallev,
      0
    );
    this.igv = 0;
  }

  limpiarEstadosDeForm(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.addVenta.reset();
  }

  obtenerCliente() {
    if (this.addVenta.value.numeroDocumento) {
      this._clienteService
        .getCliente(parseInt(this.addVenta.value.numeroDocumento))
        .pipe(
          catchError((error) => {
            return EMPTY;
          })
        )
        .subscribe((response) => {
          

          this.addVenta.controls['nombres'].setValue(response.objeto.nombres);
          this.addVenta.controls['apellidoPaterno'].setValue(
            response.objeto.apellidoPaterno
          );
          this.addVenta.controls['apellidoMaterno'].setValue(
            response.objeto.apellidoMaterno
          );

          this.addVenta.controls['tipoDocumento'].setValue(
            response.objeto.tipoDocumento
          );
        });
    }
  }

  obtenerProducto() {
    if (this.addVenta.value.sku) {
      this._productoService
        .getProducto(this.addVenta.value.sku)
        .pipe(
          catchError((error) => {
           
            return EMPTY;
          })
        )
        .subscribe((response) => {

          this.addVenta.controls['descripcion'].setValue(
            response.objeto.descripcion
          );
          this.addVenta.controls['unidadesMedida'].setValue(
            response.objeto.descripcionPresentacion
          );
        });
    }
  }

  changeTextToUppercase(field: any) {
    const obj: any = {};

    obj[field] = this.addVenta.controls[field].value.toUpperCase();
    this.addVenta.patchValue(obj);
  }
}
