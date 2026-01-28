// Основной JavaScript файл

// Автоматическое скрытие alert сообщений через 5 секунд
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.5s';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });
    
    // Обновление данных каждые 30 секунд (только на dashboard)
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

// Функция для показа уведомления
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

// Проверка низкого баланса
function checkLowBalance() {
    fetch('/api/check_balance')
        .then(response => response.json())
        .then(data => {
            if (data.low_balance) {
                showNotification(`Низкий баланс на счете "${data.account_name}": ${data.balance} руб.`, 'warning');
            }
        });
}

// Инициализация при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

function initApp() {
    // Проверяем баланс каждые 60 секунд
    if (currentUser && currentUser.role !== 'manager') {
        setInterval(checkLowBalance, 60000);
    }
}