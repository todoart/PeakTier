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

async function iniciarDuelo(indiceRonda) {
    handOrg.innerHTML = jugadas['piedra'];
    handGuest.innerHTML = jugadas['piedra'];
    
    if (indiceRonda === 0) {
        resultMessage.innerText = "¡DUELO PRINCIPAL!";
    } else {
        resultMessage.innerText = "¡DESEMPATE!";
    }
    resultMessage.style.color = "white";
    resultMessage.classList.remove('hidden');

    handOrg.classList.remove('strike-org');
    handGuest.classList.remove('strike-guest');
    void handOrg.offsetWidth; 

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
            
            // Reinicia para que sigas probando
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
        oroInvitado += 100;
        scoreGuestEl.innerText = oroInvitado;
        
        await esperar(3000);
        reiniciarRonda();
    } 
    else {
        resultMessage.innerText = "DERROTA";
        resultMessage.style.color = "red";
        oroOrg += 100;
        scoreOrgEl.innerText = oroOrg;
        
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
}
