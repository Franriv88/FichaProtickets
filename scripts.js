/* 1. FUNCIONES GLOBALES */

function copyValue(boton) {
    const contenedor = boton.parentElement;
    const input = contenedor.querySelector('input, textarea, select');
    if (input) {
        navigator.clipboard.writeText(input.value).then(() => {
            const originalBG = boton.style.backgroundColor;
            boton.style.backgroundColor = "#4caf50";
            setTimeout(() => { boton.style.backgroundColor = originalBG; }, 800);
        });
    }
}

function agregarFila() {
    const tbody = document.getElementById('miTabla').getElementsByTagName('tbody')[0];
    const nuevaFila = tbody.insertRow();
    nuevaFila.innerHTML = `
        <td><div class="input-group"><input type="text"><button type="button" class="copy-btn-img" onclick="copyValue(this)"><img src="icon/copy.png" alt="copy"></button></div></td>
        <td><div class="input-group"><input type="text"><button type="button" class="copy-btn-img" onclick="copyValue(this)"><img src="icon/copy.png" alt="copy"></button></div></td>
        <td><div class="input-group"><input type="text"><button type="button" class="copy-btn-img" onclick="copyValue(this)"><img src="icon/copy.png" alt="copy"></button></div></td>
        <td><button class="toggle-btn no" type="button" onclick="ciclarOpcionMesa(this)">No</button></td>
        <td><button class="delete-btn" onclick="eliminarFila(this)">X</button></td>
    `;
}

function agregarFila2() {
    const miTablaBody = document.getElementById('miTablaBody');
    const nuevaFila = miTablaBody.insertRow();
    nuevaFila.innerHTML = `
        <td><div class="input-group"><input type="text" name="nombreTarifa[]" /><button type="button" class="copy-btn-img" onclick="copyValue(this)"><img src="icon/copy.png" alt="copy"></button></div></td>
        <td><div class="input-group-above"><button type="button" class="copy-btn-img" onclick="copyValue(this)"><img src="icon/copy.png" alt="copy"></button><input type="number" name="ticketsCompra[]" /></div></td>
        <td><div class="input-group-above"><button type="button" class="copy-btn-img" onclick="copyValue(this)"><img src="icon/copy.png" alt="copy"></button><input type="number" class="valor-tarifa" name="valorTarifa[]" /></div></td>
        <td><input type="number" class="porcentaje-web mt-copy-space" name="porcentajeWeb[]" placeholder="15" /></td>
        <td><div class="input-group-above"><button type="button" class="copy-btn-img" onclick="copyValue(this)"><img src="icon/copy.png" alt="copy"></button><input type="text" class="resultado-web" name="resultadoWeb[]" readonly /></div></td>
        <td><input type="number" class="porcentaje-boleteria mt-copy-space" name="porcentajeBoleteria[]" placeholder="12" /></td>
        <td><input type="text" class="resultado-boleteria mt-copy-space" name="resultadoBoleteria[]" readonly /></td>
        <td><input type="number" class="mt-copy-space" name="ticketsFase[]" /></td>
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
    fila.querySelector('.resultado-web').value = ((v * pW) / 100).toFixed(0);
    fila.querySelector('.resultado-boleteria').value = redondearBoleteria((v * pB) / 100);
}

/* 2. INICIALIZACIÓN */
document.addEventListener('DOMContentLoaded', () => {
    const venueInput = document.getElementById('venueName');
    const addressInput = document.getElementById('addressLocation');
    const sectorContainer = document.getElementById('sectorContainer');
    const miTablaBody = document.getElementById('miTablaBody');
    const dateInput = document.getElementById('eventDate');
    const dateDisplay = document.getElementById('dateDisplay');

    if (venueInput) {
        venueInput.addEventListener('input', function() {
            const vA = { "Mood Live": "Ministro Gonzalez 40", "RucaChe": "Antártida Argentina 3901" };
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