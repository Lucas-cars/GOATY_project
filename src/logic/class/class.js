// USUARIO
class API {
    constructor() {}
    static async agregarAsistencia({ dni, fecha, hr_en = null, hr_sl = null }) {
        try {
            const response = await fetch('http://localhost:3000/api/asistencia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dni, fecha, hr_en, hr_sl })
            });
            const data = await response.json().catch(() => null);
            if (!response.ok) {
                throw new Error(data && data.error ? JSON.stringify(data.error) : `HTTP ${response.status}`);
            }
            return data;
        } catch (error) {
            console.error('Error al agregar asistencia:', error);
            throw error;
        }
    }
    static async agregarMovimiento({ fecha, tipo, cantidad, id_producto, id_usuario = null }) {
        try {
            const response = await fetch('http://localhost:3000/api/movimiento_stock', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fecha, tipo, cantidad, id_producto, id_usuario })
            });
            const data = await response.json().catch(()=>null);
            if (!response.ok) {
                throw new Error(data && data.error ? JSON.stringify(data.error) : `HTTP ${response.status}`);
            }
            return data;
        } catch (err) {
            console.error('Error al agregar movimiento:', err);
            throw err;
        }
    }

    static async verAsistencias() {
        return await API.verTodosDatos('asistencia');
    }

    
    static async modDatos(type,dato) {
        }

        static async verTodosDatos(tabla) {
        try {
            console.log('[API] GET /api/' + tabla);
            const response = await fetch(`http://localhost:3000/api/${tabla}`);
            console.log('[API] response status', response.status);
            const datos = await response.json();
            console.log('[API] datos recibidos:', tabla, datos);
            return datos;
        } catch (error) {
            console.error('Error al obtener los datos:', error);
            throw error;
        }
    }

        static idUser(){
            
        }
        static async agregarUser(dni, mail, telefono, cargo, nombre, fechaIngreso) {
            try {
                const response = await fetch('http://localhost:3000/api/empleado', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    
                    body: JSON.stringify({ dni, mail, telefono, cargo, nombre, fechaIngreso })
                });
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const resultado = await response.json();
                return resultado;
            } catch (error) {
                console.error('Error al agregar usuario:', error);
                throw error;
            }
        }

        static async editarUser(dni, cambios) {
            try {
                const body = { dni, ...cambios };
                const response = await fetch('http://localhost:3000/api/empleado', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                return await response.json();
            } catch (error) {
                console.error('Error al editar usuario:', error);
                throw error;
            }
        }

        static async borrarUser(dni) {
            try {
                const response = await fetch('http://localhost:3000/api/empleado', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dni })
                });
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                return await response.json();
            } catch (error) {
                console.error('Error al borrar usuario:', error);
                throw error;
        }
    }
}

async function loadProductos() {
  try {
    const rows = await API.verTodosDatos('producto');
    const sel = document.getElementById('productoSelect');
    if (!sel) return;
    sel.innerHTML = '<option value="" disabled selected hidden>Seleccione producto</option>';
    (rows || []).forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id_producto;
      opt.textContent = `${p.nombre} (${p.id_producto})`;
      sel.appendChild(opt);
    });
  } catch (err) {
    console.error('Error cargando productos:', err);
  }
}
document.addEventListener('DOMContentLoaded', function() {
  if (typeof API !== 'undefined') loadProductos().catch(()=>{});
});
window.addEventListener('pageshow', () => {
  if (typeof API !== 'undefined') loadProductos().catch(()=>{});
});

async function loadTablero() {
  try {
    const res = await fetch('http://localhost:3000/api/tablero');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    document.getElementById('maderaDisponible').textContent = data.madera_disponible ?? 0;
    document.getElementById('valorStock').textContent = data.valor_stock ?? 0;
    document.getElementById('palletsTerminados').textContent = data.pallets_terminados ?? 0;
  } catch (err) {
    console.error('Error cargando tablero:', err);
  }
}


document.addEventListener('DOMContentLoaded', function() {

  loadTablero().catch(e => console.error(e));
});


window.addEventListener('pageshow', () => {
  loadTablero().catch(e => console.error(e));
});


async function agregarAlStock(){
  const prodSel = document.getElementById('productoSelect');
  const productoId = prodSel ? prodSel.value : null;
  const cantidad = parseInt(document.getElementById('cantidad').value, 10);
  const fecha = document.getElementById('fecha').value;

  if (!productoId) { alert('Seleccioná un producto'); return; }
  if (isNaN(cantidad) || cantidad <= 0) { alert('Ingresá una cantidad válida'); return; }
  if (!fecha) { alert('Seleccioná una fecha'); return; }

  try {
    const resultado = await API.agregarMovimiento({
      fecha,
      tipo: 'entrada',
      cantidad,
      id_producto: productoId,
      id_usuario: null
    });
    console.log('Movimiento creado:', resultado);
    alert('Movimiento registrado en la base de datos');

    await loadTablero();
    await loadProductos();

  } catch (err) {
    console.error('Error al crear movimiento:', err);
    alert('No se pudo registrar el movimiento. Revisá consola/network.');
  }

  document.getElementById('cantidad').value = '';
  if (prodSel) prodSel.selectedIndex = 0;

}

/* // ASISTECIA    
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


if (typeof window !== 'undefined') {
    window.API = API;
    window.Asistencia = asistencia;
    window.Stock = Stock;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API, asistencia, Stock };
} */