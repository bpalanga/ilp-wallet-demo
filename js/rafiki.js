import { state } from './state.js';
import { generateId, log, showToast } from './utils.js';
import { Ledger } from './ledger.js';

export const Rafiki = {
    connect: (ui) => {
        log(ui, 'NET', 'Attempting handshake with Rafiki Uplink...');
        return new Promise((resolve) => {
            setTimeout(() => {
                state.isConnected = true;
                state.paymentPointer = `$ilp.demo/wallet/${generateId()}`;
                ui.uplinkDot.classList.add('active');
                ui.signatureStatus.innerHTML = '🔒 Verified (GNAP)';
                ui.signatureStatus.style.color = 'var(--accent)';
                resolve(true);
            }, 1500);
        });
    },

    createIncomingPayment: (ui) => {
        log(ui, 'API', 'POST /incoming-payments (200 OK)', 'success');
    },

    processPacket: (ui, amount) => {
        const isValid = Math.random() > 0.05;
        if (!isValid) {
            log(ui, 'SEC', 'Packet Signature Invalid - Dropping', 'warn');
            return false;
        }

        log(ui, 'ILP', `Packet received [${amount.toFixed(5)} XRP]. Verifying...`);
        Ledger.updateBalance(ui, amount);
        Ledger.recordTransaction(ui, {
            id: generateId(),
            amount: amount,
            description: 'Web Monetization',
            type: 'incoming',
            timestamp: Date.now()
        });
        return true;
    },

    sendPayment: (ui, amount, destination) => {
        log(ui, 'ILP', `Requesting Quote for ${amount} XRP to ${destination}...`);
        
        setTimeout(() => {
            log(ui, 'ILP', `Quote received: 1 XRP = 1 XRP (Fixed Rate)`);
            log(ui, 'NET', 'Streaming packets outbound...');
            ui.packet1.classList.add('reverse');
            ui.packet2.classList.add('reverse');

            setTimeout(() => {
                if (state.balance >= amount) {
                    Ledger.updateBalance(ui, -amount);
                    Ledger.recordTransaction(ui, {
                        id: generateId(),
                        amount: amount,
                        description: `Payout: ${destination}`,
                        type: 'outgoing',
                        timestamp: Date.now()
                    });
                    log(ui, 'API', 'Transaction Successful', 'success');
                    showToast(ui, `Sent ${amount} XRP successfully`);
                } else {
                    log(ui, 'ERR', 'Insufficient Funds', 'warn');
                    showToast(ui, 'Error: Insufficient Funds');
                }
                ui.packet1.classList.remove('reverse');
                ui.packet2.classList.remove('reverse');
            }, 2000);
        }, 1000);
    }
};