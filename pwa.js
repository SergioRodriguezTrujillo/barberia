// Variables para manejar la instalación
let deferredPrompt;
const installContainer = document.createElement('div');
const installButton = document.createElement('button');

// Estilos para el contenedor de instalación
installContainer.className = 'install-container';
installContainer.style.display = 'none';
installContainer.style.position = 'fixed';
installContainer.style.bottom = '20px';
installContainer.style.left = '50%';
installContainer.style.transform = 'translateX(-50%)';
installContainer.style.backgroundColor = '#00a99d';
installContainer.style.color = 'white';
installContainer.style.padding = '15px 20px';
installContainer.style.borderRadius = '10px';
installContainer.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
installContainer.style.zIndex = '1000';
installContainer.style.textAlign = 'center';
installContainer.style.maxWidth = '90%';
installContainer.style.width = '350px';

// Mensaje para dispositivos iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if (isIOS) {
  installContainer.innerHTML = `
    <p style="margin-bottom: 10px;">¡Instala esta aplicación en tu dispositivo!</p>
    <p style="font-size: 0.9rem; margin-bottom: 15px;">Toca <strong>Compartir</strong> <span style="font-size: 1.2rem;">↑</span> y luego <strong>"Añadir a Pantalla de Inicio"</strong></p>
    <button id="closeInstallPrompt" style="background: white; color: #00a99d; border: none; padding: 8px 15px; border-radius: 5px; font-weight: bold; cursor: pointer;">Entendido</button>
  `;
  
  // Mostrar mensaje para iOS después de 3 segundos
  setTimeout(() => {
    document.body.appendChild(installContainer);
    installContainer.style.display = 'block';
  }, 3000);
  
  // Cerrar el mensaje
  document.getElementById('closeInstallPrompt').addEventListener('click', () => {
    installContainer.style.display = 'none';
    // Guardar en localStorage para no mostrar de nuevo por un tiempo
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  });
} else {
  // Para otros dispositivos (Chrome, Edge, etc.)
  installButton.textContent = 'Instalar aplicación';
  installButton.style.backgroundColor = 'white';
  installButton.style.color = '#00a99d';
  installButton.style.border = 'none';
  installButton.style.padding = '8px 15px';
  installButton.style.borderRadius = '5px';
  installButton.style.fontWeight = 'bold';
  installButton.style.cursor = 'pointer';
  installButton.style.marginTop = '10px';
  
  const installText = document.createElement('p');
  installText.textContent = '¡Instala nuestra aplicación para acceder más rápido!';
  installText.style.marginBottom = '10px';
  
  installContainer.appendChild(installText);
  installContainer.appendChild(installButton);
  
  // Capturar el evento beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevenir que Chrome muestre la mini-infobar
    e.preventDefault();
    // Guardar el evento para usarlo después
    deferredPrompt = e;
    
    // Verificar si ya se mostró el prompt recientemente
    const lastPrompt = localStorage.getItem('installPromptDismissed');
    const now = Date.now();
    
    // Si no se ha mostrado o han pasado más de 3 días
    if (!lastPrompt || (now - parseInt(lastPrompt)) > 3 * 24 * 60 * 60 * 1000) {
      // Mostrar nuestro propio botón de instalación
      setTimeout(() => {
        document.body.appendChild(installContainer);
        installContainer.style.display = 'block';
      }, 3000);
    }
  });
  
  // Manejar el clic en el botón de instalación
  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    // Mostrar el prompt de instalación
    deferredPrompt.prompt();
    
    // Esperar a que el usuario responda
    const { outcome } = await deferredPrompt.userChoice;
    
    // Limpiar la variable deferredPrompt
    deferredPrompt = null;
    
    // Ocultar el contenedor
    installContainer.style.display = 'none';
    
    // Guardar en localStorage que se mostró el prompt
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  });
  
  // Agregar botón para cerrar
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '5px';
  closeButton.style.right = '10px';
  closeButton.style.background = 'transparent';
  closeButton.style.border = 'none';
  closeButton.style.color = 'white';
  closeButton.style.fontSize = '20px';
  closeButton.style.cursor = 'pointer';
  
  closeButton.addEventListener('click', () => {
    installContainer.style.display = 'none';
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  });
  
  installContainer.appendChild(closeButton);
  installContainer.style.position = 'relative';
}

// Registrar el Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registrado con éxito:', registration.scope);
      })
      .catch(error => {
        console.log('Error al registrar el Service Worker:', error);
      });
  });
}