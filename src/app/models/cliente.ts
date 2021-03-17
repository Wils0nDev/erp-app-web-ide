export class Cliente {




    constructor(
        public idUsuario : number,
        public numeroDocumento: string,
        public tipoDocumento: number | null,
        public nombres: string,
        public apellidoPaterno: string,
        public apellidoMaterno: string,
    ){}


}
