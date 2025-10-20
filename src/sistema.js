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
     

    if (typeof API !== 'undefined' && API.verTodosDatos) {
      loadEmpleados().catch(err => console.error('Error cargando empleados:', err));
    }
      });

    window.addEventListener('pageshow', () => {
      if (typeof API !== 'undefined' && API.verTodosDatos) {
        loadEmpleados().catch(err => console.error('Error cargando empleados (pageshow):', err));
      }
    });

    async function loadEmpleados() {
      try {
        const rows = await API.verTodosDatos('empleado');
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
        actualizarSelectAsistencia();
      } catch (err) {
        console.error('loadEmpleados error:', err);
        empleados = [];
        actualizarTablaEmpleados();
        actualizarSelectorEmpleados();
        actualizarSelectAsistencia();
      }
    }

    function actualizarSelectAsistencia() {
      const sel = document.getElementById('selectorAsistencia');
      if (!sel) return;
      sel.innerHTML = '<option value="" disabled selected hidden>Seleccione empleado</option>';
      empleados.forEach(emp => {
        const opt = document.createElement('option');
        opt.value = emp.dni;
        opt.textContent = emp.nombre ? `${emp.nombre} — ${emp.dni}` : emp.dni;
        sel.appendChild(opt);
  });
}
    


    function mostrarSeccion(seccionId) {

  const secciones = document.querySelectorAll('.seccion');
  secciones.forEach(seccion => {
    seccion.classList.remove('activa');
  });

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
        actualizarSelectAsistencia();


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


    const ctxStock=document.getElementById('graficoStock').getContext('2d');
    let stockMaderas=[];

    const datosStock={labels:[],datasets:[{label:'Cantidad en Stock',data:[],backgroundColor:[],borderColor:'#bbb',borderWidth:1}]} ;
    const configStock={type:'bar',data:datosStock,options:{responsive:true,scales:{y:{beginAtZero:true,ticks:{color:'#ddd'}},x:{ticks:{color:'#ddd'}}},plugins:{legend:{labels:{color:'#ddd'}}}}};
    const graficoStock=new Chart(ctxStock,configStock);

  

    function actualizarGraficoStock(){
      datosStock.labels=stockMaderas.map(m=>m.tipo);
      datosStock.datasets[0].data=stockMaderas.map(m=>m.cantidad);
      datosStock.datasets[0].backgroundColor=stockMaderas.map(m=>m.color);
      graficoStock.update();
    }

    async function loadAsistencias() {
      try {
        const rows = await API.verAsistencias();
        const tbody = document.querySelector('#tablaAsistencia tbody') || (() => {
          const t = document.querySelector('#tablaAsistencia');
          const tb = document.createElement('tbody');
          t.appendChild(tb);
          return tb;
        })();

        tbody.innerHTML = '';
        (rows || []).forEach(r => {
          const nombre = (empleados.find(e => e.dni == r.dni) || {}).nombre || '';
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${r.fecha || ''}</td>
            <td>${r.dni || ''}</td>
            <td>${nombre}</td>
            <td>${r.hr_en || ''}</td>
            <td>${r.hr_sl || ''}</td>
            <td>${(r.hr_en || r.hr_sl) ? 'Presente' : 'Ausente'}</td>
          `;
          tbody.appendChild(tr);
        });
      } catch (err) {
        console.error('Error cargando asistencias:', err);
      }
    }


  async function guardarAsistencia() {
    const dni = document.getElementById('selectorAsistencia')?.value;
    const fecha = document.getElementById('asistenciaFecha')?.value;
    const estado = document.getElementById('empleadoAsistencia')?.value;
    let hr_en = document.getElementById('empleadoHoraIngreso')?.value || null;
    let hr_sl = document.getElementById('empleadoHoraSalida')?.value || null;

    if (!dni) { alert('Seleccioná un empleado'); return; }
    if (!fecha) { alert('Seleccioná una fecha'); return; }
    if (estado !== 'Presente') { hr_en = null; hr_sl = null; }

    try {
      await API.agregarAsistencia({ dni, fecha, hr_en, hr_sl });
      await loadAsistencias();
      alert('Asistencia guardada');
    } catch (err) {
      console.error('Error al guardar asistencia:', err);
      alert('Error al guardar asistencia. Mirá consola / network para más detalles.');
    }
  }
  
  