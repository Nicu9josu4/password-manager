// La încărcare, verifică dacă există cereri cu status Aprobat/Respins și afișează modalul corespunzător
window.addEventListener('DOMContentLoaded', function() {
    // Actualizează culoarea dropdown-ului de prioritate la schimbare
    const prioritySelect = document.getElementById('priority');
    if (prioritySelect) {
        prioritySelect.addEventListener('change', function() {
            this.setAttribute('data-priority', this.value);
        });
    }
    // --- WEBSOCKET CLIENT ---
    // Generează sau recuperează un id unic pentru client (ex: localStorage)
    let clientId = localStorage.getItem('clientId');
    if (!clientId) {
        clientId = 'client_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('clientId', clientId);
    }
    let ws;
    try {
    ws = new WebSocket('ws://localhost:8770');
        ws.onopen = function() {
            ws.send(clientId);
        };
        ws.onmessage = function(event) {
            // Primește datele de logare de la server la aprobare
            try {
                const data = JSON.parse(event.data);
                const modal = document.createElement('div');
                modal.className = 'modal';
                modal.style = `
                    position: fixed;
                    top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(20,22,30,0.85);
                    display: flex; align-items: center; justify-content: center;
                    z-index: 1000;
                `;
                modal.innerHTML = `
                <div class="modal-content" style="background:#23272f; color:#e3e6f3; border-radius: 16px; padding: 36px 36px 24px 36px; width: 420px; box-shadow: 0 4px 32px #0008; position: relative; text-align:center;">
                    <span class="close" style="position:absolute;top:18px;right:24px;font-size:2em;cursor:pointer;color:#bbb;" onclick="this.closest('.modal').remove()">&times;</span>
                    <h2 style="color:#4caf50;margin-bottom:18px;">Cerere aprobată</h2>
                    <div style="margin:18px 0 10px 0;color:#bdbdbd;">Datele de logare:</div>
                    <div style="background:#23272f;padding:18px 18px 10px 18px;border-radius:12px;box-shadow:0 2px 12px #0003;display:inline-block;text-align:left;min-width:260px;">
                        <div style='margin-bottom:6px;'><b>Platformă:</b> <span style='color:#8ab4f8;'>${data.platforma || '-'}</span></div>
                        <div style='margin-bottom:6px;'><b>Utilizator:</b> <span style='color:#8ab4f8;'>${data.user || '-'}</span></div>
                        <div style='margin-bottom:6px;'><b>Parolă:</b> <span style='color:#ffd54f;'>${data.parola || '-'}</span></div>
                        <div style='margin-bottom:6px;'><b>Scop:</b> ${data.scop || '-'}</div>
                        <div><b>Data aprobare:</b> ${data.data || '-'}</div>
                    </div>
                </div>`;
                document.body.appendChild(modal);
            } catch (e) { console.error('Eroare parsare WS:', e); }
        };
    } catch (e) { console.error('WebSocket error:', e); }
    const history = JSON.parse(localStorage.getItem('requestHistory') || '[]');
    if (history.length === 0) return;
    const lastRequest = history[history.length - 1];
    if (lastRequest.status === 'Aprobat') {
        // Caută parola selectată de admin
        let parola = null, user = null, platforma = null;
        if (lastRequest.selectedPasswordId) {
            const passwords = JSON.parse(localStorage.getItem('passwords') || '[]');
            const selected = passwords.find(p => p.id == lastRequest.selectedPasswordId);
            if (selected) {
                parola = selected.parola;
                user = selected.username;
                platforma = selected.denumire;
            }
        }
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
        <div class="modal-content" style="max-width:420px;">
            <span class="close" style="float:right;font-size:2em;cursor:pointer;" onclick="this.closest('.modal').remove()">&times;</span>
            <h2 style="color:#4caf50;text-align:center;">Cerere aprobată</h2>
            <div style="margin:18px 0 10px 0;color:#bdbdbd;">Datele de logare:</div>
            <div style="background:#23272f;padding:18px 18px 10px 18px;border-radius:12px;box-shadow:0 2px 12px #0003;">
                <div><b>Platformă:</b> <span style="color:#8ab4f8;">${platforma || '-'}</span></div>
                <div><b>Utilizator:</b> <span style="color:#8ab4f8;">${user || '-'}</span></div>
                <div><b>Parolă:</b> <span style="color:#ffd54f;">${parola || '-'}</span></div>
                <div><b>Scop:</b> ${lastRequest.scop || '-'}</div>
                <div><b>Data aprobare:</b> ${lastRequest.data || '-'}</div>
            </div>
        </div>`;
        document.body.appendChild(modal);
    } else if (lastRequest.status === 'Respins') {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
        <div class="modal-content" style="max-width:420px;">
            <span class="close" style="float:right;font-size:2em;cursor:pointer;" onclick="this.closest('.modal').remove()">&times;</span>
            <h2 style="color:#e57373;text-align:center;">Cerere respinsă</h2>
            <div style="margin:18px 0 10px 0;color:#bdbdbd;">Cererea ta a fost respinsă de administrator.<br>Nu poți primi parola.</div>
        </div>`;
        document.body.appendChild(modal);
    }
});
document.querySelector('.request-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Include clientId pentru identificare WebSocket
    let clientId = localStorage.getItem('clientId');
    if (!clientId) {
        clientId = 'client_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('clientId', clientId);
    }
    const data = {
        nume: document.getElementById('requestName').value,
        scop: document.getElementById('purpose').value,
        detalii: document.getElementById('details').value,
        prioritate: document.getElementById('priority').value,
        data: new Date().toLocaleString(),
        clientId: clientId
    };
    // Salvează cererea în localStorage['requestHistory']
    let history = JSON.parse(localStorage.getItem('requestHistory') || '[]');
    history.push(data);
    localStorage.setItem('requestHistory', JSON.stringify(history));
    alert(`Cererea a fost trimisă!\nNume: ${data.nume}\nScop: ${data.scop}\nPrioritate: ${data.prioritate}`);
    // Resetare formular
    e.target.reset();
});

// Colorează selectul de prioritate și opțiunile în funcție de valoare
const prioritySelect = document.getElementById('priority');
function updatePriorityColor() {
    prioritySelect.classList.remove('priority-high', 'priority-medium', 'priority-low');
    let color = '';
    if (prioritySelect.value === 'ridicat') {
        prioritySelect.classList.add('priority-high');
        color = '#e57373';
    } else if (prioritySelect.value === 'mediu') {
        prioritySelect.classList.add('priority-medium');
        color = '#ffd54f';
    } else if (prioritySelect.value === 'scazut') {
        prioritySelect.classList.add('priority-low');
        color = '#81c784';
    }
    // Schimbă culoarea textului selectat (pentru compatibilitate maximă)
    prioritySelect.style.color = color;
}
// Colorează opțiunile din dropdown (doar la deschidere, nu toate browserele suportă)
Array.from(prioritySelect.options).forEach(opt => {
    if (opt.value === 'ridicat') opt.style.color = '#e57373';
    else if (opt.value === 'mediu') opt.style.color = '#ffd54f';
    else if (opt.value === 'scazut') opt.style.color = '#81c784';
});
prioritySelect.addEventListener('change', updatePriorityColor);
updatePriorityColor();
