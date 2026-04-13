// Lógica de UI - e:\proyectos\portafolio\js\main.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Manejo de Tema (Dark/Light Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleBtnMobile = document.getElementById('theme-toggle-mobile');
    const htmlElement = document.documentElement;

    const updateIcon = () => {
        const isDark = htmlElement.classList.contains('dark');
        const iconSvgContent = isDark
            ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />'
            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';

        document.querySelectorAll('.theme-icon').forEach(icon => {
            icon.innerHTML = iconSvgContent;
        });
    };

    const toggleTheme = () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        updateIcon();
        updateNavbarBackground();
    };

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (themeToggleBtnMobile) themeToggleBtnMobile.addEventListener('click', toggleTheme);
    updateIcon();

    // 2. Manejo del Menú Móvil
    const btnMobile = document.getElementById('mobile-menu-btn');
    const menuMobile = document.getElementById('mobile-menu');

    if (btnMobile) {
        btnMobile.addEventListener('click', () => menuMobile.classList.toggle('hidden'));
    }

    const mobileLinks = menuMobile ? menuMobile.querySelectorAll('a') : [];
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => menuMobile.classList.add('hidden'));
    });

    // 3. Animaciones al Scrollear (Intersection Observer)
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('show');
        });
    }, { root: null, rootMargin: '0px', threshold: 0.15 });

    document.querySelectorAll('.fade-up').forEach(el => scrollObserver.observe(el));

    // 4. Navbar dinámico al hacer scroll
    const navbar = document.getElementById('navbar');
    const getCssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    const updateNavbarBackground = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg');
            navbar.style.background = getCssVar('--color-glass-nav');
        } else {
            navbar.classList.remove('shadow-lg');
            navbar.style.background = getCssVar('--color-glass-bg');
        }
    };

    window.addEventListener('scroll', updateNavbarBackground);

    // =========================================================================
    // 4.5. EFECTO GLOW PREMIUM EN TARJETAS
    // =========================================================================
    const initGlowEffect = () => {
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            card.onmousemove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            };
        });
    };

    initGlowEffect(); // Inicializar para las tarjetas estáticas de la galería

    // =========================================================================
    // 5. SISTEMA DE BLOG: CARGA DE ARCHIVOS LOCALES (JSON + HTML)
    // =========================================================================

    const blogGrid = document.getElementById('blog-grid');
    const blogLoader = document.getElementById('blog-loader');
    const blogError = document.getElementById('blog-error');

    // Almacén global para los posts
    window.blogPostsData = [];

    const renderBlogCards = (data) => {
        window.blogPostsData = data;
        blogLoader.style.display = 'none';
        blogGrid.classList.remove('opacity-0');

        let fullHtml = '';
        data.forEach((post, index) => {
            fullHtml += `
                <article class="project-card group bg-brand-surface rounded-2xl overflow-hidden border border-brand-border cursor-pointer hover:border-brand-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col" onclick="openPostModal(${index})">
                    <div class="p-8 flex-1 flex flex-col">
                        <div class="mb-4 flex items-center justify-between">
                            <span class="px-2 py-1 text-xs font-bold rounded-md bg-brand-secondary/10 text-brand-secondary ring-1 ring-brand-secondary/20">${post.categoria}</span>
                            <div class="flex items-center gap-2 text-[10px] font-bold text-brand-muted uppercase">
                                <svg class="w-3 h-3 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                <span id="card-views-${index}">0</span>
                            </div>
                        </div>
                        <h4 class="text-xl font-heading font-bold text-brand-text mb-3 group-hover:text-brand-primary transition-colors">${post.titulo}</h4>
                        <p class="text-brand-muted text-sm mb-6 flex-1 opacity-90 leading-relaxed">${post.resumen}</p>
                        <div class="mt-auto text-sm font-semibold text-brand-primary flex items-center gap-2">
                            Leer Artículo 
                            <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                        </div>
                    </div>
                </article>
            `;
        });

        blogGrid.innerHTML = fullHtml;

        // Una vez que TODO el HTML está en el DOM, actualizamos los contadores de cada una
        data.forEach((post, index) => {
            updateCardViews(post.id, index);
        });

        // Re-inicializar el efecto glow para las nuevas tarjetas inyectadas del blog
        initGlowEffect();
    }

    // Credenciales de Supabase (Reemplazar con tus datos)
    const SUPABASE_URL = 'https://jqarujoosiauogetmhcb.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_QNJYdF9-ndthyOqf_tdrAw_2bzrsrJ9';

    const updateCardViews = (postId, index) => {
        fetch(`${SUPABASE_URL}/rest/v1/page_views?slug=eq.${postId}&select=view_count`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        })
            .then(res => res.json())
            .then(data => {
                const element = document.getElementById(`card-views-${index}`);
                if (element) element.textContent = data.length > 0 ? data[0].view_count : 0;
            })
            .catch(() => {
                const element = document.getElementById(`card-views-${index}`);
                if (element) element.textContent = localStorage.getItem(`count_${postId}`) || 0;
            });
    }

    if (blogGrid) {
        fetch('data/blog.json')
            .then(res => res.json())
            .then(data => renderBlogCards(data))
            .catch(() => {
                const fallbackData = [
                    { "id": "arquitecturas-serverless", "titulo": "Logrando Arquitecturas Serverless", "resumen": "Cómo construir sitios web potentes y rápidos sin necesidad de un servidor backend.", "categoria": "Desarrollo", "fecha": "12 Abr", "archivo": "posts/arquitecturas-serverless.html" },
                    { "id": "optimizacion-web", "titulo": "Optimización de Rendimiento", "resumen": "Técnicas esenciales para lograr una puntuación del 100% en Lighthouse.", "categoria": "Performance", "fecha": "10 Abr", "archivo": "posts/optimizacion-web.html" }
                ];
                renderBlogCards(fallbackData);
            });
    }

    const blogModal = document.getElementById('blog-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const modalWrapper = document.getElementById('blog-modal-content-wrapper');

    window.openPostModal = (index) => {
        const post = window.blogPostsData[index];
        if (!post) return;

        const bodyContent = document.getElementById('modal-post-body');
        const viewCountElement = document.getElementById('modal-post-views');

        bodyContent.innerHTML = '<p class="text-center py-10">Cargando contenido...</p>';
        viewCountElement.textContent = '...';
        document.getElementById('modal-post-title').textContent = post.titulo;
        document.getElementById('modal-post-date').textContent = post.fecha;

        // Lógica de Conteo Supabase
        const hasViewedKey = `viewed_${post.id}`;
        const mustIncrement = !localStorage.getItem(hasViewedKey);

        if (mustIncrement) {
            // Incrementar visita a través de RPC
            fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_page_view`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ page_slug: post.id })
            })
                .then(res => res.json())
                .then(val => {
                    viewCountElement.textContent = val;
                    localStorage.setItem(hasViewedKey, 'true');
                    localStorage.setItem(`count_${post.id}`, val);

                    const cardCounter = document.getElementById(`card-views-${index}`);
                    if (cardCounter) cardCounter.textContent = val;
                })
                .catch(err => console.error("Error al incrementar vistas:", err));
        } else {
            // Solo consultar
            fetch(`${SUPABASE_URL}/rest/v1/page_views?slug=eq.${post.id}&select=view_count`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    const val = data.length > 0 ? data[0].view_count : 0;
                    viewCountElement.textContent = val;
                });
        }

        // 2. Fetch del contenido HTML real
        fetch(post.archivo)
            .then(res => {
                if (!res.ok) throw new Error('No se pudo cargar el artículo');
                return res.text();
            })
            .then(html => {
                bodyContent.innerHTML = '<div class="leading-relaxed text-brand-text space-y-4">' + html + '</div>';
            })
            .catch(err => {
                // MEJORA: Si falla el fetch (modo file://), mostramos un contenido predefinido real del post
                const localFallbacks = {
                    "arquitecturas-serverless": `
                        <p class="mb-4">Construir aplicaciones <strong>Serverless</strong> permite que el flujo de trabajo se centre totalmente en la experiencia del usuario y en el código frontend.</p>
                        <h3 class="text-xl font-bold text-brand-primary mt-6 mb-2">Ventajas Principales</h3>
                        <ul class="list-disc pl-5 space-y-2 opacity-90">
                            <li>Escalabilidad Automática.</li>
                            <li>Cero Mantenimiento de servidores.</li>
                            <li>Costo reducido en plataformas como Netlify o GitHub.</li>
                        </ul>
                    `,
                    "optimizacion-web": `
                        <p class="mb-4">La velocidad no es solo un lujo, es un requisito. Los usuarios abandonan los sitios que tardan más de 3 segundos en cargar.</p>
                        <h3 class="text-xl font-bold text-brand-secondary mt-6 mb-2">Checklist clave</h3>
                        <p>Optimizar imágenes, minificar CSS/JS y usar Lazy Loading son los pilares de una web rápida.</p>
                    `
                };

                bodyContent.innerHTML = '<div class="leading-relaxed text-brand-text space-y-4">' + (localFallbacks[post.id] || "Contenido no disponible en modo local.") + '</div>';
            });

        // Ejecución de la Animación de Ingreso Modal
        blogModal.classList.remove('hidden');
        blogModal.classList.add('flex');
        setTimeout(() => {
            blogModal.classList.remove('opacity-0');
            modalWrapper.classList.remove('scale-95');
        }, 10);
        document.body.style.overflow = 'hidden';
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            blogModal.classList.add('opacity-0');
            modalWrapper.classList.add('scale-95');
            setTimeout(() => {
                blogModal.classList.add('hidden');
                blogModal.classList.remove('flex');
                document.body.style.overflow = 'auto'; // Restauramos el scroll principal
            }, 300); // 300ms idéntico a la duración CSS
        });
    }

    // Cerramos el artículo haciendo click en el espacio desenfocado (Backdrop)
    if (blogModal) {
        blogModal.addEventListener('click', (e) => {
            if (e.target === blogModal) closeBtn.click();
        });
    }
});
