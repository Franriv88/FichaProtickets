/* ======================================================= */
/* 1. FUNCIONES GLOBALES                                   */
/* ======================================================= */

function copyValue(boton) {
    const contenedor = boton.parentElement;
    const input = contenedor.querySelector('input, textarea, select');
    if (input) {
        navigator.clipboard.writeText(input.value).then(() => {
            const originalText = boton.textContent;
            boton.textContent = "Copied!";
            boton.style.backgroundColor = "#4caf50";
            setTimeout(() => {
                boton.textContent = originalText;
                boton.style.backgroundColor = "";
            }, 1000);
        });
    }
}

function agregarFila() {
    const tbody = document.getElementById('miTabla').getElementsByTagName('tbody')[0];
    const nuevaFila = tbody.insertRow();
    nuevaFila.innerHTML = `
        <td><div class="input-group"><input type="text" name="dato1[]"><button type="button" class="copy-btn" onclick="copyValue(this)">Copy</button></div></td>
        <td class="valores"><div class="input-group"><input type="text" name="dato2[]"><button type="button" class="copy-btn" onclick="copyValue(this)">Copy</button></div></td>
        <td><div class="input-group"><input type="text" name="dato3[]"><button type="button" class="copy-btn" onclick="copyValue(this)">Copy</button></div></td>
        <td><button class="toggle-btn no" type="button" onclick="ciclarOpcionMesa(this)">No</button></td>
        <td><button class="delete-btn" type="button" onclick="eliminarFila(this)">X</button></td>
    `;
}

function eliminarFila(boton) { boton.closest('tr').remove(); }

function ciclarOpcionMesa(boton) {
    const estadoActual = boton.textContent;
    boton.classList.remove('no', 'compartida', 'individual');
    if (estadoActual === 'No') {
        boton.textContent = 'Compartida'; boton.classList.add('compartida');
    } else if (estadoActual === 'Compartida') {
        boton.textContent = 'Individual'; boton.classList.add('individual');
    } else {
        boton.textContent = 'No'; boton.classList.add('no');
    }
}

function agregarFila2() {
    const miTablaBody = document.getElementById('miTablaBody');
    const nuevaFila = miTablaBody.insertRow();
    nuevaFila.innerHTML = `
        <td class="col-nombre-tarifa"><div class="input-group"><input type="text" name="nombreTarifa[]" /><button type="button" class="copy-btn" onclick="copyValue(this)">Copy</button></div></td>
        <td class="col-tickets-compra"><div class="input-group-above"><button type="button" class="copy-btn" onclick="copyValue(this)">Copy</button><input type="number" name="ticketsCompra[]" /></div></td>
        <td class="col-valor-tarifa"><div class="input-group-above"><button type="button" class="copy-btn" onclick="copyValue(this)">Copy</button><input type="number" class="valor-tarifa" name="valorTarifa[]" min="0" /></div></td>
        <td class="col-porcentaje-web"><input type="number" class="porcentaje-web" name="porcentajeWeb[]" placeholder="15" min="0" /></td>
        <td class="col-resultado-web"><div class="input-group-above"><button type="button" class="copy-btn" onclick="copyValue(this)">Copy</button><input type="text" class="resultado-web" name="resultadoWeb[]" readonly /></div></td>
        <td class="col-porcentaje-pos"><input type="number" class="porcentaje-boleteria" name="porcentajeBoleteria[]" placeholder="12" min="0"></td>
        <td class="col-resultado-pos"><input type="text" class="resultado-boleteria" name="resultadoBoleteria[]" readonly /></td>
        <td class="col-tickets-fase"><input type="number" name="ticketsFase[]" /></td>
        <td><button class="delete-btn" onclick="eliminarFila2(this)">X</button></td>
    `;
}

function eliminarFila2(boton) { boton.closest('tr').remove(); }

function redondearBoleteria(numero) { return Math.round(numero / 1000) * 1000; }

function calcularValores(fila) {
    const v = parseFloat(fila.querySelector('.valor-tarifa').value) || 0;
    const pW = parseFloat(fila.querySelector('.porcentaje-web').value) || 0;
    const pB = parseFloat(fila.querySelector('.porcentaje-boleteria').value) || 0;
    fila.querySelector('.resultado-web').value = ((v * pW) / 100).toFixed(0);
    const resB = (v * pB) / 100;
    fila.querySelector('.resultado-boleteria').value = redondearBoleteria(resB);
}

/* ==================================================================== */
/* 2. CÓDIGO DE INICIALIZACIÓN                                          */
/* ==================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const venueInput = document.getElementById('venueName');
    const addressInput = document.getElementById('addressLocation');
    const sectorContainer = document.getElementById('sectorContainer');
    const miTablaBody = document.getElementById('miTablaBody');
    const botonPdf = document.getElementById('btnGenerarPdf');
    const dateInput = document.getElementById('eventDate');
    const dateDisplay = document.getElementById('dateDisplay');

    if (venueInput) {
        venueInput.addEventListener('input', function() {
            const vA = { "Mood Live": "Ministro Gonzalez 40", "RucaChe": "Antártida Argentina 3901", "Espacio Duam": "San Martin 5901" };
            addressInput.value = vA[this.value] || '';
            sectorContainer.classList.toggle('hidden', this.value !== 'Mood Live');
        });
    }

    if (dateDisplay && dateInput) {
        dateDisplay.addEventListener('click', () => dateInput.showPicker());
        dateInput.addEventListener('change', (e) => {
            if (!e.target.value) return;
            const d = new Date(e.target.value + 'T00:00:00');
            dateDisplay.textContent = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
        });
    }

    if (miTablaBody) {
        miTablaBody.addEventListener('input', (e) => {
            if (e.target.matches('.valor-tarifa, .porcentaje-web, .porcentaje-boleteria')) {
                calcularValores(e.target.closest('tr'));
            }
        });
    }

    if (botonPdf) {
        botonPdf.addEventListener('click', () => {
            const lW = document.getElementById('logo-web');
            const lP = document.getElementById('logo-pdf');
            if(lW && lP) { lW.style.display = 'none'; lP.style.display = 'block'; }
            window.print();
            setTimeout(() => {
                if(lW && lP) { lW.style.display = 'block'; lP.style.display = 'none'; }
            }, 500);
        });
    }
});