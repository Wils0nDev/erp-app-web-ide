import { Cliente } from "./cliente";
import { Detalleventa } from "./detalleventa";
import { User } from "./user";

export class Venta {

    constructor(
        public fechaCreacion: string,
        public codigoSucursal: number | null ,
        //public user : User,
        public codigoUsuario: number | null,
        public numeroArticulos: number,
        public montoTotal: number,
        public subTotal: number ,
        public cliente : Cliente,
        public detalleventa : Detalleventa[],
        public montoIGV : number,


    ){}
}
