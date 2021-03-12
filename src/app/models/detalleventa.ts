import { Producto } from "./producto";

export class Detalleventa {

    constructor(
        
            public item : number,
            public precio :  number | null,
            public cantidad: number | null,
            public importe: number | null,
            public producto: Producto,
            public presentacion : string
            
          
    ){ }
}
