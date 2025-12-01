const BASE_URL = 'http://localhost:3000/api'; 

document.addEventListener('DOMContentLoaded', () => {
   const loader = document.getElementById('loader');
    const kartIcon = document.querySelector('#loader .kart-icon');
    const animationContainer = document.querySelector('.animation-container');
    const welcomeMessage = document.getElementById('welcome-message');
    const trackProgress = document.querySelector('.track-progress');
    
    const isNavigating = sessionStorage.getItem('isNavigating');

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
        }, 5000);
    }

    if (isNavigating === 'true') {
        sessionStorage.removeItem('isNavigating');
        startLoadingAnimation();
    } else {
        startWelcomeAnimation();
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

  if (window.location.pathname.includes('pilotos.html')) {
        carregarPilotos();
    }
});

function carregarPilotos() {
   const listaPilotosContainer = document.getElementById('lista-pilotos'); 
    
    if (!listaPilotosContainer) {
        console.warn("Contêiner de lista de pilotos não encontrado (ID #lista-pilotos).");
        return;
    }
    
   fetch(`${BASE_URL}/pilotos`)
        .then(response => {
            if (!response.ok) {
                console.error('Falha na API. Status:', response.status);
                throw new Error('Falha na API. Status: ' + response.status);
            }
            return response.json();
        })
        .then(pilotos => {
            console.log('Dados recebidos com sucesso:', pilotos);
         exibirPilotosNaTabela(pilotos, listaPilotosContainer); 
        })
        .catch(error => {
            console.error('Erro de conexão ou busca de dados:', error);
            listaPilotosContainer.innerHTML = '<tr><td colspan="5" style="color: red;">Erro ao carregar dados. O servidor Node.js está ligado?</td></tr>';
        });
}


function exibirPilotosNaTabela(listaDePilotos, container) {
    container.innerHTML = ''; 
    
    if (listaDePilotos.length === 0) {
        container.innerHTML = '<tr><td colspan="5">Nenhum piloto cadastrado.</td></tr>';
        return;
    }

    listaDePilotos.forEach(piloto => {
        const linha = document.createElement('tr');
      linha.innerHTML = `
            <td>${piloto.nome}</td>
            <td>${piloto.email}</td>
            <td>${piloto.data_nascimento}</td>
            <td>${piloto.peso} kg</td>
            <td>${piloto.altura} m</td>
        `;
        container.appendChild(linha);
    });
}
