function showLoadingBar() {
  const loadingBar = document.getElementById('loading-bar');
  const loadingProgress = document.getElementById('loading-progress');

  // Mostrar la barra de carga
  loadingBar.style.display = 'block';

  // Redirigir a sistema.html después de 2 segundos (duración de la animación)
  setTimeout(() => {
    window.location.href = 'sistema.html';
  }, 2000);
}