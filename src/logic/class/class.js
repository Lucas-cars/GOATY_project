class user {
    #idUsuario = ''
    #dni = '';
    #nombre = '';
    #apellido = '';
    #email = '';
    #telefono = '';
    #cargo = '';
    #fechaIngreso = '';

    constructor(idUsuario, dni, nombre, apellido, email, telefono, cargo, fechaIngreso) {
        this.#idUsuario = idUsuario;
        this.#dni = dni;
        this.#nombre = nombre;
        this.#apellido = apellido;
        this.#email = email;
        this.#telefono = telefono;
        this.#cargo = cargo;
        this.#fechaIngreso = fechaIngreso;
    }
    modDatos(type,dato) {
        if (this.#cargo == 'admin' || this.#cargo == 'hr') {
            switch (type) {
                case 'nombre':
                    this.#nombre = dato;
                    break;
                case 'apellido':
                    this.#apellido = dato;
                    break;
                case 'email':
                    this.#email = dato;
                    break;
                case 'telefono':
                    this.#telefono = dato;
                    break;
                case 'cargo':
                    this.#cargo = dato;
                    break;
                case 'fechaIngreso':
                    this.#fechaIngreso = dato;
                    break;
            }
        } else {
            return 'No tienes permisos para modificar datos';
            }
        }
        asignarCargo(dato){
            if (this.#cargo = 'admin'){
            // ACA IRIA EL USER SELECCIONADO QUE AUN NO LO HICE ESA CLASE
            return 'Cambio realizado con exito'
            } else {
                return 'No tienes permiso para asignar cargos'
            }
        }
        verDatos() {
            return {
                dni: this.#dni,
                nombre: this.#nombre,
                apellido: this.#apellido,
                email: this.#email,
                telefono: this.#telefono,
                cargo: this.#cargo,
                fechaIngreso: this.#fechaIngreso
            };
        }
}
