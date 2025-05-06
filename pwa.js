// Variables para manejar la instalación
let deferredPrompt;
const installContainer = document.createElement('div');
const installButton = document.createElement('button');

// Obtener la ruta base para GitHub Pages
const getBasePath = () => {
  // Obtener la ruta base del sitio (útil para GitHub Pages)
  const scriptPath = document.currentScript.src;
  const basePath = scriptPath.substring(0, scriptPath.lastIndexOf('/') + 1);
  return basePath;
};

// Estilos para el contenedor de instalación - Ahora en la parte superior
installContainer.className = 'install-container';
installContainer.style.display = 'none';
installContainer.style.position = 'fixed';
installContainer.style.top = '0';
installContainer.style.left = '0';
installContainer.style.right = '0';
installContainer.style.backgroundColor = '#00a99d';
installContainer.style.color = 'white';
installContainer.style.padding = '15px 20px';
installContainer.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
installContainer.style.zIndex = '1000';
installContainer.style.textAlign = 'center';
installContainer.style.width = '100%';

// Mensaje para dispositivos iOS
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if (isIOS) {
  installContainer.innerHTML = `
    <p style="margin-bottom: 10px;">¿Deseas instalar Barbería Renovados en tu dispositivo?</p>
    <p style="font-size: 0.9rem; margin-bottom: 15px;">Toca <strong>Compartir</strong> <span style="font-size: 1.2rem;">↑</span> y luego <strong>"Añadir a Pantalla de Inicio"</strong></p>
    <button id="closeInstallPrompt" style="background: white; color: #00a99d; border: none; padding: 8px 15px; border-radius: 5px; font-weight: bold; cursor: pointer;">Entendido</button>
  `;
  
  // Mostrar mensaje para iOS inmediatamente
  document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya se mostró el prompt recientemente
    const lastPrompt = localStorage.getItem('installPromptDismissed');
    const now = Date.now();
    
    // Si no se ha mostrado o han pasado más de 1 día
    if (!lastPrompt || (now - parseInt(lastPrompt)) > 24 * 60 * 60 * 1000) {
      document.body.appendChild(installContainer);
      installContainer.style.display = 'block';
    }
  });
  
  // Cerrar el mensaje
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'closeInstallPrompt') {
      installContainer.style.display = 'none';
      // Guardar en localStorage para no mostrar de nuevo por un tiempo
      localStorage.setItem('installPromptDismissed', Date.now().toString());
    }
  });
} else {
  // Para otros dispositivos (Chrome, Edge, etc.)
  const installText = document.createElement('p');
  installText.textContent = '¿Deseas instalar Barbería Renovados en tu dispositivo?';
  installText.style.marginBottom = '10px';
  installText.style.marginRight = '10px';
  
  installButton.textContent = 'Instalar';
  installButton.style.backgroundColor = 'white';
  installButton.style.color = '#00a99d';
  installButton.style.border = 'none';
  installButton.style.padding = '8px 15px';
  installButton.style.borderRadius = '5px';
  installButton.style.fontWeight = 'bold';
  installButton.style.cursor = 'pointer';
  
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'center';
  buttonContainer.style.gap = '10px';
  
  // Agregar botón para cerrar
  const closeButton = document.createElement('button');
  closeButton.textContent = 'No, gracias';
  closeButton.style.backgroundColor = 'transparent';
  closeButton.style.border = '1px solid white';
  closeButton.style.color = 'white';
  closeButton.style.padding = '8px 15px';
  closeButton.style.borderRadius = '5px';
  closeButton.style.fontWeight = 'bold';
  closeButton.style.cursor = 'pointer';
  
  buttonContainer.appendChild(installButton);
  buttonContainer.appendChild(closeButton);
  
  const contentContainer = document.createElement('div');
  contentContainer.style.display = 'flex';
  contentContainer.style.alignItems = 'center';
  contentContainer.style.justifyContent = 'center';
  contentContainer.style.flexWrap = 'wrap';
  
  contentContainer.appendChild(installText);
  contentContainer.appendChild(buttonContainer);
  
  installContainer.appendChild(contentContainer);
  
  // Mostrar el banner de instalación inmediatamente para pruebas
  // Esto es útil para depurar en GitHub Pages
  document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya se mostró el prompt recientemente
    const lastPrompt = localStorage.getItem('installPromptDismissed');
    const now = Date.now();
    
    // Si no se ha mostrado o han pasado más de 1 día
    if (!lastPrompt || (now - parseInt(lastPrompt)) > 24 * 60 * 60 * 1000) {
      // Mostrar el banner de instalación después de 2 segundos
      setTimeout(() => {
        document.body.appendChild(installContainer);
        installContainer.style.display = 'block';
        console.log('Banner de instalación mostrado manualmente');
      }, 2000);
    }
  });
  
  // Capturar el evento beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('Evento beforeinstallprompt capturado');
    // Prevenir que Chrome muestre la mini-infobar
    e.preventDefault();
    // Guardar el evento para usarlo después
    deferredPrompt = e;
    
    // Verificar si ya se mostró el prompt recientemente
    const lastPrompt = localStorage.getItem('installPromptDismissed');
    const now = Date.now();
    
    // Si no se ha mostrado o han pasado más de 1 día
    if (!lastPrompt || (now - parseInt(lastPrompt)) > 24 * 60 * 60 * 1000) {
      // Mostrar nuestro propio botón de instalación inmediatamente
      document.body.appendChild(installContainer);
      installContainer.style.display = 'block';
      console.log('Banner de instalación mostrado por evento beforeinstallprompt');
    }
  });
  
  // Manejar el clic en el botón de instalación
  installButton.addEventListener('click', async () => {
    console.log('Botón de instalación clickeado');
    
    if (deferredPrompt) {
      console.log('Mostrando prompt de instalación nativo');
      // Mostrar el prompt de instalación
      deferredPrompt.prompt();
      
      // Esperar a que el usuario responda
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Usuario eligió: ${outcome}`);
      
      // Limpiar la variable deferredPrompt
      deferredPrompt = null;
    } else {
      console.log('No hay prompt de instalación disponible');
      // Si no hay prompt disponible, mostrar instrucciones manuales
      alert('Para instalar la aplicación: \n1. Abre el menú de tu navegador (tres puntos en la esquina superior derecha)\n2. Selecciona "Instalar aplicación" o "Añadir a la pantalla de inicio"');
    }
    
    // Ocultar el contenedor
    installContainer.style.display = 'none';
    
    // Guardar en localStorage que se mostró el prompt
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  });
  
  // Manejar el clic en el botón de cerrar
  closeButton.addEventListener('click', () => {
    console.log('Botón de cerrar clickeado');
    installContainer.style.display = 'none';
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  });
}

// Registrar el Service Worker con ruta relativa para GitHub Pages
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Usar ruta relativa para el service worker
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('Service Worker registrado con éxito:', registration.scope);
      })
      .catch(error => {
        console.log('Error al registrar el Service Worker:', error);
      });
  });
}

// Verificar si la PWA ya está instalada
window.addEventListener('appinstalled', (evt) => {
  console.log('La aplicación fue instalada con éxito!');
  // Ocultar el banner de instalación si está visible
  installContainer.style.display = 'none';
});

// Función para verificar si la aplicación ya está instalada
function isPWAInstalled() {
  // Verificar si está en modo standalone (instalada)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('La aplicación ya está instalada');
    return true;
  }
  // Verificar si está en modo fullscreen (otra forma de instalación)
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    console.log('La aplicación ya está instalada en modo fullscreen');
    return true;
  }
  // Verificar si está en modo minimal-ui (otra forma de instalación en algunos dispositivos)
  if (window.matchMedia('(display-mode: minimal-ui)').matches) {
    console.log('La aplicación ya está instalada en modo minimal-ui');
    return true;
  }
  
  // Para iOS
  if (isIOS && window.navigator.standalone === true) {
    console.log('La aplicación ya está instalada en iOS');
    return true;
  }
  
  console.log('La aplicación NO está instalada');
  return false;
}

// Si la aplicación ya está instalada, no mostrar el banner
if (isPWAInstalled()) {
  console.log('No se mostrará el banner porque la aplicación ya está instalada');
} else {
  console.log('La aplicación no está instalada, se puede mostrar el banner');
}