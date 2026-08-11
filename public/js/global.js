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

    // Expose theme functions globally
    window.applyTheme = applyTheme;
    window.toggleTheme = toggleTheme;

    // 2. Global Auth / Guest Session Modal Management
    function injectGlobalAuthModal() {
        if (document.getElementById('auth-modal')) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'auth-modal';
        modal.onclick = (e) => {
            if (e.target === modal) window.closeAuthModal();
        };

        const userType = localStorage.getItem('algodeck_user_type') || 'guest';
        const username = localStorage.getItem('algodeck_username') || '';
        let guestId = localStorage.getItem('algodeck_guest_id');
        if (!guestId) {
            guestId = 'guest_' + Math.random().toString(36).substring(2, 6);
            localStorage.setItem('algodeck_guest_id', guestId);
            localStorage.setItem('algodeck_user_type', 'guest');
        }

        modal.innerHTML = `
            <div class="modal-content" style="background: var(--bg-surface); border: 1px solid var(--border); border-radius: 16px; width: 90%; max-width: 440px; padding: 32px; color: var(--text-main); position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
                <button onclick="window.closeAuthModal()" style="position: absolute; top: 16px; right: 16px; background: transparent; border: none; color: var(--text-muted); font-size: 1.2rem; cursor: pointer;">&times;</button>
                <div style="text-align: center; margin-bottom: 24px;">
                    <i class="fa-solid fa-user-shield" style="font-size: 2.2rem; color: var(--primary); margin-bottom: 12px;"></i>
                    <h2 style="font-size: 1.4rem; font-weight: 800; margin: 0 0 6px 0; color: var(--text-main);">AlgoDeck Session Management</h2>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">Local-first isolate session & cloud authentication</p>
                </div>
                <div style="background: var(--bg-element); border: 1px solid var(--border); padding: 14px; border-radius: 10px; margin-bottom: 20px; font-size: 0.85rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                        <span style="color: var(--text-muted);">Current Mode:</span>
                        <strong style="color: var(--text-main); text-transform: uppercase;">${userType}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: var(--text-muted);">Session Identifier:</span>
                        <code style="color: var(--success); font-weight: 700;">${userType === 'user' ? username : guestId}</code>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <input type="text" id="modal-username-input" placeholder="Enter Username (e.g. Anmol)" value="${username}" style="padding: 12px 16px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg-element); color: var(--text-main); font-size: 0.9rem;">
                    <button onclick="window.saveAuthSession('user')" style="background: linear-gradient(135deg, #ffffff, #aaaaaa); color: #000000; font-weight: 800; padding: 12px; border-radius: 8px; border: none; cursor: pointer; font-size: 0.9rem;">Sign In / Switch User</button>
                    <button onclick="window.saveAuthSession('guest')" style="background: transparent; color: var(--text-muted); font-weight: 600; padding: 10px; border-radius: 8px; border: 1px solid var(--border); cursor: pointer; font-size: 0.85rem;">Continue as Guest</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    function openAuthModal() {
        let modal = document.getElementById('auth-modal');
        if (!modal) {
            injectGlobalAuthModal();
            modal = document.getElementById('auth-modal');
        }
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('active');
        }
    }

    function closeAuthModal(e) {
        if (e && e.target !== e.currentTarget && !e.target.matches('button')) return;
        const modal = document.getElementById('auth-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
        }
    }

    function saveAuthSession(type) {
        if (type === 'user') {
            const input = document.getElementById('modal-username-input');
            const val = input ? input.value.trim() : '';
            if (!val) {
                alert("Please enter a username.");
                return;
            }
            localStorage.setItem('algodeck_user_type', 'user');
            localStorage.setItem('algodeck_username', val);
        } else {
            localStorage.setItem('algodeck_user_type', 'guest');
        }
        closeAuthModal();
        if (window.renderGlobalNavbar) {
            window.renderGlobalNavbar();
        }
    }

    // Expose auth functions globally
    window.openAuthModal = openAuthModal;
    window.closeAuthModal = closeAuthModal;
    window.saveAuthSession = saveAuthSession;

    // 3. Inject fonts and stylesheets dynamically
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

    // 4. Inject spotlight and noise overlay DOM elements
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

    // 5. Track spotlight coordinates
    function setupSpotlightTracking() {
        document.addEventListener('mousemove', (e) => {
            document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
            document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
        });
    }

    // 6. Render unified global navbar across all AlgoDeck pages
    function renderGlobalNavbar() {
        const headerContainer = document.getElementById('app-header');
        if (!headerContainer) return;

        const path = window.location.pathname;
        const isHome = path === '/' || path.endsWith('/index.html') || path === '';
        const isDash = path.includes('dashboard');
        const isPlayground = path.includes('playground') || path.includes('editor');
        const isRoadmap = path.includes('roadmap');
        const isDocs = path.includes('docs');

        const userType = localStorage.getItem('algodeck_user_type') || 'guest';
        const username = localStorage.getItem('algodeck_username');
        let guestId = localStorage.getItem('algodeck_guest_id');

        if (!guestId) {
            guestId = 'guest_' + Math.random().toString(36).substring(2, 6);
            localStorage.setItem('algodeck_guest_id', guestId);
            localStorage.setItem('algodeck_user_type', 'guest');
        }

        let userLabel = 'Guest Mode (' + (guestId.length > 10 ? guestId.substring(0, 10) : guestId) + ')';
        if (userType === 'user' && username) {
            userLabel = username;
        }

        const currentTheme = getStoredTheme();
        const themeIcon = currentTheme === 'light'
            ? `<i class="fa-solid fa-sun" style="color: #f59e0b; font-size: 0.95rem;"></i>`
            : `<i class="fa-solid fa-moon" style="color: #a855f7; font-size: 0.95rem;"></i>`;

        const isFile = window.location.protocol === 'file:';
        const getUrl = (rel) => isFile ? ('./' + rel) : ('/' + rel);

        headerContainer.innerHTML = `
            <header class="main-header">
                <a href="${getUrl('index.html')}" class="header-brand">
                    <i class="fa-solid fa-layer-group brand-logo"></i>
                    <span class="brand-name serif italic">AlgoDeck</span>
                </a>
                <nav class="header-nav">
                    <a href="${getUrl('index.html')}" class="nav-item ${isHome ? 'active' : ''}"><i class="fa-solid fa-house"></i> Home</a>
                    <a href="${getUrl('dashboard.html')}" class="nav-item ${isDash ? 'active' : ''}"><i class="fa-solid fa-chart-simple"></i> Dashboard</a>
                    <a href="${getUrl('playground.html')}" class="nav-item ${isPlayground ? 'active' : ''}"><i class="fa-solid fa-terminal"></i> Playground</a>
                    <a href="${getUrl('roadmap.html')}" class="nav-item ${isRoadmap ? 'active' : ''}"><i class="fa-solid fa-diagram-project"></i> Roadmap</a>
                    <a href="${getUrl('docs.html')}" class="nav-item ${isDocs ? 'active' : ''}"><i class="fa-solid fa-book"></i> Docs</a>
                    <button id="btn-theme-toggle" onclick="window.toggleTheme()" title="Toggle Light/Dark Theme" style="background: var(--bg-element); color: var(--nav-text); border: 1px solid var(--border); width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;">
                        ${themeIcon}
                    </button>
                    <button class="btn-auth" onclick="window.openAuthModal()" style="background: var(--bg-element); color: var(--nav-text); border: 1px solid var(--border); padding: 7px 16px; border-radius: 9999px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s;">
                        <i class="fa-solid fa-user-check"></i> <span id="nav-user-label">${userLabel}</span>
                    </button>
                </nav>
            </header>
        `;

        if (window.location.protocol.startsWith('http')) {
            fetchDueNudge();
        }
    }

    async function fetchDueNudge() {
        const snoozeUntil = parseInt(localStorage.getItem('algodeck_snooze_until') || '0', 10);
        if (Date.now() < snoozeUntil) return;

        try {
            const res = await fetch('/api/problems');
            if (!res.ok) return;
            const data = await res.json();
            const dueCount = (data.problems || []).filter(p => p.is_due).length;
            
            if (dueCount > 0) {
                const nav = document.querySelector('.header-nav');
                if (nav && !document.getElementById('nav-due-nudge')) {
                    const pill = document.createElement('a');
                    pill.id = 'nav-due-nudge';
                    const isFile = window.location.protocol === 'file:';
                    pill.href = isFile ? './playground.html?mode=daily_deck' : '/playground.html?mode=daily_deck';
                    pill.className = 'nav-due-pill';
                    pill.style.cssText = 'background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); padding: 5px 12px; border-radius: 9999px; font-size: 0.8rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;';
                    pill.innerHTML = `<i class="fa-solid fa-bell"></i> ${dueCount} Due Today <span title="Snooze 24h" onclick="window.snoozeDueNudge(event)" style="margin-left: 4px; opacity: 0.7; cursor: pointer;">&times;</span>`;
                    nav.insertBefore(pill, nav.firstChild);
                }
            }
        } catch (err) {}
    }

    window.snoozeDueNudge = function(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        localStorage.setItem('algodeck_snooze_until', Date.now() + 86400000);
        const pill = document.getElementById('nav-due-nudge');
        if (pill) pill.remove();
    };

    // Expose navbar renderers
    window.renderGlobalNavbar = renderGlobalNavbar;
    window.renderHeader = renderGlobalNavbar;

    function init() {
        injectHeadElements();
        injectBackgroundFX();
        setupSpotlightTracking();
        applyTheme(getStoredTheme());
        injectGlobalAuthModal();
        renderGlobalNavbar();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
