/* function showLoadingBar() {
  const loadingBar = document.getElementById('loading-bar');
  const loadingProgress = document.getElementById('loading-progress');

  // Mostrar la barra de carga
  loadingBar.style.display = 'block';

  // Redirigir a sistema.html después de 2 segundos (duración de la animación)
  setTimeout(() => {
    window.location.href = 'inicio.html';
  }, 2000);
} */


document.querySelector('.login-box form').addEventListener('submit', function(e) {
  e.preventDefault(); 
  window.location.href = 'inicio.html'; 
});


