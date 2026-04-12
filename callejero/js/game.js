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

// VALOR DEL DESAFÍO (Para probar la progresividad)
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

// FUNCIÓN KINGSHOT: Incrementa el oro progresivamente
function animarMarcador(elementoMarcador, valorInicial, valorFinal) {
    let pasos = 20; // Actualizaciones del contador
    let tiempoTotal = 1000; // Dura 1 segundo
    let intervaloTiempo = tiempoTotal / pasos;
    let incremento = (valorFinal - valorInicial) / pasos;
    let actual = valorInicial;

    let timer = setInterval(() => {
        actual += incremento;
        if (actual >= valorFinal) {
            actual = valorFinal;
            clearInterval(timer);
        }
        // Mostramos el número entero
        elementoMarcador.innerText = Math.floor(actual);
    }, intervaloTiempo);
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
        
        // EFECTO KINGSHOT APLICADO AQUÍ
        let oroAnterior = oroInvitado;
        oroInvitado += PREMIO_DESAFIO;
        animarMarcador(scoreGuestEl, oroAnterior, oroInvitado);
        
        await esperar(3000);
        reiniciarRonda();
    } 
    else {
        resultMessage.innerText = "DERROTA";
        resultMessage.style.color = "red";
        
        // Efecto para el Organizador si gana
        let oroAnterior = oroOrg;
        oroOrg += PREMIO_DESAFIO;
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
