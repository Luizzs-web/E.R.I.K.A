document.addEventListener('DOMContentLoaded', () => {

    const loader = document.getElementById('loader');
    const progressBar = document.querySelector('#loader .progress-bar');
    const kartIcon = document.querySelector('#loader .kart-icon');

    function startLoadingAnimation() {
        loader.style.opacity = '1';
        loader.style.display = 'flex';
        progressBar.style.width = '0%';
        kartIcon.classList.remove('driving');

        setTimeout(() => {
            progressBar.style.width = '100%';
            kartIcon.classList.add('driving');
        }, 100);

        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 2200);
    }

    startLoadingAnimation();

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const destination = link.getAttribute('href');
            startLoadingAnimation();
            setTimeout(() => {
                console.log(`Navegando para ${destination}`);
            }, 2300);
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