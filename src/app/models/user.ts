export class User {
    
    constructor(
        public cod_empresa: number,
        public nombre_empresa: string,
        public url_logo: string,
        public cod_usuario: number,
        public cod_perfil: number,
        public nombres: string,
        public apellido_paterno: string,
        public apellido_materno: string,
        public documento: string,
        public cuenta : string,
        public clave : string,
    ) { }

}
