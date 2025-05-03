// Elementos del DOM
const menuToggle = document.querySelector('.menu-toggle');
const menuClose = document.querySelector('.menu-close');
const menu = document.querySelector('.menu');
const overlay = document.querySelector('.overlay');
const menuLinks = document.querySelectorAll('.menu-link');
const currentYearElement = document.getElementById('current-year');
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const modalCaption = document.getElementById('modal-caption');
const modalPrice = document.getElementById('modal-price');
const modalClose = document.querySelector('.modal-close');

// Establecer el año actual en el pie de página
currentYearElement.textContent = new Date().getFullYear();

// Función para abrir el menú
function openMenu() {
    menu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Evitar scroll cuando el menú está abierto
}

// Función para cerrar el menú
function closeMenu() {
    menu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Restaurar scroll
}

// Event listeners para abrir/cerrar el menú
menuToggle.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

// Cerrar el menú al hacer clic en un enlace
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
        
        // Resaltar el enlace activo
        menuLinks.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
    });
});

// Función para detectar la sección visible en la pantalla
function highlightActiveSection() {
    const sections = document.querySelectorAll('.gallery-section');
    
    // Si no hay secciones de galería (estamos en la página de inicio), salir
    if (sections.length === 0) return;
    
    // Obtener la posición de desplazamiento actual
    const scrollPosition = window.scrollY + 100; // Añadir offset para mejor detección
    
    // Comprobar qué sección está actualmente visible
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Resaltar el enlace correspondiente en el menú
            menuLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}` || link.getAttribute('href') === `galeria.html#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Event listener para detectar scroll y actualizar el enlace activo
window.addEventListener('scroll', highlightActiveSection);

// Inicializar la detección de sección activa al cargar la página
document.addEventListener('DOMContentLoaded', highlightActiveSection);

// Funcionalidad para abrir el modal al hacer clic en una imagen (solo si existen elementos de galería)
if (galleryItems.length > 0 && modal) {
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('.image-info h3')?.textContent || '';
            const price = this.querySelector('.image-info p')?.textContent || '';
            
            modalImg.src = img.src;
            modalCaption.textContent = title;
            modalPrice.textContent = price;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Evitar scroll cuando el modal está abierto
        });
    });

    // Cerrar el modal al hacer clic en la X
    modalClose.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restaurar scroll
    });

    // Cerrar el modal al hacer clic fuera de la imagen
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restaurar scroll
        }
    });

    // Cerrar el modal con la tecla Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restaurar scroll
        }
    });
}