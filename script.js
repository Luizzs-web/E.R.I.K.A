document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const kartIcon = document.querySelector('#loader .kart-icon');
    const animationContainer = document.querySelector('.animation-container');
    const welcomeMessage = document.getElementById('welcome-message');
    const trackProgress = document.querySelector('.track-progress');
    
    const isNavigating = sessionStorage.getItem('isNavigating');
    const hasVisited = sessionStorage.getItem('hasVisited');

    function startLoadingAnimation() {
        loader.style.opacity = '1';
        loader.style.display = 'flex';

        animationContainer.style.opacity = '1';
        animationContainer.style.visibility = 'visible';
        welcomeMessage.style.opacity = '0';
        welcomeMessage.style.visibility = 'hidden';

        kartIcon.classList.remove('driving');
        trackProgress.style.width = '0%';

        setTimeout(() => {
            kartIcon.classList.add('driving');
            trackProgress.style.width = '100%';
        }, 50);

        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 2500);
    }

    function startWelcomeAnimation() {
        loader.style.opacity = '1';
        loader.style.display = 'flex';

        animationContainer.style.opacity = '0';
        animationContainer.style.visibility = 'hidden';
        welcomeMessage.style.opacity = '1';
        welcomeMessage.style.visibility = 'visible';

        welcomeMessage.classList.add('animate');

        setTimeout(() => {
            welcomeMessage.style.opacity = '0';
        }, 4000);

        setTimeout(() => {
            loader.style.opacity = '0';
        }, 4500);

        setTimeout(() => {
            loader.style.display = 'none';
            sessionStorage.setItem('hasVisited', 'true');
        }, 5000);
    }

    if (isNavigating === 'true') {
        sessionStorage.removeItem('isNavigating');
        startLoadingAnimation();
    } else if (!hasVisited && (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html'))) {
        startWelcomeAnimation();
    } else {
        loader.style.display = 'none';
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const destination = link.getAttribute('href');
            
            sessionStorage.setItem('isNavigating', 'true');
            
            setTimeout(() => {
                 window.location.href = destination;
            }, 100);
        });
    });

    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});