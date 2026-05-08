// script.js
document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCustomCursor();
    fetchGitHubProjects();
    initNavbarHideOnScroll();
});

/* ==========================
   Scroll Reveal
========================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });
}

/* ==========================
   Custom Cursor
========================== */
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    
    if (!cursor || !follower) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant cursor
        cursor.style.transform = `translate3d(${mouseX - 8}px, ${mouseY - 8}px, 0)`;
    });

    // Smooth follower loop
    function loop() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
    }
    loop();

    // Hover effects for interactive elements
    const setupHoverEffects = () => {
        const interactables = document.querySelectorAll('a, button, .bento-card, .project-card');
        interactables.forEach(el => {
            if (el.dataset.cursorHover) return;
            el.dataset.cursorHover = 'true';
            
            el.addEventListener('mouseenter', () => {
                follower.style.width = '64px';
                follower.style.height = '64px';
                follower.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                follower.style.borderColor = 'transparent';
            });
            el.addEventListener('mouseleave', () => {
                follower.style.width = '40px';
                follower.style.height = '40px';
                follower.style.backgroundColor = 'transparent';
                follower.style.borderColor = '#8b5cf6';
            });
        });
    };
    
    setupHoverEffects();
    // Expose for dynamic elements
    window.setupHoverEffects = setupHoverEffects;
}

/* ==========================
   Hide Navbar on scroll down
========================== */
function initNavbarHideOnScroll() {
    let lastScrollY = window.scrollY;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            if (window.scrollY > lastScrollY) {
                // Scrolling down - hide
                navbar.style.transform = 'translate(-50%, -150%)';
            } else {
                // Scrolling up - show
                navbar.style.transform = 'translate(-50%, 0)';
            }
        } else {
             navbar.style.transform = 'translate(-50%, 0)';
        }
        lastScrollY = window.scrollY;
    });
}

/* ==========================
   Fetch GitHub Projects
========================== */
async function fetchGitHubProjects() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    try {
        const username = 'thonepanya';
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=4`);
        
        if (!response.ok) throw new Error('Failed to fetch repos');
        
        const repos = await response.json();
        grid.innerHTML = '';
        
        if (repos.length === 0) {
            grid.innerHTML = '<p class="text-muted">No public repositories found.</p>';
            return;
        }

        repos.forEach((repo, index) => {
            const delay = index * 100;
            const ogImageUrl = `https://opengraph.githubassets.com/1/${username}/${repo.name}`;
            
            const cardHTML = `
                <a href="${repo.html_url}" target="_blank" class="group project-card bg-surface rounded-3xl overflow-hidden border border-border hover:border-accent/50 transition-colors block reveal" style="transition-delay: ${delay}ms;">
                    <div class="h-64 overflow-hidden relative border-b border-border">
                        <img src="${ogImageUrl}" alt="${repo.name}" class="w-full h-full object-cover project-card-img opacity-60 group-hover:opacity-100">
                        <div class="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500"></div>
                        
                        <div class="absolute top-6 right-6 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-10 shadow-lg">
                            <i data-lucide="arrow-up-right" class="w-6 h-6"></i>
                        </div>
                    </div>
                    <div class="p-8 md:p-10">
                        <div class="flex justify-between items-start mb-4">
                            <h3 class="font-display text-3xl font-bold text-white group-hover:text-accent transition-colors line-clamp-1">${repo.name.replace(/-/g, ' ')}</h3>
                            <div class="flex items-center gap-1 text-accent text-sm font-bold bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
                                <i data-lucide="star" class="w-4 h-4"></i> ${repo.stargazers_count}
                            </div>
                        </div>
                        <p class="text-muted line-clamp-2 h-12 mb-8 text-lg leading-relaxed">${repo.description || "No description provided."}</p>
                        
                        <div class="flex flex-wrap items-center gap-2">
                            ${repo.language ? `<span class="px-4 py-1.5 rounded-full border border-border text-sm font-medium text-white bg-white/5">${repo.language}</span>` : ''}
                        </div>
                    </div>
                </a>
            `;
            grid.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Re-init icons and scroll reveal for new elements
        if (window.lucide) {
            window.lucide.createIcons();
        }
        initScrollReveal();
        
        // Re-init hover effects
        if (window.setupHoverEffects) {
             window.setupHoverEffects();
        }

    } catch (error) {
        console.error("Failed to fetch GitHub projects:", error);
        grid.innerHTML = '<p class="text-red-500 bg-red-500/10 p-4 rounded-xl">Error loading projects. Please check console.</p>';
    }
}