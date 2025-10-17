// USUARIO
class API {
    constructor() {
    }
    static async modDatos(type,dato) {
        }

        static async verTodosDatos(tabla) {
            try {
            const response = await fetch(`http://localhost:3000/api/${tabla}`);
            const datos = await response.json();
            return datos;
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            throw error;
        }
    }

        static idUser(){
            
        }
        static User() {
            return {
                
            };
        }
}


// ASISTECIA    
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
    registrarSalida(hora) {
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

// STOCK
class Stock {
    #idProducto = '';
    #nombre = '';
    #codigo = '';
    #stockActual = '';
    #stockMinimo = '';
    #precio = '';
    #descripcion = '';
    #categoria = '';
    constructor(idProducto, nombre, codigo, stockActual, stockMinimo, precio, descripcion, categoria) {
        this.#idProducto = idProducto;
        this.#nombre = nombre;
        this.#codigo = codigo;
        this.#stockActual = stockActual;
        this.#stockMinimo = stockMinimo;
        this.#precio = precio;
        this.#descripcion = descripcion;
        this.#categoria = categoria;
    }
    actualizarStock(cantidad) {
        this.#stockActual += cantidad;
        return 'Stock actualizado con exito';
    }
    verStock() {
        return {
            stockActual: this.#stockActual,
        };
    }
    verDatos() {
        return {
            idProducto: this.#idProducto,
            nombre: this.#nombre,
            codigo: this.#codigo,
            stockActual: this.#stockActual,
            precio: this.#precio,
            descripcion: this.#descripcion,
            categoria: this.#categoria,
        };
    }
    esNecesarioReponer() {
        if (this.#stockActual < this.#stockMinimo) {
            return true;
        }
        return false;
    }
    eliminarProducto() {
        // ACA IRIA LA LOGICA PARA ELIMINAR EL PRODUCTO DE LA BASE DE DATOS
        return 'Producto eliminado con exito';
    }

}

// EXPORTO LAS CLASES PARA PODER USARLAS EN OTRO LADO
module.exports = { user, admin, asistencia, Stock };
