export const formatCurrency = (num) => {
    return num.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const log = (ui, source, message, type = 'info') => {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    const time = new Date().toLocaleTimeString().split(' ')[0];
    let colorClass = '';
    if (type === 'success') colorClass = 'success';
    if (type === 'warn') colorClass = 'warn';

    entry.innerHTML = `<span>[${time}] ${source}:</span> <span class="${colorClass}">${message}</span>`;
    ui.logs.prepend(entry);
    
    if (ui.logs.children.length > 50) {
        ui.logs.removeChild(ui.logs.lastChild);
    }
};

export const showToast = (ui, msg) => {
    ui.toast.textContent = msg;
    ui.toast.classList.add('visible');
    setTimeout(() => ui.toast.classList.remove('visible'), 3000);
};