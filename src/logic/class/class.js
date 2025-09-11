class user {
    #idUsuario = ''
    #dni = '';
    #nombre = '';
    #apellido = '';
    #email = '';
    #telefono = '';
    #cargo = '';

    constructor(idUsuario, dni, nombre, apellido, email, telefono, cargo) {
        this.#idUsuario = idUsuario;
        this.#dni = dni;
        this.#nombre = nombre;
        this.#apellido = apellido;
        this.#email = email;
        this.#telefono = telefono;
        this.#cargo = cargo;
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
                }
        } else {
            throw new Error('No tienes permisos para modificar datos');
            }
        }
        asignarCargo(dato){
            if (this.#cargo = 'admin'){
            // ACA IRIA EL USER SELECCIONADO QUE AUN NO LO HICE ESA CLASE
            return 'Cambio realizado con exito'
            } else {
                throw new Error('No tienes permiso para asignar cargos')
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
            };
        }
}

class asistencia {
    #idAsistencia = '';
    #fecha = '';
    #horaEntrada = '';
    #horaSalida = '';

    constructor(idAsistencia, fecha, horaEntrada, horaSalida) {
        this.#idAsistencia = idAsistencia;
        this.#fecha = fecha;
        this.#horaEntrada = horaEntrada;
        this.#horaSalida = horaSalida;
    }
    registrarEntrada(hora) {
        this.#horaEntrada = hora;
        return 'Entrada registrada con exito';
    }
    registrarSaldida(hora) {
        this.#horaSalida = hora;
        return 'Salida registrada con exito';
    }
    generarReporte() {
        return {
            // Aca se mostraria el reporte de entrada y salida de los ultimo trimestre
            fecha: this.#fecha,
            salida: this.#horaSalida,
            entrada: this.#horaEntrada,
        }

    }
}

const Pedro = new user(132, 45646546, "Pedro", "Juan", 'pedroj@gmail.com', '6455646465', 'admin');

// Pedro.modDatos('nombre','Pedras');
// console.log(Pedro.asignarCargo('empleado'));
// console.log(Pedro.verDatos());
