// =================================================================
// 1. MAPA DE DATOS Y ELEMENTOS DEL HTML
// =================================================================

const venueAddresses = {
    "Mood Live": "Ministro Gonzalez 40",
    "RucaChe": "Antártida Argentina 3901",
    "Espacio Duam": "San Martin 5901"
};

const venueInput = document.getElementById('venueName');
const addressInput = document.getElementById('addressLocation');
const sectorContainer = document.getElementById('sectorContainer');
const sectorInput = document.getElementById('sectorInput'); // ✅ Obtenemos el input del sector


// =================================================================
// 2. LÓGICA PRINCIPAL DEL INPUT "VENUE"
// =================================================================

venueInput.addEventListener('input', function() {
    const selectedVenue = this.value;

    // Autocompletar dirección
    const correspondingAddress = venueAddresses[selectedVenue];
    addressInput.value = correspondingAddress || '';

    // Mostrar/ocultar el campo de "Sector"
    if (selectedVenue === 'Mood Live') {
        sectorContainer.classList.remove('hidden');
    } else {
        sectorContainer.classList.add('hidden');
    }
});


// =================================================================
// 3. FUNCIÓN REUTILIZABLE PARA MOSTRAR OPCIONES AL HACER CLIC
// =================================================================

function reopenDatalist(event) {
    const input = event.target; // Se refiere al input que recibió el clic
    const currentValue = input.value;
    
    input.value = '';
    
    setTimeout(() => {
        input.value = currentValue;
        input.select();
    }, 0);
}

function selectTextOnFocus(event) {
    event.target.select();
}

// ✅ Aplicamos la misma función a AMBOS inputs
venueInput.addEventListener('click', reopenDatalist);
sectorInput.addEventListener('click', reopenDatalist); // ✨ AQUÍ LA MAGIA

venueInput.addEventListener('focus', selectTextOnFocus);
sectorInput.addEventListener('focus', selectTextOnFocus);