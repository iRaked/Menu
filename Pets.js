//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. SLIDER DEL HEADER
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const slider = document.querySelector('.slider-derecho');

function rotarSlider() {
    if (!slider) return;
    let items = Array.from(slider.querySelectorAll('.square-box'));
    if (items.length < 2) return;
    
    // Quitar 'active' del centro actual
    items[1].querySelector('.item').classList.remove('active');
    
    // Mover el último elemento al inicio (rotación)
    slider.prepend(items[items.length - 1]);
    
    // Marcar el nuevo centro como 'active'
    let newItems = Array.from(slider.querySelectorAll('.square-box'));
    newItems[1].querySelector('.item').classList.add('active');
}

setInterval(rotarSlider, 3000);

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. SISTEMA DE RATING CON PERSISTENCIA (LocalStorage)
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Genera una clave única y segura para localStorage basada en el título del producto
function getStorageKey(productTitle) {
    return `petRating_${productTitle.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
}

// Obtiene la calificación guardada. Si no existe, devuelve 1.0 por defecto
function getStoredRating(productTitle) {
    const key = getStorageKey(productTitle);
    const stored = localStorage.getItem(key);
    return stored ? parseFloat(stored) : 1.0; 
}

// Guarda la nueva calificación en el navegador del usuario
function saveRating(productTitle, value) {
    const key = getStorageKey(productTitle);
    localStorage.setItem(key, value.toFixed(1));
}

function updateStarDisplay(rating, container) {
    const stars = container.querySelectorAll('.star');
    const numberDisplay = container.querySelector('.number');
    const roundedRating = Math.round(rating);

    stars.forEach((star, index) => {
        star.classList.toggle('active', index < roundedRating);
    });

    if (numberDisplay) numberDisplay.textContent = parseFloat(rating).toFixed(1);
    container.setAttribute('data-rating', roundedRating);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Carga inicial: Lee de LocalStorage o usa 1.0 como base
    document.querySelectorAll('.card-rating').forEach(container => {
        const card = container.closest('.card');
        const title = card.querySelector('.card-title').textContent;
        
        const promedio = getStoredRating(title);
        updateStarDisplay(promedio, container);
    });

    // 2. Evento de click: Guarda en LocalStorage y actualiza la vista
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function() {
            const container = this.closest('.card-rating');
            const card = container.closest('.card');
            const title = card.querySelector('.card-title').textContent;
            const value = parseInt(this.getAttribute('data-value'));
            
            // Persistencia
            saveRating(title, value);
            
            // Actualización visual
            updateStarDisplay(value, container);
            console.log(`[LocalStorage] ✅ Guardado para "${title}":`, value);
        });
    });
});

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. WHATSAPP DINÁMICO Y CARD BACK
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Actualizado al número: +52 551568 9750
document.querySelectorAll('.card').forEach(card => {
    const btn = card.querySelector('.card-btn');
    const titulo = card.querySelector('.card-title').textContent;
    const mensaje = `Hola, quiero ordenar: ${encodeURIComponent(titulo)}`;
    btn.href = `https://wa.me/525515689750?text=${mensaje}`;

    // Toggle del card-back al hacer click (ignorando botones y estrellas)
    card.addEventListener('click', (e) => {
        if (e.target.closest('.card-btn') || e.target.closest('.card-rating')) {
            return;
        }
        card.classList.toggle('is-active');
    });
});

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. EFECTO FADE AL SCROLL (Infinito y Bidireccional)
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Se activa cuando el 15% de la sección es visible
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Si entra en pantalla, se desvanece hacia adentro (fade in)
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        } 
        // Si sale de pantalla, se desvanece hacia afuera (fade out)
        else {
            entry.target.classList.remove('is-visible');
        }
    });
}, observerOptions);

// Aplicar el observador a todas las secciones principales
document.querySelectorAll('.seccion-productos, .seccion-ubicacion, .seccion-reseñas, .seccion-about').forEach(section => {
    section.classList.add('fade-section');
    fadeObserver.observe(section);
});

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. CARRUSEL AUTOMATIZADO DE RESEÑAS
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const reseñas = document.querySelectorAll('.card-reseña');
let index = 0;

function mostrarReseña() {
    reseñas.forEach((card, i) => {
        card.classList.remove('active');
        if (i === index) card.classList.add('active');
    });
    index = (index + 1) % reseñas.length;
}

if (reseñas.length > 0) {
    setInterval(mostrarReseña, 4000);
}