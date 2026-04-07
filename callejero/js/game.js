const handOrg = document.getElementById('hand-org');
const handGuest = document.getElementById('hand-guest');
const resultMessage = document.getElementById('result-message');
const scoreGuestEl = document.getElementById('score-guest');
const scoreOrgEl = document.getElementById('score-org');

const jugadas = { 'piedra': '✊', 'papel': '✋', 'tijera': '✌️' };

// BASE DE DATOS SIMULADA: [Principal, Reserva 1, Reserva 2]
const comboOrganizador = ['papel', 'tijera', 'piedra']; 
let comboInvitado = [];
let oroInvitado = 0;
let oroOrg = 0;

function seleccionarJugada(eleccion) {
    if (comboInvitado.length < 3) {
        comboInvitado.push(eleccion);
        document.getElementById(`q${comboInvitado.length - 1}`).innerText = jugadas[eleccion];
        
        if (comboInvitado.length === 3) {
            document.getElementById('controls').classList.add('hidden');
            iniciarDuelo(0); // Inicia con la jugada Principal (índice 0)
        }
    }
}

const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function iniciarDuelo(indiceRonda) {
    // 1. Resetear manos a piedra cerrada
    handOrg.innerText = jugadas['piedra'];
    handGuest.innerText = jugadas['piedra'];
    
    // Mensajes para dar contexto
    if (indiceRonda === 0) {
        resultMessage.innerText = "¡DUELO PRINCIPAL!";
    } else {
        resultMessage.innerText = "¡DESEMPATE!";
    }
    resultMessage.style.color = "white";
    resultMessage.classList.remove('hidden');

    // Quitar clases por si acaso y forzar reflujo del navegador
    handOrg.classList.remove('strike-org');
    handGuest.classList.remove('strike-guest');
    void handOrg.offsetWidth; 

    // 2. Disparar la animación de los 3 golpes
    handOrg.classList.add('strike-org');
    handGuest.classList.add('strike-guest');
    
    // 3. El truco visual: Esperar exactamente a que las manos estén en lo más alto del 3er salto (milisegundo 1250 aprox)
    await esperar(1250); 
    
    // Revelar jugadas justo antes de que impacten contra el suelo
    const tiroOrg = comboOrganizador[indiceRonda];
    const tiroInv = comboInvitado[indiceRonda];
    handOrg.innerText = jugadas[tiroOrg];
    handGuest.innerText = jugadas[tiroInv];

    // 4. Esperar a que termine de caer la animación (milisegundo 1500)
    await esperar(250); 
    
    // 5. Evaluar la jugada
    evaluarJugada(tiroInv, tiroOrg, indiceRonda);
}

async function evaluarJugada(invitado, organizador, indiceRonda) {
    if (invitado === organizador) {
        resultMessage.innerText = "¡EMPATE!";
        resultMessage.style.color = "gray";
        
        await esperar(2000); // Pausa dramática
        
        // Si hay un empate, verificamos si quedan reservas
        if (indiceRonda < 2) {
            iniciarDuelo(indiceRonda + 1); // Dispara la reserva
        } else {
            // Se acabaron las reservas, es un empate total de la partida
            resultMessage.innerText = "¡EMPATE ABSOLUTO!";
            resultMessage.style.color = "white";
        }
    } 
    // Triangulación de victoria
    else if (
        (invitado === 'piedra' && organizador === 'tijera') ||
        (invitado === 'papel' && organizador === 'piedra') ||
        (invitado === 'tijera' && organizador === 'papel')
    ) {
        resultMessage.innerText = "¡GANASTE EL DESAFÍO!";
        resultMessage.style.color = "gold";
        oroInvitado += 100;
        scoreGuestEl.innerText = oroInvitado;
    } 
    else {
        resultMessage.innerText = "PERDISTE EL DESAFÍO";
        resultMessage.style.color = "red";
        oroOrg += 100;
        scoreOrgEl.innerText = oroOrg;
    }
}
