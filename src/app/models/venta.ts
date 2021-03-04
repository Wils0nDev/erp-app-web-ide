import { Cliente } from "./cliente";
import { Detalleventa } from "./detalleventa";

export class Venta {

    constructor(
        public fechaCreacion: string,
        public codigoSucursal: number | null ,
        public codigoUsuario: number | null,
        public numeroArticulos: number,
        public montoTotal: number | null,
        public subTotal: number | null,
        public cliente : Cliente,
        public detalleventa : Detalleventa[]
    ){}
}
