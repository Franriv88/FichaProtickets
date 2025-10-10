/* ======================================================= */
/* 1. FUNCIONES GLOBALES (Llamadas desde onclick en HTML) */
/* ======================================================= */

function agregarFila() {
    const tbody = document.getElementById('miTabla').getElementsByTagName('tbody')[0];
    const nuevaFila = tbody.insertRow();
    nuevaFila.innerHTML = `
        <td><input type="text" name="dato1[]"></td>
        <td class="valores"><input type="text" name="dato2[]"></td>
        <td><input type="text" name="dato3[]"></td>
        <td><button class="toggle-btn no" type="button" onclick="ciclarOpcionMesa(this)">No</button></td>
        <td><button class="delete-btn" type="button" onclick="eliminarFila(this)">X</button></td>
    `;
}

function eliminarFila(boton) {
    boton.closest('tr').remove();
}

function ciclarOpcionMesa(boton) {
    const estadoActual = boton.textContent;
    boton.classList.remove('no', 'compartida', 'individual');

    if (estadoActual === 'No') {
        boton.textContent = 'Compartida';
        boton.classList.add('compartida');
    } else if (estadoActual === 'Compartida') {
        boton.textContent = 'Individual';
        boton.classList.add('individual');
    } else {
        boton.textContent = 'No';
        boton.classList.add('no');
    }
}

function agregarFila2() {
    const miTablaBody = document.getElementById('miTablaBody');
    const nuevaFila = miTablaBody.insertRow();
    nuevaFila.innerHTML = `
        <td class="col-nombre-tarifa"><input type="text" name="nombreTarifa[]" /></td>
        <td class="col-tickets-compra"><input type="number" name="ticketsCompra[]" /></td>
        <td class="col-valor-tarifa"><input type="number" class="valor-tarifa" name="valorTarifa[]" placeholder="" min="0" /></td>
        <td class="col-porcentaje-web"><input type="number" class="porcentaje-web" name="porcentajeWeb[]" placeholder="15" min="0" /></td>
        <td class="col-resultado-web"><input type="text" class="resultado-web" name="resultadoWeb[]" readonly /></td>
        <td class="col-porcentaje-pos"><input type="number" class="porcentaje-boleteria" name="porcentajeBoleteria[]" placeholder="12" min="0"></td>
        <td class="col-resultado-pos"><input type="text" class="resultado-boleteria" name="resultadoBoleteria[]" readonly /></td>
        <td class="col-tickets-fase"><input type="number" name="ticketsFase[]" /></td>
        <td><button class="delete-btn" onclick="eliminarFila2(this)">X</button></td>
    `;
}

function eliminarFila2(boton) {
    boton.closest('tr').remove();
}

function redondearBoleteria(numero) {
    return Math.round(numero / 1000) * 1000;
}

function calcularValores(fila) {
    const valorTarifaInput = fila.querySelector('.valor-tarifa');
    const porcentajeWebInput = fila.querySelector('.porcentaje-web');
    const resultadoWebInput = fila.querySelector('.resultado-web');
    const porcentajeBoleteriaInput = fila.querySelector('.porcentaje-boleteria');
    const resultadoBoleteriaInput = fila.querySelector('.resultado-boleteria');

    const valorTarifa = parseFloat(valorTarifaInput.value) || 0;
    const porcentajeWeb = parseFloat(porcentajeWebInput.value) || 0;
    const porcentajeBoleteria = parseFloat(porcentajeBoleteriaInput.value) || 0;

    const resultadoWeb = (valorTarifa * porcentajeWeb) / 100;
    const resultadoBoleteriaCrudo = (valorTarifa * porcentajeBoleteria) / 100;
    const resultadoBoleteriaRedondeado = redondearBoleteria(resultadoBoleteriaCrudo);

    resultadoWebInput.value = resultadoWeb.toFixed(0);
    resultadoBoleteriaInput.value = resultadoBoleteriaRedondeado;
}


/* ==================================================================== */
/* 2. CÓDIGO DE INICIALIZACIÓN (Se ejecuta cuando el HTML está listo)   */
/* ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Selectores de elementos del DOM ---
    const venueInput = document.getElementById('venueName');
    const addressInput = document.getElementById('addressLocation');
    const sectorContainer = document.getElementById('sectorContainer');
    const sectorInput = document.getElementById('sectorInput');
    const miTablaBody = document.getElementById('miTablaBody');
    const botonPdf = document.getElementById('btnGenerarPdf');
    const nombreEventoInput = document.getElementById('nombreEventoInput');
    const dateInput = document.getElementById('eventDate');
    const dateDisplay = document.getElementById('dateDisplay');
    const logoWeb = document.getElementById('logo-web');
    const logoPdf = document.getElementById('logo-pdf');

    // --- Lógica del Venue y Dirección ---
    if (venueInput) {
        venueInput.addEventListener('input', function() {
            const venueAddresses = {
                "Mood Live": "Ministro Gonzalez 40",
                "RucaChe": "Antártida Argentina 3901",
                "Espacio Duam": "San Martin 5901"
            };
            addressInput.value = venueAddresses[this.value] || '';
            sectorContainer.classList.toggle('hidden', this.value !== 'Mood Live');
        });
    }

    // --- Lógica del input de Fecha Personalizado ---
    if (dateDisplay && dateInput) {
        dateDisplay.addEventListener('click', () => {
            dateInput.showPicker();
        });

        dateInput.addEventListener('change', (event) => {
            const dateValue = event.target.value;
            if (!dateValue) return;

            const date = new Date(dateValue + 'T00:00:00');
            const formatter = new Intl.DateTimeFormat('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            dateDisplay.textContent = formatter.format(date);
            dateDisplay.style.color = '#333';
        });
    }
    
    // --- Lógica para reabrir Datalist ---
    function reopenDatalist(event) {
        const input = event.target;
        const currentValue = input.value;
        input.value = '';
        setTimeout(() => { input.value = currentValue; input.select(); }, 0);
    }
    if(venueInput) venueInput.addEventListener('click', reopenDatalist);
    if(sectorInput) sectorInput.addEventListener('click', reopenDatalist);


    // --- Lógica de la tabla de Tarifas ---
    if (miTablaBody) {
        miTablaBody.addEventListener('input', function(event) {
            if (event.target.matches('.valor-tarifa, .porcentaje-web, .porcentaje-boleteria')) {
                const filaActual = event.target.closest('tr');
                calcularValores(filaActual);
            }
        });
    }

    // --- Lógica de Generación de PDF ---
    if (botonPdf && nombreEventoInput) {
        botonPdf.addEventListener('click', () => {
            const nombreDelEvento = nombreEventoInput.value.trim() || "ficha-evento";
            const tituloOriginal = document.title;
            
            // Prepara para la impresión
            if(logoWeb && logoPdf) {
              logoWeb.style.display = 'none';
              logoPdf.style.display = 'block';
            }
            document.title = nombreDelEvento;

            // Imprime
            window.print();
            
            // Restaura la vista normal después de un breve momento
            setTimeout(() => {
                if(logoWeb && logoPdf) {
                    logoWeb.style.display = 'block';
                    logoPdf.style.display = 'none';
                }
                document.title = tituloOriginal;
            }, 500);
        });
    }
});