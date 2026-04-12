const handOrg = document.getElementById('hand-org');
const handGuest = document.getElementById('hand-guest');
const resultMessage = document.getElementById('result-message');
const scoreGuestEl = document.getElementById('score-guest');
const scoreOrgEl = document.getElementById('score-org');

const jugadas = { 
    'piedra': '<img src="assets/manos/piedra.png" alt="Piedra">', 
    'papel': '<img src="assets/manos/papel.png" alt="Papel">', 
    'tijera': '<img src="assets/manos/tijera.png" alt="Tijera">' 
};

const comboOrganizador = ['papel', 'tijera', 'piedra']; 
let comboInvitado = [];
let oroInvitado = 0;
let oroOrg = 0;

const PREMIO_DESAFIO = 100;

function seleccionarJugada(eleccion) {
    if (comboInvitado.length < 3) {
        comboInvitado.push(eleccion);
        document.getElementById(`q${comboInvitado.length - 1}`).innerHTML = jugadas[eleccion];
        
        if (comboInvitado.length === 3) {
            document.getElementById('controls-container').classList.add('hidden');
            iniciarDuelo(0);
        }
    }
}

const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// FUNCIÓN 1: El contador matemático (Ya funcionaba)
function animarMarcador(elementoMarcador, valorInicial, valorFinal) {
    let pasos = 20; 
    let tiempoTotal = 1000; 
    let intervaloTiempo = tiempoTotal / pasos;
    let incremento = (valorFinal - valorInicial) / pasos;
    let actual = valorInicial;

    let timer = setInterval(() => {
        actual += incremento;
        if (actual >= valorFinal) {
            actual = valorFinal;
            clearInterval(timer);
        }
        elementoMarcador.innerText = Math.floor(actual);
    }, intervaloTiempo);
}

// FUNCIÓN 2: El sistema de partículas físicas (¡LO QUE FALTABA!)
function lanzarMonedas(elementoDestino) {
    const container = document.getElementById('game-container');
    const rectDestino = elementoDestino.getBoundingClientRect();
    const rectContainer = container.getBoundingClientRect();

    // Calcular el centro de la pantalla (Batalla)
    const startX = rectContainer.width / 2;
    const startY = rectContainer.height / 2;

    // Calcular dónde está el número del ganador
    const endX = (rectDestino.left - rectContainer.left) + (rectDestino.width / 2);
    const endY = (rectDestino.top - rectContainer.top) + (rectDestino.height / 2);

    // Crear 60 monedas en chorro
    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            // Generar la imagen de la moneda
            const coin = document.createElement('img');
            coin.src = 'assets/ui/oro.png';
            coin.style.position = 'absolute';
            coin.style.width = '30px'; // Tamaño de la moneda voladora
            coin.style.pointerEvents = 'none';
            coin.style.zIndex = '100'; // Asegura que vuele por encima de las manos
            
            // Ubicarla en el centro exacto al nacer
            coin.style.left = (startX - 15) + 'px'; 
            coin.style.top = (startY - 15) + 'px';

            container.appendChild(coin);

            // Calcular dispersión del arco (Para que no vayan en línea recta)
            const dispersionX = (Math.random() - 0.5) * 120; // Se abren a los lados
            const dispersionY = -50 - (Math.random() * 80);  // Saltan hacia arriba formando el arco

            // Lanzar animación física (Curva Bezier aproximada)
            const animacion = coin.animate([
                { transform: `translate(0px, 0px) scale(0.5)`, opacity: 0 },
                { transform: `translate(${dispersionX}px, ${dispersionY}px) scale(1.2)`, opacity: 1, offset: 0.3 }, // Sube y se hace grande
                { transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0.5)`, opacity: 0.8 } // Cae al marcador chica
            ], {
                duration: 600 + (Math.random() * 300), // Velocidad entre 0.6s y 0.9s
                easing: 'ease-in-out',
                fill: 'forwards'
            });

            // Destruir la moneda al llegar para que no se trabe el celular
            animacion.onfinish = () => coin.remove();

        }, i * 15); // Separación de 15 milisegundos entre cada moneda (El "chorro")
    }
}

async function iniciarDuelo(indiceRonda) {
    handOrg.innerHTML = jugadas['piedra'];
    handGuest.innerHTML = jugadas['piedra'];
    
    handOrg.classList.remove('strike-org');
    handGuest.classList.remove('strike-guest');
    void handOrg.offsetWidth; 

    if (indiceRonda === 0) {
        resultMessage.innerText = "¡DUELO PRINCIPAL!";
    } else {
        resultMessage.innerText = "¡DESEMPATE!";
    }
    resultMessage.style.color = "white";
    resultMessage.classList.remove('hidden');

    handOrg.classList.add('strike-org');
    handGuest.classList.add('strike-guest');
    
    await esperar(1250); 
    
    const tiroOrg = comboOrganizador[indiceRonda];
    const tiroInv = comboInvitado[indiceRonda];
    
    handOrg.innerHTML = jugadas[tiroOrg];
    handGuest.innerHTML = jugadas[tiroInv];

    await esperar(250); 
    
    evaluarJugada(tiroInv, tiroOrg, indiceRonda);
}

async function evaluarJugada(invitado, organizador, indiceRonda) {
    if (invitado === organizador) {
        resultMessage.innerText = "¡EMPATE!";
        resultMessage.style.color = "#ccc";
        
        await esperar(2000); 
        
        if (indiceRonda < 2) {
            iniciarDuelo(indiceRonda + 1);
        } else {
            resultMessage.innerText = "¡EMPATE ABSOLUTO!";
            resultMessage.style.color = "white";
            await esperar(3000);
            reiniciarRonda();
        }
    } 
    else if (
        (invitado === 'piedra' && organizador === 'tijera') ||
        (invitado === 'papel' && organizador === 'piedra') ||
        (invitado === 'tijera' && organizador === 'papel')
    ) {
        resultMessage.innerText = "¡VICTORIA!";
        resultMessage.style.color = "gold";
        
        let oroAnterior = oroInvitado;
        oroInvitado += PREMIO_DESAFIO;
        
        // ¡AHORA SÍ! Disparamos las monedas visuales hacia el marcador del invitado
        lanzarMonedas(scoreGuestEl); 
        animarMarcador(scoreGuestEl, oroAnterior, oroInvitado);
        
        await esperar(3000);
        reiniciarRonda();
    } 
    else {
        resultMessage.innerText = "DERROTA";
        resultMessage.style.color = "red";
        
        let oroAnterior = oroOrg;
        oroOrg += PREMIO_DESAFIO;
        
        // Si gana el organizador, las monedas van a su marcador
        lanzarMonedas(scoreOrgEl);
        animarMarcador(scoreOrgEl, oroAnterior, oroOrg);
        
        await esperar(3000);
        reiniciarRonda();
    }
}

function reiniciarRonda() {
    comboInvitado = [];
    document.getElementById('q0').innerHTML = "_";
    document.getElementById('q1').innerHTML = "_";
    document.getElementById('q2').innerHTML = "_";
    document.getElementById('controls-container').classList.remove('hidden');
    resultMessage.classList.add('hidden');
    handOrg.innerHTML = jugadas['piedra'];
    handGuest.innerHTML = jugadas['piedra'];
    handOrg.classList.remove('strike-org');
    handGuest.classList.remove('strike-guest');
}
