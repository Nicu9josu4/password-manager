// admin_request.js
// Extrage indexul cererii din query string
function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

function populateRequestDetails() {
    // Extragere cerere corectă la început
    const reqIdx = parseInt(getQueryParam('request'), 10);
    const requests = JSON.parse(localStorage.getItem('requestHistory') || '[]');
    const request = (Number.isInteger(reqIdx) && requests[reqIdx]) ? requests[reqIdx] : (requests[0] || {});
    // Data și ora cererii (format clar, în meta)
    const dateRow = document.querySelector('.request-time');
    if (dateRow) dateRow.textContent = request.data || '-';

    // Populează lista de parole pentru selectare
    const passwords = JSON.parse(localStorage.getItem('passwords') || '[]');
    const passwordSelect = document.getElementById('passwordSelect');
    const passwordDetails = document.getElementById('passwordDetails');
    if (passwordSelect) {
        passwordSelect.innerHTML = '<option value="">-- Selectează o parolă --</option>';
        passwords.forEach(p => {
            passwordSelect.innerHTML += `<option value="${p.id}">${p.denumire} (${p.username})</option>`;
        });
        passwordSelect.onchange = function() {
            const selected = passwords.find(p => p.id == this.value);
            if (selected) {
                passwordDetails.innerHTML = `<b>Platformă:</b> ${selected.denumire}<br><b>Utilizator:</b> ${selected.username}<br><b>Parolă:</b> <span style='color:#ffd54f;'>${selected.parola}</span>`;
            } else {
                passwordDetails.innerHTML = '';
            }
        };
        // Dacă cererea are deja o parolă selectată, preselectează
        if (request.selectedPasswordId) {
            passwordSelect.value = request.selectedPasswordId;
            const selected = passwords.find(p => p.id == request.selectedPasswordId);
            if (selected) {
                passwordDetails.innerHTML = `<b>Platformă:</b> ${selected.denumire}<br><b>Utilizator:</b> ${selected.username}<br><b>Parolă:</b> <span style='color:#ffd54f;'>${selected.parola}</span>`;
            }
        }
    }

    // Populează UI-ul cu datele cererii
    // Titlu cerere (nume sau mesaj sau fallback)
    document.getElementById('requestTitle').textContent = request.nume || request.titlu || request.mesaj || request.scop || 'Cerere acces parole';
    // Status
    const statusValue = request.status || 'Requested';
    // Status
    const statusEl = document.querySelector('.request-status');
    if (statusEl) statusEl.textContent = statusValue;
    // Status din meta
    const statusMeta = Array.from(document.querySelectorAll('.request-label')).find(el => el.textContent.includes('Status:'));
    if (statusMeta && statusMeta.nextElementSibling) statusMeta.nextElementSibling.textContent = statusValue;

    // Solicitant
    const solicitantMeta = Array.from(document.querySelectorAll('.request-label')).find(el => el.textContent.includes('Solicitant:'));
    if (solicitantMeta && solicitantMeta.nextElementSibling) solicitantMeta.nextElementSibling.textContent = request.nume || '-';

    // Scop
    const scopMeta = Array.from(document.querySelectorAll('.request-label')).find(el => el.textContent.includes('Scop:'));
    if (scopMeta && scopMeta.nextElementSibling) scopMeta.nextElementSibling.textContent = request.scop || '-';

    // Detalii
    const detaliiMeta = Array.from(document.querySelectorAll('.request-label')).find(el => el.textContent.includes('Detalii:'));
    if (detaliiMeta && detaliiMeta.nextElementSibling) detaliiMeta.nextElementSibling.textContent = request.detalii || '-';

    // Prioritate
    const prioritateMeta = Array.from(document.querySelectorAll('.request-label')).find(el => el.textContent.includes('Prioritate:'));
    if (prioritateMeta && prioritateMeta.nextElementSibling) prioritateMeta.nextElementSibling.textContent = request.prioritate || '-';

    // Data
    const dataMeta = document.querySelector('.request-time');
    if (dataMeta) dataMeta.textContent = request.data || '-';

    // Butoane aprobare/respingere
    const approveBtn = document.querySelector('.approve-btn');
    const rejectBtn = document.querySelector('.reject-btn');
    approveBtn.onclick = function(e) {
        e.preventDefault();
        // Salvează parola selectată în cerere
        if (passwordSelect && passwordSelect.value) {
            request.selectedPasswordId = passwordSelect.value;
        } else {
            alert('Selectează o parolă pentru a aproba cererea!');
            return;
        }
        request.status = 'Aprobat';
        requests[reqIdx] = request;
        localStorage.setItem('requestHistory', JSON.stringify(requests));
        populateRequestDetails();
        // --- WEBSOCKET: Trimite datele către client dacă există clientId ---
        if (request.clientId) {
            try {
                const selected = passwords.find(p => p.id == request.selectedPasswordId);
                if (selected) {
                    const ws = new WebSocket('ws://localhost:8770');
                    ws.onopen = function() {
                        ws.send('admin'); // identificare admin
                        ws.send(JSON.stringify({
                            to: request.clientId,
                            platforma: selected.denumire,
                            user: selected.username,
                            parola: selected.parola,
                            scop: request.scop,
                            data: request.data
                        }));
                        ws.close();
                    };
                }
            } catch (e) { console.error('WebSocket admin error:', e); }
        }
        alert('Cererea a fost aprobată! Parola va fi trimisă clientului.');
    };
    rejectBtn.onclick = function(e) {
        e.preventDefault();
        request.status = 'Respins';
        requests[reqIdx] = request;
        localStorage.setItem('requestHistory', JSON.stringify(requests));
        populateRequestDetails();
        alert('Cererea a fost respinsă! Accesul clientului rămâne blocat.');
    };
}

window.addEventListener('DOMContentLoaded', populateRequestDetails);
