/**
 * LOBOLINK SHOP - Gestión Dinámica de Productos (Vanilla JS + JSON)
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Cargar los productos desde el archivo JSON local
    fetch('js/productos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el catálogo de productos");
            }
            return response.json();
        })
        .then(productos => {
            renderProducts(productos);
            initCategoryFilters();
            initScrollAnimations();
            initCardGlowEffect();
        })
        .catch(error => console.error("Error en la tienda LOBOLINK:", error));
});

/* ==========================================================================
   RENDERIZAR TARJETAS DESDE JSON
   ========================================================================== */
function renderProducts(productos) {
    const shopGrid = document.getElementById("shop-grid");
    shopGrid.innerHTML = ""; // Limpiar por seguridad

    productos.forEach(producto => {
        const card = document.createElement("article");
        card.classList.add("product-card");
        card.setAttribute("data-category", producto.category);

        // Estructura HTML exacta que diseñamos en el CSS
        card.innerHTML = `
            <div class="product-badge">${producto.badge}</div>
            <div class="product-image">
                <i class="${producto.iconClass}"></i>
            </div>
            <div class="product-content">
                <h3 class="product-title">${producto.title}</h3>
                <p class="product-description">${producto.description}</p>
                <div class="product-meta">
                    <span class="product-price">${producto.price}</span>
                    <span class="product-rating"><i class="fas fa-star"></i> ${producto.rating}</span>
                </div>
                <a href="${producto.link}" target="_blank" class="buy-btn">
                    <i class="fas fa-shopping-cart"></i> Adquirir Recurso
                </a>
            </div>
        `;
        
        shopGrid.appendChild(card);
    });
}

/* ==========================================================================
   FILTRADO DINÁMICO DE PRODUCTOS (Mantenemos tu lógica previa)
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
                }, index * 80); // Animación escalonada
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    productCards.forEach(card => cardObserver.observe(card));
}

/* ==========================================================================
   EFECTO DINÁMICO DE REFLEJO DE MOUSE (Actualizado a Cian de LOBOLINK)
   ========================================================================== */
function initCardGlowEffect() {
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Brillo modificado a Cian sutil (rgba de 0, 255, 255)
            card.style.background = `
                radial-gradient(
                    circle 140px at ${x}px ${y}px, 
                    rgba(0, 255, 255, 0.08), 
                    var(--bg-card) 100%
                )
            `;
        });

        card.addEventListener("mouseleave", () => {
            card.style.background = "var(--bg-card)";
        });
    });
}