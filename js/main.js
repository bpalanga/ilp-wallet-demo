import { state } from './state.js';
import { log, showToast } from './utils.js';
import { Ledger } from './ledger.js';
import { Rafiki } from './rafiki.js';

// --- Capture UI Elements ---
const ui = {
    balance: document.getElementById('balanceDisplay'),
    ppContainer: document.getElementById('paymentPointerContainer'),
    ppVal: document.getElementById('paymentPointerVal'),
    btnInit: document.getElementById('btnInit'),
    btnStream: document.getElementById('btnStream'),
    btnStop: document.getElementById('btnStopStream'),
    uplinkDot: document.getElementById('uplinkStatus'),
    logs: document.getElementById('viewLogs'),
    txList: document.getElementById('viewTransactions'),
    packet1: document.getElementById('packet1'),
    packet2: document.getElementById('packet2'),
    signatureStatus: document.getElementById('signatureStatus'),
    tabs: document.querySelectorAll('.tab'),
    views: {
        logs: document.getElementById('viewLogs'),
        transactions: document.getElementById('viewTransactions')
    },
    sendForm: document.getElementById('sendPaymentForm'),
    btnSend: document.getElementById('btnSendPayment'),
    destInput: document.getElementById('destPointer'),
    amountInput: document.getElementById('sendAmount'),
    toast: document.getElementById('toast')
};

// --- Click Handlers ---

ui.btnInit.addEventListener('click', async () => {
    ui.btnInit.disabled = true;
    ui.btnInit.textContent = 'Connecting...';
    await Rafiki.connect(ui);
    ui.ppVal.textContent = state.paymentPointer;
    ui.ppContainer.style.display = 'block';
    ui.btnStream.disabled = false;
    ui.btnInit.textContent = 'Wallet Active';
    ui.btnInit.classList.replace('btn-primary', 'btn-outline');
    log(ui, 'SYS', `Wallet Initialized. Pointer: ${state.paymentPointer}`, 'success');
});

ui.btnStream.addEventListener('click', () => {
    state.isStreaming = true;
    ui.btnStream.style.display = 'none';
    ui.btnStop.style.display = 'inline-block';
    ui.packet1.classList.add('active');
    ui.packet2.classList.add('active');
    Rafiki.createIncomingPayment(ui);
    log(ui, 'WMP', 'Web Monetization detector active.');

    state.streamInterval = setInterval(() => {
        if (!state.isStreaming) return;
        Rafiki.processPacket(ui, Math.random() * 0.0005);
    }, 800);
});

ui.btnStop.addEventListener('click', () => {
    state.isStreaming = false;
    clearInterval(state.streamInterval);
    ui.btnStream.style.display = 'inline-block';
    ui.btnStop.style.display = 'none';
    ui.packet1.classList.remove('active');
    ui.packet2.classList.remove('active');
    log(ui, 'WMP', 'Stream paused.');
});

ui.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        ui.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        if (target === 'logs') {
            ui.views.logs.style.display = 'flex';
            ui.views.transactions.style.display = 'none';
            ui.sendForm.style.display = 'none';
        } else {
            ui.views.logs.style.display = 'none';
            ui.views.transactions.style.display = 'flex';
            ui.sendForm.style.display = 'block';
        }
    });
});

ui.btnSend.addEventListener('click', () => {
    const amount = parseFloat(ui.amountInput.value);
    const dest = ui.destInput.value;
    if(!amount || amount <= 0) {
        showToast(ui, 'Invalid amount');
        return;
    }
    Rafiki.sendPayment(ui, amount, dest);
});