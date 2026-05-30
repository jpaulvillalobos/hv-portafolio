/**
 * JP Tienda Técnica - Lógica de Interacción y Animaciones
 * Estructura de datos e interfaz comercial independiente.
 */

document.addEventListener("DOMContentLoaded", () => {
    initCategoryFilters();
    initScrollAnimations();
    initCardGlowEffect();
});

/* ==========================================================================
   1. FILTRADO DINÁMICO DE PRODUCTOS
   ========================================================================== */
function initCategoryFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const productCards = document.querySelectorAll(".product-card");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // 1. Cambiar estado activo en los botones
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const selectedCategory = button.getAttribute("data-category");

            // 2. Filtrar las tarjetas con una animación suave
            productCards.forEach(card => {
                const cardCategory = card.getAttribute("data-category");

                if (selectedCategory === "all" || cardCategory === selectedCategory) {
                    // Mostrar tarjeta
                    card.style.display = "flex";
                    // Pequeño delay para que el navegador aplique el display antes de la animación
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0) scale(1)";
                    }, 50);
                } else {
                    // Ocultar tarjeta aplicando transición
                    card.style.opacity = "0";
                    card.style.transform = "translateY(20px) scale(0.95)";
                    // Esperamos a que termine la transición CSS para quitar el espacio físico
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 300); // Alineado con los 0.3s del CSS
                }
            });
        });
    });
}

/* ==========================================================================
   2. ANIMACIÓN DE ENTRADA AL HACER SCROLL (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
    const productCards = document.querySelectorAll(".product-card");

    // Configuración inicial por código para no romper el CSS base si no hay JS
    productCards.forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s, background-color 0.3s";
    });

    const observerOptions = {
        root: null, // Usa el viewport del navegador
        threshold: 0.15, // Se activa cuando el 15% de la tarjeta es visible
        rootMargin: "0px 0px -50px 0px"
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Añadimos un pequeño retraso escalonado (stagger effect) según el orden físico
                setTimeout(() => {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }, index * 100); // 100ms de diferencia entre cada tarjeta consecutiva
                
                // Dejamos de observar la tarjeta una vez que ya apareció
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    productCards.forEach(card => cardObserver.observe(card));
}

/* ==========================================================================
   3. EFECTO DINÁMICO DE REFLEJO DE MOUSE (Tech Glow)
   ========================================================================== */
function initCardGlowEffect() {
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            // Calcular la posición del cursor relativa a la tarjeta (en píxeles)
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Inyectamos un gradiente de fondo dinámico que sigue al mouse sólo en el hover
            card.style.background = `
                radial-gradient(
                    circle 120px at ${x}px ${y}px, 
                    rgba(255, 90, 0, 0.12), 
                    var(--bg-card) 100%
                )
            `;
        });

        // Al salir el mouse, restauramos el fondo gris sólido original limpiamente
        card.addEventListener("mouseleave", () => {
            card.style.background = "var(--bg-card)";
        });
    });
}