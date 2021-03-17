import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Filtroventa } from 'src/app/interfaces/filtroventa';
import { Cliente } from 'src/app/models/cliente';
import { Detalleventa } from 'src/app/models/detalleventa';
import { Producto } from 'src/app/models/producto';
import { Venta } from 'src/app/models/venta';
import { VentaService } from 'src/app/services/venta.service';
import { DecimalFormat } from 'src/app/utils/decimal-pipe';
import { Formatfecha } from 'src/app/utils/formatfecha';
import Swal from 'sweetalert2';

@Component({
  selector: 'ide-editventa',
  templateUrl: './editventa.component.html',
  styleUrls: ['./editventa.component.css'],
})
export class EditventaComponent implements OnInit {
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

  public venta!: any;
  public ventas!: Venta;
  public accion!: any;
  public editForm!: FormGroup;
  public date!: Date;
  public dataSource!: any;
  public totalfooter!: any;
  public igv!: any;
  public subtotalfooter!: number;
  public detallev!: Detalleventa[];
  public subject!: BehaviorSubject<any>;
  public producto!: Producto;
  public detalleventa!: Detalleventa;
  public cliente!: Cliente;
  public numeroarticulos!: number;
  public codigoVenta! : number;

  public filtroVenta!: Filtroventa;
  public id_params!: number;
  public item!: number;
  public hora!: Date;
  public horav!: string;

  constructor(
    public route: Router,
    private _ventaService: VentaService,
    private routeparams: ActivatedRoute,
    private _formtDecimal: DecimalFormat,
    private _formatfecha: Formatfecha
  ) {
    this.hora = new Date();
    this.horav =
      this.hora.getHours() +
      ':' +
      this.hora.getMinutes() +
      ':' +
      this.hora.getSeconds();

    this.filtroVenta = {
      fechaInicio: '',
      fechaFin: '',
      datosCliente: '',
      stadoPago: 0,
      idVenta: 0,
    };

    this.producto = new Producto('', '', 'unidades');
    this.detalleventa = new Detalleventa(
      0,
      null,
      1,
      null,
      this.producto,
      'unidades'
    );
    this.venta = {};
    this.detallev = [];
  }

  ngOnInit(): void {
    this.subject = new BehaviorSubject(this.detallev);
    this.dataSource = this.subject.asObservable();

    this.id_params = this.routeparams.snapshot.params.id;
    this.filtroVenta.idVenta = this.id_params;
    this.getVentas(this.filtroVenta);

    this.editForm = new FormGroup({
      //
      fechaCreacion: new FormControl(''),
      transventa: new FormControl(''),
      transpago: new FormControl(''),
      datosVendedor: new FormControl(''),
      datosCliente: new FormControl(''),

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
    });

    this.disable();

    this.totalfooter = 0;
    this.igv = 0;
    this.subtotalfooter = 0;
    this.numeroarticulos = 0;
  }

  disable() {
    this.editForm.controls['transpago'].disable();
    this.editForm.controls['fechaCreacion'].disable();
    this.editForm.controls['transventa'].disable();
    this.editForm.controls['datosVendedor'].disable();
    this.editForm.controls['datosCliente'].disable();
  }

  getVentas(filtroVenta: any) {
    this._ventaService
      .getVentas(filtroVenta)
      .pipe(
        catchError((error) => {
          console.log(error);
          return EMPTY;
        })
      )
      .subscribe((res) => {
        
        res.objeto[0].detalleVenta.forEach((element: any) => {
          this.detalleventa.item = element.item;
          this.detalleventa.cantidad = element.cantidad;
          this.detalleventa.importe = element.importe;
          this.detalleventa.precio = element.precio;
          this.detalleventa.presentacion = element.presentacion;
          (this.producto.sku = element.skuProducto),
            (this.producto.descripcion = element.descripcion),
            (this.producto.descripcionPresentacion = element.presentacion);
          this.detalleventa.producto = this.producto;
          this.detallev.push(this.detalleventa);
          this.item = this.detalleventa.item;
          this.numeroarticulos = this.numeroarticulos + element.cantidad;
          this.producto = new Producto('', '', 'unidades');
          this.detalleventa = new Detalleventa(
            0,
            null,
            1,
            null,
            this.producto,
            'unidades'
          );
        });
        this.subject.next(this.detallev);
        this.totalfooter = res.objeto[0].totalVenta;
        this.igv = res.objeto[0].montoIGV;
        this.subtotalfooter = this.totalfooter - this.igv;
        this.codigoVenta = res.objeto[0].codigoVenta
        this.editForm.controls['fechaCreacion'].setValue(
          res.objeto[0].fechaCreacion
        );
        this.editForm.controls['transventa'].setValue(
          res.objeto[0].codigoVenta
        );
        this.editForm.controls['transpago'].setValue(res.objeto[0].transpago);
        this.editForm.controls['datosVendedor'].setValue(
          res.objeto[0].datosVendedor
        );
        this.editForm.controls['datosCliente'].setValue(
          res.objeto[0].datosCliente
        );
        
      });
  }

  addDetalleProducto() {
    let subtotal: number;
    let importe: number | null;
    let cantidadArt: number;
    let uMedida: string;

    this.item++;

    uMedida = this.editForm.value.unidadesMedida;

    //czlculo de subtotal
    this.editForm.value.precio != null && this.editForm.value.cantidad
      ? (importe = this.editForm.value.precio * this.editForm.value.cantidad)
      : (importe = 0);

    importe = parseFloat(importe.toFixed(2));

    //producto
    this.producto = new Producto(
      this.editForm.value.sku,
      this.editForm.value.descripcion,
      this.editForm.value.unidadesMedida
    );

    //detalle del producto
    this.detalleventa = new Detalleventa(
      this.item,
      parseFloat(this._formtDecimal.transform(this.editForm.value.precio)),
      parseInt(this.editForm.value.cantidad),
      importe,
      this.producto,
      uMedida
    );

    //agrego un detalle al array de detalles
    this.detallev.push(this.detalleventa);
    this.subject.next(this.detallev);

    this.subtotalfooter = this.subtotalfooter + importe;
    //console.log(this.igv)
    this.igv = (this.subtotalfooter * 0.18).toFixed(2);

    this.totalfooter = this.subtotalfooter + parseFloat(this.igv);

    console.log(this.totalfooter);

    this.numeroarticulos =
      this.numeroarticulos + parseInt(this.editForm.value.cantidad);

    //numero de articulos , la cantidad de items del array

    //limpiando  el formulatio de agregar productos
    this.limpiarDetalleForm();
  }

  editDetalle(i: any) {
    let cant = this.detallev[i].cantidad || 0;
    let prec = this.detallev[i].precio || 0;
    let importe = 0;
    let subtotal = 0;
    let tototal = 0;
    let cants = String(cant);
    let numart = 0;

    this.detallev[i].cantidad = parseInt(cants);
    this.detallev[i].importe = cant * prec;

    importe = this.detallev[i].importe || 0;

    this.subtotalfooter = parseFloat(subtotal.toFixed(2));

    this.igv = this.subtotalfooter * 0.18;

    this.igv = parseFloat(this.igv.toFixed(2));

    this.totalfooter = parseFloat((this.subtotalfooter + this.igv).toFixed(2));

    this.numeroarticulos =
      this.numeroarticulos + parseInt(this.editForm.value.cantidad);
  }

  deleteDetalle(i: any) {
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

    this.subtotalfooter = parseFloat(
      (this.subtotalfooter - importe).toFixed(2)
    );

    this.igv = this.subtotalfooter * 0.18;

    this.igv = parseFloat(this.igv.toFixed(2));

    this.totalfooter = parseFloat((this.subtotalfooter + this.igv).toFixed(2));

    if (this.detallev[i].cantidad != null) {
      this.numeroarticulos = this.numeroarticulos - canti;
    }

    this.detallev.splice(i, 1);
    this.subject.next(this.detallev);
  }

  obtenerProducto() {}

  changeTextToUppercase(field: any) {
    const obj: any = {};

    //obj[field] = this.editForm.controls[field].value.toUpperCase();
    //this.editForm.patchValue(obj);
  }

  limpiarDetalleForm() {
    this.editForm.get('sku')?.reset();
    this.editForm.get('descripcion')?.reset();
    this.editForm.get('precio')?.reset();
    this.editForm.get('cantidad')?.reset('1');
  }

  regresar() {
    this.route.navigate(['admin/sales/listventa']);
  }

  onSubmit(formDirective: FormGroupDirective) {
    //Cliente
    this.cliente = new Cliente(0,
      "",
      0,
      "",
      "",
      ""
    );

    //Venta
    let fechaVenta =
      this._formatfecha.transform(this.editForm.value.fechaCreacion) +
      ' ' +
      this.horav;

    this.ventas = new Venta(
      this.codigoVenta,
      "",
      1,
      1,
      this.numeroarticulos,
      this.totalfooter,
      this.subtotalfooter,
      this.cliente,
      this.detallev,
      this.igv
    );

    console.log(this.ventas);

    this.updateVenta(this.venta);

    this.limpiarEstadosDeForm(formDirective);
    this.limpiarDetalleTable();
  }

  updateVenta(venta: Venta) {
    this._ventaService
      .updateVenta(venta) //
      .pipe(
        catchError((error) => {
          console.log(error)
          return EMPTY;
        })
      )
      .subscribe((response) => {
        Swal.fire(response.mensaje, response.objeto.mensaje, 'success');
        this.item = 0;
      });
  }

  limpiarEstadosDeForm(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.editForm.reset();
  }

  limpiarDetalleTable() {
    this.detallev = [];
    this.subject.next(this.detallev);
    this.subtotalfooter = 0;
    this.totalfooter = 0;
    this.editForm.get('cantidad')?.reset('1');
    this.venta = new Venta(0,
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
}
