let contadorSectores = 0;

document.addEventListener('DOMContentLoaded', () => {
    // 1. AUTOCOMPLETADO (RESTAURADO)
    const producerInput = document.getElementById('productoraInput');
    const cuitInput = document.getElementById('productoraCuit');
    const venueInput = document.getElementById('venueName');
    const addressInput = document.getElementById('addressLocation');

    if (producerInput && cuitInput) {
        producerInput.addEventListener('input', function() {
            const cuits = {
                "Green&Five S.A.": "33-71649874-9",
                "FIVE PRO EVENTS S.A.": "30-71536330-1",
                "PRO TICKETS S.R.L": "30-71830826-3",
                "MOTOCROSS CLUB NEUQUÉN": "30-70708289-1"
            };
            cuitInput.value = cuits[this.value] || '';
        });
    }

    if (venueInput && addressInput) {
        venueInput.addEventListener('input', function() {
            const venues = {
                "Mood Live": "Ministro Gonzalez 40",
                "RucaChe": "Antártida Argentina 3901",
                "Espacio Duam": "San Martin 5901",
                "Cipolletti": "Cipolletti, Río Negro",
                "Paseo de la Costa": "Isla 132, Neuquén",
                "Autódromo Parque Ciudad de Centenario": "Ruta Provincial 7, a la altura del km 1337, Neuquén",
                "Motocross Club Neuquén": "Dr. René G. Favaloro, Neuquén"
            };
            addressInput.value = venues[this.value] || '';
        });
    }

    // 2. OTROS LISTENERS
    const dateInput = document.getElementById('eventDate');
    const dateDisplay = document.getElementById('dateDisplay');
    if (dateDisplay && dateInput) {
        dateDisplay.addEventListener('click', () => dateInput.showPicker());
        dateInput.addEventListener('change', (e) => {
            if (!e.target.value) return;
            const d = new Date(e.target.value + 'T00:00:00');
            dateDisplay.textContent = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
        });
    }

    agregarSector();
    flatpickr(".timepicker", { enableTime: true, noCalendar: true, dateFormat: "H:i", time_24hr: true });
    document.getElementById('btnGenerarPdf').addEventListener('click', () => { window.print(); });
});

function agregarSector() {
    contadorSectores++;
    const id = contadorSectores;

    const tbody = document.querySelector('#tablaSectores tbody');
    const fila = document.createElement('tr');
    fila.id = `fila-sector-${id}`;
    fila.innerHTML = `
        <td><input type="text" placeholder="Sector" oninput="vincularNombre(${id}, this.value)" /></td>
        <td><input type="number" /></td>
        <td><input type="text" /></td>
        <td><button class="add-btn" type="button" onclick="this.textContent = (this.textContent === 'No' ? 'Si' : 'No')">No</button></td>
        <td><button class="delete-btn" type="button" onclick="eliminarSector(${id})">X</button></td>
    `;
    tbody.appendChild(fila);

    const contenedor = document.getElementById('contenedor-tarifas');
    const fs = document.createElement('fieldset');
    fs.id = `fieldset-tarifas-${id}`;
    fs.innerHTML = `
        <legend id="legend-${id}">TARIFAS - (Escriba nombre)</legend>
        <div class="tarifas-controls">
            <button type="button" class="add-btn" onclick="agregarFilaTarifa(${id})">+ Agregar Tarifa</button>
            <div class="control-item">
                <label>Nominados:</label>
                <span class="switch-text">No</span>
                <label class="switch-container"><input type="checkbox" onchange="toggleSwitchText(this)"><span class="slider"></span></label>
                <span class="switch-text">Si</span>
            </div>
            <div class="control-item">
                <label>Transferencias:</label>
                <button type="button" class="btn-ciclo infinitas" onclick="ciclarTransf(this)">Infinitas</button>
            </div>
        </div>
        <table class="table-wrapper">
            <thead><tr><th>Nombre</th><th>Cant</th><th>$ Valor</th><th>% Web</th><th>$ Web</th><th>% POS</th><th>$ POS</th><th>Hasta<th></tr></thead>
            <tbody id="body-tarifas-${id}"></tbody>
        </table>
    `;
    contenedor.appendChild(fs);
    agregarFilaTarifa(id);
}

function toggleSwitchText(checkbox) {
    const parent = checkbox.closest('.control-item');
    const texts = parent.querySelectorAll('.switch-text');
    texts[0].style.opacity = checkbox.checked ? "0.3" : "1";
    texts[1].style.opacity = checkbox.checked ? "1" : "0.3";
}

function ciclarTransf(btn) {
    const estados = ["Infinitas", "Intransferible", "1", "2", "3", "4", "5"];
    let idx = (estados.indexOf(btn.textContent) + 1) % estados.length;
    let valor = estados[idx];
    btn.textContent = valor;
    btn.className = 'btn-ciclo ' + (valor === "Infinitas" ? "infinitas" : valor === "Intransferible" ? "intransferible" : "contador");
}

function vincularNombre(id, val) {
    document.getElementById(`legend-${id}`).textContent = val ? `TARIFAS - ${val.toUpperCase()}` : "TARIFAS - (Escriba nombre)";
}

function eliminarSector(id) {
    if(confirm("¿Eliminar sector?")) {
        document.getElementById(`fila-sector-${id}`).remove();
        document.getElementById(`fieldset-tarifas-${id}`).remove();
    }
}

function agregarFilaTarifa(id) {
    const tr = document.getElementById(`body-tarifas-${id}`).insertRow();
    tr.innerHTML = `
        <td class="col-nombre-tarifa"><input type="text" ></td>
        <td class="col-tickets-compra"><input type="number"></td>
        <td class="col-valor-tarifa"><input type="number" class="v-tar" oninput="calc(this)"></td>
        <td class="col-porcentaje-web"><input type="number" class="p-web" placeholder="15" oninput="calc(this)"></td>
        <td><input type="text" class="r-web" readonly></td>
        <td class="col-porcentaje-pos"><input type="number" class="p-pos" placeholder="12" oninput="calc(this)"></td>
        <td><input type="text" class="r-pos" readonly></td>
        <td  class="col-tickets-fase"><input typye="text"></td>
        <td><button class="delete-btn" onclick="this.closest('tr').remove()">X</button></td>
    `;
}

function calc(el) {
    const tr = el.closest('tr');
    const v = parseFloat(tr.querySelector('.v-tar').value) || 0;
    const pw = parseFloat(tr.querySelector('.p-web').value) || 0;
    const pp = parseFloat(tr.querySelector('.p-pos').value) || 0;
    tr.querySelector('.r-web').value = (v * pw / 100).toFixed(0);
    tr.querySelector('.r-pos').value = Math.round((v * pp / 100) / 1000) * 1000;
}