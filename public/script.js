const encryptBtn = document.getElementById('encryptBtn');
const textInput = document.getElementById('textInput');
const shiftInput = document.getElementById('shiftInput');
const keyInput = document.getElementById('keyInput');
const resultOutput = document.getElementById('resultOutput');
const historyList = document.getElementById('historyList');
const tabs = document.querySelectorAll('.tab');
const actionRadios = document.querySelectorAll('input[name="cipherAction"]');

let currentMethod = 'caesar';
let currentAction = 'encrypt';

// Action Switching
actionRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentAction = e.target.value;
        encryptBtn.textContent = currentAction === 'encrypt' ? 'Encrypt' : 'Decrypt';
    });
});

// Tab Switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentMethod = tab.dataset.target;

        if (currentMethod === 'caesar') {
            document.getElementById('caesar-inputs').classList.remove('hidden');
            document.getElementById('vigenere-inputs').classList.add('hidden');
        } else {
            document.getElementById('caesar-inputs').classList.add('hidden');
            document.getElementById('vigenere-inputs').classList.remove('hidden');
        }
    });
});

// Encrypt Function
encryptBtn.addEventListener('click', async () => {
    const text = textInput.value;
    if (!text) return alert('Please enter some text');

    let body = { text };
    let endpoint = '';

    if (currentMethod === 'caesar') {
        const shift = shiftInput.value;
        if (shift === '') return alert('Please enter a shift value');
        body.shift = shift;
        endpoint = currentAction === 'encrypt' ? '/api/cipher/caesar' : '/api/cipher/caesar/decrypt';
    } else {
        const key = keyInput.value;
        if (!key) return alert('Please enter an encryption key');
        body.key = key;
        endpoint = currentAction === 'encrypt' ? '/api/cipher/vigenere' : '/api/cipher/vigenere/decrypt';
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (response.ok) {
            resultOutput.textContent = data.result;
            loadHistory(); // Refresh history
        } else {
            alert(data.message || 'Encryption failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong');
    }
});

// Load History
async function loadHistory() {
    try {
        const response = await fetch('/api/cipher/history');
        const logs = await response.json();

        historyList.innerHTML = logs.map(log => `
            <li class="history-item">
                <div class="history-content">
                    <div style="font-weight: 500;">${log.encryptedText}</div>
                    <div class="history-meta">
                        ${log.algorithm.toUpperCase()} • Key: ${log.key}
                    </div>
                </div>
            </li>
        `).join('');
    } catch (error) {
        console.error('Failed to load history:', error);
    }
}

function getActionBadge(action) {
    if (!action) return '';
    const color = action === 'encrypt' ? 'var(--accent-color)' : '#10b981'; // Blue for encrypt, Green for decrypt
    return `<span style="color: ${color}; font-weight: 700; font-size: 0.7rem; text-transform: uppercase; margin-right: 6px;">${action}</span>`;
}

// Load History
async function loadHistory() {
    try {
        const response = await fetch('/api/cipher/history');
        const logs = await response.json();

        historyList.innerHTML = logs.map(log => `
            <li class="history-item">
                <div class="history-content">
                    <div style="font-weight: 500;">${log.encryptedText}</div>
                    <div class="history-meta">
                        ${getActionBadge(log.action)}
                        ${log.algorithm.toUpperCase()} • Key: ${log.key}
                    </div>
                </div>
            </li>
        `).join('');
    } catch (error) {
        console.error('Failed to load history:', error);
    }
}

// Initial Load
loadHistory();
