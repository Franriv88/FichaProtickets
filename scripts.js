/* ======================================================= */
/* 1. FUNCIONES GLOBALES                                   */
/* ======================================================= */

function agregarFila() {
    const tbody = document.getElementById('miTabla').getElementsByTagName('tbody')[0];
    const nuevaFila = tbody.insertRow();
    nuevaFila.innerHTML = `
        <td><input type="text" name="dato1[]"></td>
        <td><input type="text" name="dato2[]"></td>
        <td><input type="text" name="dato3[]"></td>
        <td><button class="toggle-btn no" type="button" onclick="ciclarOpcionMesa(this)">No</button></td>
        <td><button class="delete-btn" onclick="eliminarFila(this)">X</button></td>
    `;
}

function agregarFila2() {
    const miTablaBody = document.getElementById('miTablaBody');
    const nuevaFila = miTablaBody.insertRow();
    nuevaFila.innerHTML = `
        <td><input type="text" name="nombreTarifa[]" /></td>
        <td><input type="number" name="ticketsCompra[]" /></td>
        <td><input type="number" class="valor-tarifa" name="valorTarifa[]" /></td>
        <td><input type="number" class="porcentaje-web" placeholder="15" /></td>
        <td><input type="text" class="resultado-web" readonly /></td>
        <td><input type="number" class="porcentaje-boleteria" placeholder="12" /></td>
        <td><input type="text" class="resultado-boleteria" readonly /></td>
        <td><input type="number" name="ticketsFase[]" /></td>
        <td><button class="delete-btn" onclick="eliminarFila2(this)">X</button></td>
    `;
}

function eliminarFila(boton) { boton.closest('tr').remove(); }
function eliminarFila2(boton) { boton.closest('tr').remove(); }

function ciclarOpcionMesa(boton) {
    const estadoActual = boton.textContent;
    boton.classList.remove('no', 'compartida', 'individual');
    if (estadoActual === 'No') { boton.textContent = 'Compartida'; boton.classList.add('compartida'); }
    else if (estadoActual === 'Compartida') { boton.textContent = 'Individual'; boton.classList.add('individual'); }
    else { boton.textContent = 'No'; boton.classList.add('no'); }
}

function redondearBoleteria(numero) { return Math.round(numero / 1000) * 1000; }

function calcularValores(fila) {
    const v = parseFloat(fila.querySelector('.valor-tarifa').value) || 0;
    const pW = parseFloat(fila.querySelector('.porcentaje-web').value) || 0;
    const pB = parseFloat(fila.querySelector('.porcentaje-boleteria').value) || 0;
    
    const resW = fila.querySelector('.resultado-web');
    const resB = fila.querySelector('.resultado-boleteria');
    
    if(resW) resW.value = ((v * pW) / 100).toFixed(0);
    if(resB) resB.value = redondearBoleteria((v * pB) / 100);
}

/* 2. INICIALIZACIÓN */
document.addEventListener('DOMContentLoaded', () => {
    const producerInput = document.getElementById('productoraInput');
    const cuitInput = document.getElementById('productoraCuit');
    const venueInput = document.getElementById('venueName');
    const addressInput = document.getElementById('addressLocation');
    const sectorContainer = document.getElementById('sectorContainer');
    const miTablaBody = document.getElementById('miTablaBody');
    const dateInput = document.getElementById('eventDate');
    const dateDisplay = document.getElementById('dateDisplay');

    if (producerInput && cuitInput) {
        producerInput.addEventListener('input', function() {
            const cuits = { "Green&Five S.A.": "33-71649874-9", "FIVE PRO EVENTS S.A.": "30-71536330-1" };
            cuitInput.value = cuits[this.value] || '';
        });
    }

    if (venueInput) {
        venueInput.addEventListener('input', function() {
            const vA = { "Mood Live": "Ministro Gonzalez 40", "RucaChe": "Antártida Argentina 3901", "Espacio Duam": "San Martin 5901" };
            addressInput.value = vA[this.value] || '';
            if(sectorContainer) sectorContainer.classList.toggle('hidden', this.value !== 'Mood Live');
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

    const btnPdf = document.getElementById('btnGenerarPdf');
    if (btnPdf) {
        btnPdf.addEventListener('click', () => {
            const lW = document.getElementById('logo-web');
            const lP = document.getElementById('logo-pdf');
            if(lW) lW.style.display = 'none';
            if(lP) lP.style.display = 'block';
            window.print();
            setTimeout(() => { if(lW) lW.style.display = 'block'; if(lP) lP.style.display = 'none'; }, 500);
        });
    }
});

flatpickr(".timepicker", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    time_24hr: true,
    // Aquí puedes añadir más configuración
});