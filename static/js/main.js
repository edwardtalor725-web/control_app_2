document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.5s';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });
    
    if (window.location.pathname === '/') {
        setInterval(() => {
            fetch('/api/cash_flow')
                .then(response => response.json())
                .then(data => {
                    console.log('Данные обновлены');
                });
        }, 30000);
    }
});

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container').prepend(notification);
    
    setTimeout(() => {
        notification.style.transition = 'opacity 0.5s';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

function checkLowBalance() {
    fetch('/api/check_balance')
        .then(response => response.json())
        .then(data => {
            if (data.low_balance) {
                showNotification(`Низкий баланс на счете "${data.account_name}": ${data.balance} руб.`, 'warning');
            }
        });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function initApp() {
    if (currentUser && currentUser.role !== 'manager') {
        setInterval(checkLowBalance, 60000);
    }
}
