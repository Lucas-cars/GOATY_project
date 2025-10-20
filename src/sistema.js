    const opciones = {
      maderas: ["Pino", "Roble", "Eucalipto", "Cedro"],
      herramientas: ["Martillo", "Clavadora neumática", "Sierra circular", "Taladro"],
      pallets: ["EUR", "Exportación", "Reciclado", "A medida"]

    };
    function actualizarTipos() {
      const categoriaSelect = document.getElementById("categoria");
      const tipoSelect = document.getElementById("tipo");

 
      tipoSelect.innerHTML = '<option value="" disabled selected hidden>Por favor, seleccione</option>';

 
      const categoriaSeleccionada = categoriaSelect.value;

 
      if (opciones[categoriaSeleccionada]) {
        opciones[categoriaSeleccionada].forEach(tipo => {
          const option = document.createElement("option");
          option.value = tipo;
          option.textContent = tipo;
          tipoSelect.appendChild(option);
        });
      }
    }
    
    
    document.addEventListener('DOMContentLoaded', function() {
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fecha').value = today;
    document.getElementById('empleadoFechaIngreso').value = today;
     

      // cargar empleados desde la API al iniciar
    if (typeof API !== 'undefined' && API.verTodosDatos) {
      loadEmpleados().catch(err => console.error('Error cargando empleados:', err));
    }
      });

    // recargar cuando se vuelva a la página desde otra (evita problemas con back cache)
    window.addEventListener('pageshow', () => {
      if (typeof API !== 'undefined' && API.verTodosDatos) {
        loadEmpleados().catch(err => console.error('Error cargando empleados (pageshow):', err));
      }
    });

    async function loadEmpleados() {
      try {
        const rows = await API.verTodosDatos('empleado');
        // mapear campos que trae la API (en la DB la columna se llama 'mail')
        empleados = (rows || []).map(r => ({
          nombre: r.nombre || '',
          dni: r.dni || r.id_usuario || '',
          cargo: r.cargo || '',
          telefono: r.telefono || '',
          email: r.mail || r.email || '',
          fechaIngreso: r.fechaIngreso || r.fecha || ''
        }));
        actualizarTablaEmpleados();
        actualizarSelectorEmpleados();
      } catch (err) {
        console.error('loadEmpleados error:', err);
        // no romper la UI si falla
        empleados = [];
        actualizarTablaEmpleados();
        actualizarSelectorEmpleados();
      }
    }
    

    /* ------------------ GENERAL ------------------ */
    function mostrarSeccion(seccionId) {
  // Ocultar todas las secciones
  const secciones = document.querySelectorAll('.seccion');
  secciones.forEach(seccion => {
    seccion.classList.remove('activa');
  });

  // Mostrar la sección seleccionada
  const seccionActiva = document.getElementById(seccionId);
  if (seccionActiva) {
    seccionActiva.classList.add('activa');
  }
}

    function activarHorarios() {
      const asistencia = document.getElementById('empleadoAsistencia').value;
      ['empleadoHoraIngreso','empleadoHoraSalida'].forEach(id => {
        const campo = document.getElementById(id);
        if(asistencia==='Presente'){campo.disabled=false;}
        else{campo.disabled=true; campo.value='';}
      });
    }

    /* ------------------ EMPLEADOS ------------------ */
    let empleados = [];

    async function agregarEmpleado() {
      const nombre = document.getElementById('empleadoNombre').value.trim();
      const dni = document.getElementById('empleadoDNI').value.trim();
      const cargo = document.getElementById('empleadoCargo').value.trim();
      const telefono = document.getElementById('empleadoTelefono').value.trim();
      const email = document.getElementById('empleadoEmail').value.trim();
      const fechaIngreso = document.getElementById('empleadoFechaIngreso').value;

      try {
        const resultado = await API.agregarUser(dni, email, telefono, cargo, nombre, fechaIngreso);
        // mapear respuesta del servidor (mail → email)
        const nuevo = {
          nombre: resultado.nombre || nombre,
          dni: resultado.dni || dni,
          cargo: resultado.cargo || cargo,
          telefono: resultado.telefono || telefono,
          email: resultado.mail || resultado.email || email,
          fechaIngreso: resultado.fechaIngreso || fechaIngreso
        };
        empleados.push(nuevo);
        actualizarTablaEmpleados();
        actualizarSelectorEmpleados();

        // limpiar formulario sólo si todo OK
        document.getElementById('empleadoNombre').value='';
        document.getElementById('empleadoDNI').value='';
        document.getElementById('empleadoCargo').value='';
        document.getElementById('empleadoTelefono').value='';
        document.getElementById('empleadoEmail').value='';
        document.getElementById('empleadoFechaIngreso').value='';
      } catch (error) {
        console.error('Error al agregar usuario:', error);
        alert('No se pudo agregar el empleado en el servidor');
      }
    }
    function actualizarTablaEmpleados() {
      const table = document.getElementById('tablaEmpleados');
      if (!table) return;
      let tbody = table.querySelector('tbody');
      if (!tbody) {
        tbody = document.createElement('tbody');
        table.appendChild(tbody);
      }
      tbody.innerHTML='';
      empleados.forEach(emp=>{
        const tr=document.createElement('tr');
        tr.innerHTML = `
          <td>${emp.nombre}</td>
          <td>${emp.dni}</td>
          <td>${emp.cargo}</td>
          <td>${emp.telefono}</td>
          <td>${emp.email}</td>
          <td>${emp.fechaIngreso}</td>
        `;
        tr.style.cursor = 'pointer';
        tr.addEventListener('click', () => {
          localStorage.setItem('editarEmpleado', JSON.stringify(emp));
          window.location.href = 'editar_Empleado.html';
        });
        tbody.appendChild(tr);
      });
    }

    /* ------------------ INFORMES ------------------ */
    function actualizarSelectorEmpleados() {
      const selector=document.getElementById('selectorEmpleado');
      selector.innerHTML='<option value="">Todos los empleados</option>';
      empleados.forEach((emp,idx)=>{
        const opt=document.createElement('option');
        opt.value=idx;
        opt.textContent=emp.nombre;
        selector.appendChild(opt);
      });
      document.getElementById('buscadorEmpleado').value='';
    }

    function filtrarEmpleados(){
      const texto = document.getElementById('buscadorEmpleado').value.toLowerCase();
      const selector=document.getElementById('selectorEmpleado');
      selector.innerHTML='<option value="">Todos los empleados</option>';
      empleados.forEach((emp,idx)=>{
        if(emp.nombre.toLowerCase().includes(texto)){
          const opt=document.createElement('option');
          opt.value=idx;
          opt.textContent=emp.nombre;
          selector.appendChild(opt);
        }
      });
    }

    function generarInforme(){
      const evaluacion=document.getElementById('evaluacion').value;
      const hasta=document.getElementById('hasta').value;
      const selectorEmpleado=document.getElementById('selectorEmpleado').value;

      if(!evaluacion||!hasta){alert('Seleccione fecha de evaluacion del empleado.'); return;}
      //if(new Date(desde)>new Date(hasta)){alert('Fecha "Desde" mayor que "Hasta".'); return;}

      let empleadosFiltrados=empleados.filter(emp=>emp.fechaRegistro>=desde && emp.fechaRegistro<=hasta);
      if(selectorEmpleado!==''){empleadosFiltrados=[empleados[parseInt(selectorEmpleado)]];}

      const tbody=document.querySelector('#tablaInforme tbody');
      tbody.innerHTML='';
      empleadosFiltrados.forEach(emp=>{
        const tr=document.createElement('tr');
        tr.innerHTML=`<td>${emp.nombre}</td><td>${emp.dni}</td><td>${emp.cargo}</td><td>${emp.fechaRegistro}</td><td>${emp.horaIngreso}</td><td>${emp.horaSalida}</td><td>${emp.asistencia}</td>`;
        tbody.appendChild(tr);
      });
    }

    /* ------------------ STOCK ------------------ */
    const ctxStock=document.getElementById('graficoStock').getContext('2d');
    let stockMaderas=[];

    const datosStock={labels:[],datasets:[{label:'Cantidad en Stock',data:[],backgroundColor:[],borderColor:'#bbb',borderWidth:1}]} ;
    const configStock={type:'bar',data:datosStock,options:{responsive:true,scales:{y:{beginAtZero:true,ticks:{color:'#ddd'}},x:{ticks:{color:'#ddd'}}},plugins:{legend:{labels:{color:'#ddd'}}}}};
    const graficoStock=new Chart(ctxStock,configStock);

    function agregarAlStock(){
      const tipo=document.getElementById('tipoMadera').value.trim();
      const cantidad=parseInt(document.getElementById('cantidad').value);
      if(!tipo||isNaN(cantidad)||cantidad<=0){alert("Ingresá tipo de madera válido y cantidad positiva");return;}
      const indiceExistente=stockMaderas.findIndex(m=>m.tipo.toLowerCase()===tipo.toLowerCase());
      if(indiceExistente!==-1){stockMaderas[indiceExistente].cantidad+=cantidad;}
      else{stockMaderas.push({tipo:tipo,cantidad:cantidad,color:'#'+Math.floor(Math.random()*16777215).toString(16)});}
      actualizarGraficoStock();
      document.getElementById('tipoMadera').value='';
      document.getElementById('medidas').value='';
      document.getElementById('cantidad').value='';
      document.getElementById('precio').value='';
    }

    function actualizarGraficoStock(){
      datosStock.labels=stockMaderas.map(m=>m.tipo);
      datosStock.datasets[0].data=stockMaderas.map(m=>m.cantidad);
      datosStock.datasets[0].backgroundColor=stockMaderas.map(m=>m.color);
      graficoStock.update();
    }

    