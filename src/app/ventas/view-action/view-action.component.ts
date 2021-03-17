import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';
import { Detalleventa } from 'src/app/models/detalleventa';
import { Producto } from 'src/app/models/producto';

@Component({
  selector: 'ide-view-action',
  templateUrl: './view-action.component.html',
  styleUrls: ['./view-action.component.css'],
})
export class ViewActionComponent implements OnInit {
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
  public accion!: any;
  public editForm!: FormGroup;
  public date!: Date;
  public dataSource!: any;
  public totalfooter!: any;
  public igv!: any;
  public detallev!: Detalleventa[];
  public subject!: BehaviorSubject<any>;
  public producto!: Producto;
  public detalleventa!: Detalleventa;

  constructor(public route: Router) {
    this.producto = new Producto('', '', 'unidades');
    this.detalleventa = new Detalleventa(
      0,
      null,
      1,
      null,
      this.producto,
      'unidades'
    );

    this.detallev = [];
  }

  ngOnInit(): void {
    this.subject = new BehaviorSubject(this.detallev);
    this.dataSource = this.subject.asObservable();

    

    this.accion = localStorage.getItem('action');

    this.editForm = new FormGroup({
      //
      fechaCreacion: new FormControl(this.venta.fechaCreacion),
      transventa: new FormControl(this.venta.codigoVenta),
      transpago: new FormControl(''),
      datosVendedor: new FormControl(this.venta.datosVendedor),
      datosCliente: new FormControl(this.venta.datosCliente),

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

    if (this.accion === 'view') {
      this.editForm.controls['transpago'].disable();
      this.editForm.controls['fechaCreacion'].disable();
      this.editForm.controls['transventa'].disable();
      this.editForm.controls['datosVendedor'].disable();
      this.editForm.controls['datosCliente'].disable();
    }

    // console.log(this.venta.detalleVenta)
    this.venta.detalleVenta.forEach((element: any) => {
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

    this.totalfooter = this.venta.totalVenta;
    this.igv = this.venta.montoIGV;
  }

  editDetalle(venta: any) {}

  deleteDetalle(i: any) {}

  obtenerProducto() {}

  changeTextToUppercase(field: any) {
    const obj: any = {};

    //obj[field] = this.addVenta.controls[field].value.toUpperCase();
    //this.addVenta.patchValue(obj);
  }

  addDetalleProducto() {}

  regresar() {
    this.route.navigate(['admin/sales/listventa']);
  }

  
}
