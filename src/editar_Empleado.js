document.addEventListener('DOMContentLoaded', () => {
  const raw = localStorage.getItem('editarEmpleado');
  if (!raw) {
    window.location.href = 'sistema.html';
    return;
  }
  const emp = JSON.parse(raw);

  const elNombre = document.getElementById('editNombre');
  const elDNI = document.getElementById('editDNI');
  const elCargo = document.getElementById('editCargo');
  const elTelefono = document.getElementById('editTelefono');
  const elEmail = document.getElementById('editEmail');
  const elFecha = document.getElementById('editFecha');

  elNombre.value = emp.nombre || '';
  elDNI.value = emp.dni || '';
  elCargo.value = emp.cargo || '';
  elTelefono.value = emp.telefono || '';
  elEmail.value = emp.email || '';
  elFecha.value = emp.fechaIngreso || '';

  document.getElementById('btnSave').addEventListener('click', async () => {
    const cambios = {
      nombre: elNombre.value.trim(),
      cargo: elCargo.value.trim(),
      telefono: elTelefono.value.trim(),
      mail: elEmail.value.trim(),
      fechaIngreso: elFecha.value
    };
    try {
      await API.editarUser(elDNI.value, cambios);
      localStorage.removeItem('editarEmpleado');  
      window.location.href = 'sistema.html';
    } catch (err) {
      alert('Error al actualizar el empleado');
      console.error(err);
    }
  });

  document.getElementById('btnDelete').addEventListener('click', async () => {
    if (!confirm('Confirmar eliminación del empleado?')) return;
    try {
      await API.borrarUser(elDNI.value);
      window.location.href = 'sistema.html';
    } catch (err) {
      alert('Error al eliminar el empleado');
      console.error(err);
    }
  });

  document.getElementById('btnBack').addEventListener('click', () => {
    localStorage.removeItem('editarEmpleado');
    window.location.href = 'sistema.html';
  });
});


