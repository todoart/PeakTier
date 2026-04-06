const handOrg = document.getElementById('hand-org');
const handGuest = document.getElementById('hand-guest');
const resultMessage = document.getElementById('result-message');
const scoreGuestEl = document.getElementById('score-guest');

// Íconos básicos (luego los cambiaremos por las URLs de tus imágenes)
const jugadas = {
    'piedra': '✊',
    'papel': '✋',
    'tijera': '✌️'
};

let oroInvitado = 0;

function jugar(eleccionInvitado) {
    // 1. Ocultar botones y mostrar mensaje de tensión
    document.getElementById('controls').classList.add('hidden');
    resultMessage.innerText = "¡1, 2, 3...!";
    resultMessage.classList.remove('hidden');
    resultMessage.style.color = "white";
    
    // 2. Preparar los puños y activar la animación de sacudida
    handOrg.innerText = jugadas['piedra'];
    handGuest.innerText = jugadas['piedra'];
    handOrg.classList.add('shake-org');
    handGuest.classList.add('shake-guest');

    // 3. Simular el tiempo de tensión (1.2 segundos de animación)
    setTimeout(() => {
        // Detener la animación
        handOrg.classList.remove('shake-org');
        handGuest.classList.remove('shake-guest');

        // Lógica temporal: El Organizador tira algo al azar
        const opciones = ['piedra', 'papel', 'tijera'];
        const eleccionOrg = opciones[Math.floor(Math.random() * opciones.length)];

        // Mostrar las jugadas finales
        handOrg.innerText = jugadas[eleccionOrg];
        handGuest.innerText = jugadas[eleccionInvitado];

        // 4. Evaluar ganador
        determinarGanador(eleccionInvitado, eleccionOrg);

        // 5. Devolver los botones después de 2 segundos para seguir jugando
        setTimeout(() => {
            document.getElementById('controls').classList.remove('hidden');
            resultMessage.classList.add('hidden');
        }, 2000);

    }, 1200); // 1200 milisegundos de suspenso
}

function determinarGanador(invitado, organizador) {
    if (invitado === organizador) {
        resultMessage.innerText = "¡EMPATE!";
        resultMessage.style.color = "gray";
    } else if (
        (invitado === 'piedra' && organizador === 'tijera') ||
        (invitado === 'papel' && organizador === 'piedra') ||
        (invitado === 'tijera' && organizador === 'papel')
    ) {
        resultMessage.innerText = "¡WINNER!";
        resultMessage.style.color = "gold";
        oroInvitado += 100; // Sumar 100 de oro si gana el invitado
        scoreGuestEl.innerText = oroInvitado + " Inv";
    } else {
        resultMessage.innerText = "PERDISTE";
        resultMessage.style.color = "red";
    }
}
