(function () {
    // 1. Inject fonts and stylesheets dynamically
    function injectHeadElements() {
        if (!document.querySelector('link[href*="global.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/playground/global.css';
            document.head.appendChild(link);
        }
        if (!document.querySelector('link[href*="Manrope"]')) {
            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&display=swap';
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

    // 4. Clean up and align header components dynamically
    //    Only write to DOM when values actually differ to avoid triggering MutationObserver loops
    let _patching = false;
    function patchHeaderBrand() {
        if (_patching) return;
        _patching = true;

        try {
            const brandLogo = document.querySelector('.brand-logo');
            if (brandLogo && !brandLogo.classList.contains('fa-layer-group')) {
                brandLogo.className = 'fa-solid fa-layer-group brand-logo';
                brandLogo.style.color = '#ffffff';
                brandLogo.style.fontSize = '1.7rem';
            }

            const brandName = document.querySelector('.brand-name');
            if (brandName && !brandName.classList.contains('serif')) {
                brandName.classList.add('serif', 'italic');
                brandName.style.setProperty('font-family', "'Cormorant Garamond', serif", 'important');
                brandName.style.setProperty('font-style', 'italic', 'important');
                brandName.style.fontWeight = '600';
                brandName.style.fontSize = '1.65rem';
            }
        } finally {
            _patching = false;
        }
    }

    // Initialize all custom styling hooks
    function init() {
        injectHeadElements();
        injectBackgroundFX();
        setupSpotlightTracking();
        patchHeaderBrand();

        // Use MutationObserver to monitor dynamic header re-renders only
        const headerEl = document.getElementById('app-header');
        if (headerEl) {
            const observer = new MutationObserver(() => {
                patchHeaderBrand();
            });
            observer.observe(headerEl, {
                childList: true,
                subtree: true
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
