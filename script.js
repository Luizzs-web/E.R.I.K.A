document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const progressBar = document.querySelector('#loader .progress-bar');
    const kartIcon = document.querySelector('#loader .kart-icon');
    const animationContainer = document.querySelector('.animation-container');
    const welcomeMessage = document.getElementById('welcome-message');

    function startFullAnimation() {
        loader.style.opacity = '1';
        loader.style.display = 'flex';
        animationContainer.style.opacity = '1';
        welcomeMessage.style.opacity = '0';
        welcomeMessage.style.visibility = 'hidden';
        progressBar.style.width = '0%';
        kartIcon.classList.remove('driving');

        setTimeout(() => {
            progressBar.classList.add('progressing');
            progressBar.style.width = '100%';
            kartIcon.classList.add('driving');
        }, 200); 

        setTimeout(() => {
            animationContainer.style.opacity = '0';
        }, 2400);

        setTimeout(() => {
            welcomeMessage.style.visibility = 'visible';
            welcomeMessage.style.opacity = '1';
            welcomeMessage.classList.add('animate');
        }, 2900);

        setTimeout(() => {
            welcomeMessage.style.opacity = '0';
        }, 4900); 

        setTimeout(() => {
            loader.style.opacity = '0';
        }, 5400); 

        setTimeout(() => {
            loader.style.display = 'none';
            sessionStorage.setItem('hasVisited', 'true');
        }, 5900); 
    }

    function startQuickAnimation() {
        loader.style.opacity = '1';
        loader.style.display = 'flex';
        animationContainer.style.opacity = '1';
        welcomeMessage.style.opacity = '0';
        welcomeMessage.style.visibility = 'hidden';
        progressBar.style.width = '0%';
        kartIcon.classList.remove('driving');

        setTimeout(() => {
            progressBar.classList.add('progressing');
            progressBar.style.width = '100%';
            kartIcon.classList.add('driving');
        }, 200); 

        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 2400);
    }

    if (sessionStorage.getItem('hasVisited')) {
        loader.style.display = 'none';
    } else {
        startFullAnimation();
    }

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const destination = link.getAttribute('href');
            startQuickAnimation();
            setTimeout(() => {
                console.log(`Navegando para ${destination}`);
            }, 2500); 
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