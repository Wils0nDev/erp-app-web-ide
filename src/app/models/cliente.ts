export class Cliente {




    constructor(
        public numeroDocumento: string,
        public tipoDocumento: number | null,
        public nombres: string,
        public apellidoPaterno: string,
        public apellidoMaterno: string,
    ){}


}
