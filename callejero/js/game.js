const handOrg = document.getElementById('hand-org');
const handGuest = document.getElementById('hand-guest');
const resultMessage = document.getElementById('result-message');
const scoreGuestEl = document.getElementById('score-guest');
const scoreOrgEl = document.getElementById('score-org');

const jugadas = { 'piedra': '✊', 'papel': '✋', 'tijera': '✌️' };

// SIMULACIÓN DE BASE DE DATOS: El Organizador ya dejó estas 3 jugadas.
const comboOrganizador = ['papel', 'tijera', 'piedra']; 
let comboInvitado = [];
let oroInvitado = 0;
let oroOrg = 0;

function seleccionarJugada(eleccion) {
    if (comboInvitado.length < 3) {
        comboInvitado.push(eleccion);
        // Actualizar la interfaz visual del combo
        document.getElementById(`q${comboInvitado.length}`).innerText = jugadas[eleccion];
        
        // Si ya eligió 3, arranca la película de la batalla automáticamente
        if (comboInvitado.length === 3) {
            document.getElementById('controls').classList.add('hidden');
            ejecutarBatallaAsincrona();
        }
    }
}

// Función auxiliar para crear pausas (ritmo de juego)
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function ejecutarBatallaAsincrona() {
    for (let i = 0; i < 3; i++) {
        // 1. Preparar ronda (manos en piedra y mensaje)
        handOrg.innerText = jugadas['piedra'];
        handGuest.innerText = jugadas['piedra'];
        resultMessage.innerText = `RONDA ${i + 1}`;
        resultMessage.style.color = "white";
        resultMessage.classList.remove('hidden');

        // 2. Activar la animación de agitar (dura 1 segundo: 2 repeticiones de 0.5s)
        handOrg.classList.add('shake-org');
        handGuest.classList.add('shake-guest');
        
        // Esperamos exactamente 1 segundo que dura la animación CSS
        await esperar(1000); 

        // 3. Detener animación y REVELAR JUGADAS (Tercer tiempo)
        handOrg.classList.remove('shake-org');
        handGuest.classList.remove('shake-guest');
        handOrg.innerText = jugadas[comboOrganizador[i]];
        handGuest.innerText = jugadas[comboInvitado[i]];

        // 4. Evaluar la triangulación estricta
        evaluarRonda(comboInvitado[i], comboOrganizador[i]);

        // 5. Esperar 1.5 segundos para que vean el resultado antes de la siguiente ronda
        await esperar(1500);
    }

    // Fin de las 3 rondas
    resultMessage.innerText = oroInvitado > oroOrg ? "¡VICTORIA FINAL!" : oroInvitado === oroOrg ? "¡EMPATE TÉCNICO!" : "FUISTE DERROTADO";
    resultMessage.style.color = oroInvitado > oroOrg ? "gold" : "white";
}

function evaluarRonda(invitado, organizador) {
    if (invitado === organizador) {
        resultMessage.innerText = "EMPATE";
        resultMessage.style.color = "gray";
    } 
    // Triangulación de victoria del invitado
    else if (
        (invitado === 'piedra' && organizador === 'tijera') ||
        (invitado === 'papel' && organizador === 'piedra') ||
        (invitado === 'tijera' && organizador === 'papel')
    ) {
        resultMessage.innerText = "+100 ORO";
        resultMessage.style.color = "gold";
        oroInvitado += 100;
        scoreGuestEl.innerText = oroInvitado;
    } 
    // Si no es empate y no ganó el invitado, gana el organizador por descarte
    else {
        resultMessage.innerText = "PIERDES";
        resultMessage.style.color = "red";
        oroOrg += 100;
        scoreOrgEl.innerText = oroOrg;
    }
}
