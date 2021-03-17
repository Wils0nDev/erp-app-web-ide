import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ide-action-table',
  templateUrl: './action-table.component.html',
  styleUrls: ['./action-table.component.css']
})
export class ActionTableComponent implements OnInit {

  @Input()
  venta! : any
  
  constructor() { }

  ngOnInit(): void {
  }

  viewVenta(venta : any){
    this.view.emit(venta)
  }

  editVenta(venta : any){
    this.edit.emit(venta)
  }

  @Output()
  view : EventEmitter<any> = new EventEmitter<any>();

  @Output()
  edit : EventEmitter<any> = new EventEmitter<any>();

  
}
