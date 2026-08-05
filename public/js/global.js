(function () {
    // 1. Theme Management System (Dark / Light Mode)
    function getStoredTheme() {
        return localStorage.getItem('algodeck_theme') || 'dark';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (document.body) {
            document.body.setAttribute('data-theme', theme);
        }
        localStorage.setItem('algodeck_theme', theme);

        const themeBtn = document.getElementById('btn-theme-toggle');
        if (themeBtn) {
            themeBtn.innerHTML = theme === 'light'
                ? `<i class="fa-solid fa-sun" style="color: #f59e0b; font-size: 0.95rem;"></i>`
                : `<i class="fa-solid fa-moon" style="color: #a855f7; font-size: 0.95rem;"></i>`;
            themeBtn.title = `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`;
        }

        // Sync Monaco editor themes if initialized
        if (window.monacoEditor) {
            window.monacoEditor.updateOptions({ theme: theme === 'light' ? 'vs' : 'vs-dark' });
        }
        if (window.solutionEditor) {
            window.solutionEditor.updateOptions({ theme: theme === 'light' ? 'vs' : 'vs-dark' });
        }
    }

    function toggleTheme() {
        const currentTheme = getStoredTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    }

    // Expose globally
    window.applyTheme = applyTheme;
    window.toggleTheme = toggleTheme;

    // 2. Inject fonts and stylesheets dynamically
    function injectHeadElements() {
        if (!document.querySelector('link[href*="global.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/css/global.css?v=3.5';
            document.head.appendChild(link);
        }
        if (!document.querySelector('link[href*="Manrope"]')) {
            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap';
            document.head.appendChild(fontLink);
        }
    }

    // 3. Inject spotlight and noise overlay DOM elements
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

    // 4. Track spotlight coordinates
    function setupSpotlightTracking() {
        document.addEventListener('mousemove', (e) => {
            document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
            document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
        });
    }

    // 5. Render unified global navbar across all AlgoDeck pages
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

        const currentTheme = getStoredTheme();
        const themeIcon = currentTheme === 'light'
            ? `<i class="fa-solid fa-sun" style="color: #f59e0b; font-size: 0.95rem;"></i>`
            : `<i class="fa-solid fa-moon" style="color: #a855f7; font-size: 0.95rem;"></i>`;

        headerContainer.innerHTML = `
            <header class="main-header">
                <a href="/index.html" class="header-brand">
                    <i class="fa-solid fa-layer-group brand-logo"></i>
                    <span class="brand-name serif italic">AlgoDeck</span>
                </a>
                <nav class="header-nav">
                    <a href="/index.html" class="nav-item ${isHome ? 'active' : ''}"><i class="fa-solid fa-house"></i> Home</a>
                    <a href="/dashboard.html" class="nav-item ${isDash ? 'active' : ''}"><i class="fa-solid fa-chart-simple"></i> Dashboard</a>
                    <a href="/editor.html" class="nav-item ${isEdit ? 'active' : ''}"><i class="fa-solid fa-terminal"></i> Playground</a>
                    <a href="/roadmap.html" class="nav-item ${isRoadmap ? 'active' : ''}"><i class="fa-solid fa-diagram-project"></i> Roadmap</a>
                    <a href="/docs.html" class="nav-item ${isDocs ? 'active' : ''}"><i class="fa-solid fa-book"></i> Docs</a>
                    <button id="btn-theme-toggle" onclick="window.toggleTheme()" title="Toggle Light/Dark Theme" style="background: var(--bg-element); color: var(--nav-text); border: 1px solid var(--border); width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;">
                        ${themeIcon}
                    </button>
                    <button class="btn-auth" onclick="if(typeof openAuthModal==='function'){openAuthModal()}else{location.href='/index.html'}" style="background: var(--bg-element); color: var(--nav-text); border: 1px solid var(--border); padding: 7px 16px; border-radius: 9999px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;">
                        <i class="fa-solid fa-user-check"></i> <span id="nav-user-label">${userLabel}</span>
                    </button>
                </nav>
            </header>
        `;
    }

    // Expose navbar renderers
    window.renderGlobalNavbar = renderGlobalNavbar;
    window.renderHeader = renderGlobalNavbar;

    function init() {
        injectHeadElements();
        injectBackgroundFX();
        setupSpotlightTracking();
        applyTheme(getStoredTheme());
        renderGlobalNavbar();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
