import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Filtroventa } from 'src/app/interfaces/filtroventa';
import { Cliente } from 'src/app/models/cliente';
import { Detalleventa } from 'src/app/models/detalleventa';
import { Producto } from 'src/app/models/producto';
import { Venta } from 'src/app/models/venta';
import { VentaService } from 'src/app/services/venta.service';

@Component({
  selector: 'ide-detailventa',
  templateUrl: './detailventa.component.html',
  styleUrls: ['./detailventa.component.css']
})
export class DetailventaComponent implements OnInit {

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
  constructor(public route: Router,  private _ventaService: VentaService,  private routeparams: ActivatedRoute,) {
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
        console.log(res.objeto);
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
