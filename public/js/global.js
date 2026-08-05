(function () {
    // 1. Inject fonts and stylesheets dynamically
    function injectHeadElements() {
        if (!document.querySelector('link[href*="global.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/css/global.css?v=3.0';
            document.head.appendChild(link);
        }
        if (!document.querySelector('link[href*="Manrope"]')) {
            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap';
            document.head.appendChild(fontLink);
        }
    }

    // 2. Inject spotlight and noise overlay DOM elements
    function injectBackgroundFX() {
        if (!document.querySelector('.spotlight-bg')) {
            const spotlight = document.createElement('div');
            spotlight.className = 'spotlight-bg';
            document.body.prepend(spotlight);
        }
        if (!document.querySelector('.noise-overlay')) {
            const noise = document.createElement('div');
            noise.className = 'noise-overlay';
            document.body.prepend(noise);
        }
    }

    // 3. Track spotlight coordinates
    function setupSpotlightTracking() {
        document.addEventListener('mousemove', (e) => {
            document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
            document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
        });
    }

    // 4. Render unified global navbar across all AlgoDeck pages
    function renderGlobalNavbar() {
        const headerContainer = document.getElementById('app-header');
        if (!headerContainer) return;

        const path = window.location.pathname;
        const isHome = path === '/' || path.endsWith('/index.html') || path === '';
        const isDash = path.includes('dashboard');
        const isEdit = path.includes('editor');
        const isRoadmap = path.includes('roadmap');
        const isDocs = path.includes('docs');

        const userType = localStorage.getItem('algodeck_user_type');
        const username = localStorage.getItem('algodeck_username');
        const guestId = localStorage.getItem('algodeck_guest_id');

        let userLabel = 'Sign In / Guest';
        if (userType === 'user' && username) {
            userLabel = username;
        } else if (userType === 'guest' && guestId) {
            userLabel = 'Guest (' + guestId.substring(0, 6) + ')';
        }

        headerContainer.innerHTML = `
            <nav class="main-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1.1rem 2.5rem; background: rgba(10, 10, 12, 0.85); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); position: sticky; top: 0; z-index: 1000;">
                <a href="/index.html" class="header-brand" style="display: flex; align-items: center; gap: 10px; text-decoration: none;">
                    <i class="fa-solid fa-layer-group brand-logo" style="color: #ffffff; font-size: 1.6rem;"></i>
                    <span class="brand-name serif italic" style="font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 600; font-size: 1.65rem; color: #ffffff;">AlgoDeck</span>
                </a>
                <div class="header-nav" style="display: flex; align-items: center; gap: 20px;">
                    <a href="/index.html" class="nav-item ${isHome ? 'active' : ''}"><i class="fa-solid fa-house"></i> Home</a>
                    <a href="/dashboard.html" class="nav-item ${isDash ? 'active' : ''}"><i class="fa-solid fa-chart-simple"></i> Dashboard</a>
                    <a href="/editor.html" class="nav-item ${isEdit ? 'active' : ''}"><i class="fa-solid fa-terminal"></i> Playground</a>
                    <a href="/roadmap.html" class="nav-item ${isRoadmap ? 'active' : ''}"><i class="fa-solid fa-diagram-project"></i> Roadmap</a>
                    <a href="/docs.html" class="nav-item ${isDocs ? 'active' : ''}"><i class="fa-solid fa-book"></i> Docs</a>
                    <button class="btn-auth" onclick="if(typeof openAuthModal==='function'){openAuthModal()}else{location.href='/index.html'}" style="background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03)); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.2); padding: 6px 16px; border-radius: 9999px; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-user-check"></i> <span id="nav-user-label">${userLabel}</span>
                    </button>
                </div>
            </nav>
        `;
    }

    // Expose globally
    window.renderGlobalNavbar = renderGlobalNavbar;
    window.renderHeader = renderGlobalNavbar;

    function init() {
        injectHeadElements();
        injectBackgroundFX();
        setupSpotlightTracking();
        renderGlobalNavbar();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
