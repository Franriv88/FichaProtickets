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





/**
 * ESTA ES LA NUEVA FUNCIÓN para el botón de 3 estados.
 * Rota el estado y el estilo del botón que se le pase como argumento.
 */
function ciclarOpcionMesa(boton) {
    const estadoActual = boton.textContent;
    
    // Limpiamos las clases de estilo anteriores
    boton.classList.remove('no', 'compartida', 'individual');

    // Determinamos el siguiente estado
    if (estadoActual === 'No') {
        boton.textContent = 'Compartida';
        boton.classList.add('compartida');
    } else if (estadoActual === 'Compartida') {
        boton.textContent = 'Individual';
        boton.classList.add('individual');
    } else { // Si es 'Individual'
        boton.textContent = 'No';
        boton.classList.add('no');
    }
}

/**
 * TU FUNCIÓN `agregarFila`.
 * Ahora crea un botón que llama a la nueva función `ciclarOpcionMesa`.
 */
function agregarFila() {
    var tbody = document.getElementById('miTabla').getElementsByTagName('tbody')[0];
    var nuevaFila = tbody.insertRow();

    var celda1 = nuevaFila.insertCell();
    var celda2 = nuevaFila.insertCell();
    var celda3 = nuevaFila.insertCell();
    var celda4 = nuevaFila.insertCell(); // Celda con el botón de 3 estados
    var celda5 = nuevaFila.insertCell(); // Celda con el botón de eliminar

    celda1.innerHTML = '<input type="text" name="dato1[]">';
    celda2.innerHTML = '<input type="text" name="dato2[]">';
    celda3.innerHTML = '<input type="text" name="dato3[]">';
    
    // AQUÍ ESTÁ EL CAMBIO PRINCIPAL:
    // El botón empieza en "No" y llama a la nueva función.
    // Le añadimos la clase inicial 'no' para que tenga el estilo correcto.
    celda4.innerHTML = '<button class="toggle-btn no" type="button" onclick="ciclarOpcionMesa(this)">No</button>';
    
    celda5.innerHTML = '<button class="delete-btn" type="button" onclick="eliminarFila(this)">Eliminar</button>';
}

/**
 * Tu función `eliminarFila`.
 */
function eliminarFila(boton) {
    var fila = boton.parentNode.parentNode;
    fila.parentNode.removeChild(fila);
}


// =================================================================
// 4- PRECIOS
// =================================================================
/**
 * TU FUNCIÓN `agregarFila2`.
 * Ahora crea un botón que llama a la nueva función `ciclarOpcionMesa`.
 */
// function agregarFila2() {
//     // 1. FORMA CORRECTA DE SELECCIONAR EL TBODY (por su ID)
//     var miTablaBody = document.getElementById('miTablaBody');

//     // Inserta una nueva fila al final del tbody
//     var nuevaFila = miTablaBody.insertRow();

//     // 2. Usamos la variable 'nuevaFila' de forma consistente
//     var celda1 = nuevaFila.insertCell();
//     var celda2 = nuevaFila.insertCell();
//     var celda3 = nuevaFila.insertCell();
//     var celda4 = nuevaFila.insertCell(); 
//     var celda5 = nuevaFila.insertCell(); 
//     var celda6 = nuevaFila.insertCell();
//     var celda7 = nuevaFila.insertCell();
//     var celda8 = nuevaFila.insertCell();
//     var celda9 = nuevaFila.insertCell(); // Celda para el botón de eliminar

//     // Insertamos el HTML en cada celda
//     celda1.innerHTML = '<input type="text" name="dato1[]">';
//     celda2.innerHTML = '<input type="text" name="dato2[]">';
//     celda3.innerHTML = '<input type="text" name="dato3[]">';
//     celda4.innerHTML = '<input type="text" name="dato4[]">';
//     celda5.innerHTML = '<input type="text" name="dato5[]">';
//     celda6.innerHTML = '<input type="text" name="dato6[]">';
//     celda7.innerHTML = '<input type="text" name="dato7[]">';
//     celda8.innerHTML = '<input type="text" name="dato8[]">';
    
//     // 3. EL BOTÓN DEBE LLAMAR A LA FUNCIÓN CORRECTA 'eliminarFila2'
//     celda9.innerHTML = '<button class="delete-btn" type="button" onclick="eliminarFila2(this)">Eliminar</button>';
// }

// function eliminarFila2(boton) {
//     // Esta función ya estaba bien escrita
//     var fila = boton.closest('tr'); // .closest('tr') es una forma más moderna y segura
//     fila.remove();
// }


// Archivo: calculos.js

// --- NUEVA FUNCIÓN DE REDONDEO ESPECÍFICO ---
/**
 * Redondea un número según las reglas de negocio para la boletería.
 * - Si la centena es 500 o más, redondea al siguiente millar.
 * - Si la centena es 499 o menos, redondea al millar actual.
 * @param {number} numero El número a redondear.
 * @returns {number} El número redondeado.
 */
function redondearBoleteria(numero) {
    // Esta fórmula logra el redondeo deseado de forma matemática:
    // 1. Divide el número por 1000 (ej: 3742 -> 3.742)
    // 2. Lo redondea al entero más cercano (ej: 3.742 -> 4)
    // 3. Lo multiplica de nuevo por 1000 (ej: 4 -> 4000)
    return Math.round(numero / 1000) * 1000;
}


// --- LÓGICA DE CÁLCULO (MODIFICADA) ---

function calcularValores(fila) {
    // 1. Encontrar los inputs dentro de la fila (sin cambios)
    const valorTarifaInput = fila.querySelector('.valor-tarifa');
    const porcentajeWebInput = fila.querySelector('.porcentaje-web');
    const resultadoWebInput = fila.querySelector('.resultado-web');
    const porcentajeBoleteriaInput = fila.querySelector('.porcentaje-boleteria');
    const resultadoBoleteriaInput = fila.querySelector('.resultado-boleteria');

    // 2. Obtener los valores (sin cambios)
    const valorTarifa = parseFloat(valorTarifaInput.value) || 0;
    const porcentajeWeb = parseFloat(porcentajeWebInput.value) || 0;
    const porcentajeBoleteria = parseFloat(porcentajeBoleteriaInput.value) || 0;

    // 3. Realizar los cálculos
    // El cálculo para la Web sigue igual
    const resultadoWeb = (valorTarifa * porcentajeWeb) / 100;
    
    // El cálculo para la Boletería ahora usa la nueva función de redondeo
    const resultadoBoleteriaCrudo = (valorTarifa * porcentajeBoleteria) / 100;
    const resultadoBoleteriaRedondeado = redondearBoleteria(resultadoBoleteriaCrudo);

    // 4. Mostrar los resultados
    // El resultado Web se muestra con 2 decimales, como antes.
    resultadoWebInput.value = resultadoWeb.toFixed(0);
    
    // El resultado Boletería se muestra ya redondeado.
    resultadoBoleteriaInput.value = resultadoBoleteriaRedondeado;
}

// --- MANEJO DE LA TABLA (SIN CAMBIOS) ---

const miTablaBody = document.getElementById('miTablaBody');

if (miTablaBody) {
    miTablaBody.addEventListener('input', function(event) {
        if (event.target.classList.contains('valor-tarifa') || 
            event.target.classList.contains('porcentaje-web') || 
            event.target.classList.contains('porcentaje-boleteria')) 
        {
            const filaActual = event.target.closest('tr');
            calcularValores(filaActual);
        }
    });
}

function agregarFila2() {
    const nuevaFila = miTablaBody.insertRow();
    nuevaFila.innerHTML = `
        <td><input type="text" name="nombreTarifa[]" /></td>
        <td><input type="number" name="ticketsCompra[]" /></td>
        <td><input type="number" class="valor-tarifa" name="valorTarifa[]" placeholder="1000" min="0"/></td>
        <td><input type="number" class="porcentaje-web" name="porcentajeWeb[]" placeholder="20" min="0"/></td>
        <td><input type="text" class="resultado-web" name="resultadoWeb[]" readonly /></td>
        <td><input type="number" class="porcentaje-boleteria" name="porcentajeBoleteria[]" placeholder="10" min="0"/></td>
        <td><input type="text" class="resultado-boleteria" name="resultadoBoleteria[]" readonly /></td>
        <td><input type="number" name="ticketsFase[]" /></td>
        <td><button class="delete-btn" onclick="eliminarFila2(this)">Eliminar</button></td>
    `;
}

function eliminarFila2(boton) {
    const fila = boton.closest('tr');
    fila.remove();
}