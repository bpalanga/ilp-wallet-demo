import { state } from './state.js';
import { formatCurrency } from './utils.js';

export const Ledger = {
    updateBalance: (ui, amount) => {
        state.balance += amount;
        ui.balance.textContent = formatCurrency(state.balance);
        ui.balance.style.color = amount > 0 ? 'var(--accent)' : 'var(--text-main)';
        setTimeout(() => ui.balance.style.color = 'var(--text-main)', 300);
    },

    recordTransaction: (ui, tx) => {
        state.transactions.unshift(tx);
        Ledger.renderTransactions(ui);
    },

    renderTransactions: (ui) => {
        ui.txList.innerHTML = '';
        state.transactions.forEach(tx => {
            const item = document.createElement('div');
            item.className = 'tx-item';
            const isOut = tx.type === 'outgoing';
            item.innerHTML = `
                <div class="tx-info">
                    <h5>${tx.description}</h5>
                    <span>${tx.id}</span>
                </div>
                <div class="tx-amount ${isOut ? 'out' : 'in'}">
                    ${isOut ? '-' : '+'}${formatCurrency(tx.amount)} XRP
                </div>
            `;
            ui.txList.appendChild(item);
        });
    }
};