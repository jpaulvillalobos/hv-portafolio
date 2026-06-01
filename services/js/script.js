/**
 * LOBOLINK SERVICES - Gestión Dinámica de Servicios (Vanilla JS + JSON)
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Cargar los servicios desde el archivo JSON local en la carpeta /services/js/
    fetch('/services/js/services.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el catálogo de servicios");
            }
            return response.json();
        })
        .then(servicios => {
            renderServices(servicios);
            initCategoryFilters();
            initScrollAnimations();
            initCardGlowEffect();
        })
        .catch(error => console.error("Error en la plataforma LOBOLINK SERVICES:", error));
});

/* ==========================================================================
   RENDERIZAR TARJETAS DESDE JSON
   ========================================================================== */
function renderServices(servicios) {
    const shopGrid = document.getElementById("shop-grid");
    shopGrid.innerHTML = ""; // Limpiar el contenedor por seguridad

    servicios.forEach(servicio => {
        const card = document.createElement("article");
        card.classList.add("product-card");
        card.setAttribute("data-category", servicio.category);

        // Estructura HTML adaptada para servicios interactivos y contacto directo
        card.innerHTML = `
            <div class="product-badge">${servicio.badge}</div>
            <div class="product-image">
                <i class="${servicio.iconClass}"></i>
            </div>
            <div class="product-content">
                <h3 class="product-title">${servicio.title}</h3>
                <p class="product-description">${servicio.description}</p>
                <div class="product-meta">
                    <span class="product-price">${servicio.price}</span>
                    <span class="product-rating"><i class="fas fa-star"></i> ${servicio.rating}</span>
                </div>
                <a href="${servicio.link}" target="_blank" class="buy-btn">
                    <i class="fab fa-whatsapp"></i> Cotizar por WhatsApp
                </a>
            </div>
        `;
        
        shopGrid.appendChild(card);
    });
}

/* ==========================================================================
   FILTRADO DINÁMICO DE SERVICIOS
   ========================================================================== */
function initCategoryFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const productCards = document.querySelectorAll(".product-card");
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const selectedCategory = button.getAttribute("data-category");

            productCards.forEach(card => {
                const cardCategory = card.getAttribute("data-category");

                if (selectedCategory === "all" || cardCategory === selectedCategory) {
                    card.style.display = "flex";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0) scale(1)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "translateY(20px) scale(0.95)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 300);
                }
            });
        });
    });
}

/* ==========================================================================
   ANIMACIÓN DE ENTRADA AL HACER SCROLL (Intersection Observer)
   ========================================================================== */
function initScrollAnimations() {
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s, background-color 0.3s";
    });

    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px"
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }, index * 80); // Animación secuencial
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    productCards.forEach(card => cardObserver.observe(card));
}

/* ==========================================================================
   EFECTO DINÁMICO DE REFLEJO DE MOUSE (Adaptado a Naranja LOBOLINK SERVICES)
   ========================================================================== */
function initCardGlowEffect() {
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Brillo modificado a un Naranja sutil corporativo (rgba con 255, 102, 0)
            card.style.background = `
                radial-gradient(
                    circle 140px at ${x}px ${y}px, 
                    rgba(255, 102, 0, 0.08), 
                    var(--bg-card) 100%
                )
            `;
        });

        card.addEventListener("mouseleave", () => {
            card.style.background = "var(--bg-card)";
        });
    });
}