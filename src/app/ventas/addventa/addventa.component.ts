export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
export interface PeriodicElement {
  position: number;
  descripcion: string;
  preciou: number;
  cantidad: string;
  unidades : string;
  importe : number;
  accion : string;


}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, descripcion: 'Hydrogen', preciou: 1.0079, cantidad: 'H', unidades : 'km', importe : 10, accion: 'edit'},
  {position: 2, descripcion: 'Helium', preciou: 4.0026, cantidad: 'He', unidades : 'km', importe : 10, accion: 'edit'},
  {position: 3, descripcion: 'Lithium', preciou: 6.941, cantidad: 'Li', unidades : 'km', importe : 10, accion: 'edit'},
  
];
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ide-addventa',
  templateUrl: './addventa.component.html',
  styleUrls: ['./addventa.component.css']
})
export class AddventaComponent implements OnInit {

  tiles: Tile[] = [
    {text: 'One', cols: 2, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 4, rows: 1, color: 'lightgreen'},
    {text: 'Three', cols: 4, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 4, rows: 1, color: '#DDBDF1'},
  ];

  displayedColumns: string[] = ['position', 'descripcion', 'preciou', 'cantidad','unidades','importe','accion'];
  dataSource = ELEMENT_DATA;
  
  constructor() { 
    
  }

  ngOnInit(): void {
  }

}
