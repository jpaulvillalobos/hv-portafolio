/**
 * MOTOR DE INTERACTIVIDAD COMPLETO
 * Controla: Modo Claro/Oscuro, Menú Hamburguesa Móvil,
 * Tarjetas Desplegables, Animaciones por Scroll y Contadores Numéricos.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. MANEJO DE MODO OSCURO / CLARO
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'light') themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    });

    // ==========================================================================
    // 2. MENÚ HAMBURGUESA RESPONSIVO MÓVIL
    // ==========================================================================
    const menuToggle = document.getElementById('mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    const individualLinks = document.querySelectorAll('.nav-link');

    // Abre/Cierra menú al dar clic en la hamburguesa
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    // Cierra el menú al hacer clic en cualquier enlace interno (para que no tape el destino)
    individualLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

    // ==========================================================================
    // 3. TARJETAS DE EXPERIENCIA LABORAL DESPLEGABLES (ACCORDION)
    // ==========================================================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            
            // Alterna la clase active para expandir o colapsar el contenido mediante CSS
            item.classList.toggle('active');
        });
    });

    // ==========================================================================
    // 4. ANIMACIÓN DINÁMICA DE CONTADORES NUMÉRICOS
    // ==========================================================================
    const startCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 60; // Entre menor número, más rápido sube el contador

        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const currentText = counter.innerText.replace('+', '').replace('%', '');
                const count = +currentText;

                // Definimos el incremento basado en la meta
                const increment = Math.ceil(target / speed);

                if (count < target) {
                    const nextValue = count + increment;
                    // Mantenemos los símbolos visuales (+ o %) correspondientes
                    if (target === 5 || target === 100) {
                        counter.innerText = `+${nextValue > target ? target : nextValue}`;
                    } else if (target === 99) {
                        counter.innerText = `${nextValue > target ? target : nextValue}%`;
                    }
                    setTimeout(updateCount, 25);
                }
            };
            updateCount();
        });
    };

    // ==========================================================================
    // 5. EFECTO DE ANIMACIÓN DE ENTRADA POR SCROLL (INTERSECTION OBSERVER)
    // ==========================================================================
    const animatedSections = document.querySelectorAll('.scroll-animate');
    let countersFired = false;

    const observerOptions = {
        root: null, // Usa la pantalla del navegador como marco de referencia
        threshold: 0.15 // Dispara la acción cuando el 15% de la sección es visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear'); // Inyecta la clase CSS de aparición suave
                
                // Si la sección visible es la de estadísticas y no se ha disparado, arranca los contadores
                if (entry.target.id === 'stats' && !countersFired) {
                    startCounters();
                    countersFired = true;
                }
                
                observer.unobserve(entry.target); // Deja de vigilar la sección una vez ya apareció
            }
        });
    }, observerOptions);

    // Registramos todas las secciones marcadas para animarse en el vigilante
    animatedSections.forEach(section => {
        sectionObserver.observe(section);
    });
// ==========================================================================
    // 6. CONTROLADORES INDEPENDIENTES PARA EL SCROLL DE FOTOS (SLIDER)
    // ==========================================================================
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        // Buscamos los elementos del slider exclusivamente DENTRO de esta tarjeta de proyecto
        const slider = card.querySelector('.slider');
        const nextBtn = card.querySelector('.slider-btn.next');
        const prevBtn = card.querySelector('.slider-btn.prev');

        // Validamos que existan antes de asignar listeners (Previene errores si una tarjeta no lleva fotos)
        if (slider && nextBtn && prevBtn) {
            
            nextBtn.addEventListener('click', () => {
                // Obtenemos el ancho exacto que está ocupando el marco en este instante
                const widthSlide = slider.clientWidth;
                
                // Si llegamos al final del scroll, regresa al inicio (Foto 1), sino avanza una foto
                if (slider.scrollLeft + widthSlide >= slider.scrollWidth - 5) {
                    slider.scrollLeft = 0;
                } else {
                    slider.scrollLeft += widthSlide;
                }
            });

            prevBtn.addEventListener('click', () => {
                const widthSlide = slider.clientWidth;
                
                // Si está al principio de todo y da atrás, salta automáticamente a la última foto
                if (slider.scrollLeft <= 0) {
                    slider.scrollLeft = slider.scrollWidth;
                } else {
                    slider.scrollLeft -= widthSlide;
                }
            });
        }
    });
});