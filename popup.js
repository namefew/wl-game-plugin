document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('configForm');
    const wsUrlInput = document.getElementById('wsUrl');
    const amountInput = document.getElementById('amount');
    const gameUrlPatternInput = document.getElementById('gameUrlPattern');
    const status = document.getElementById('status');

    // 加载配置项
    chrome.storage.local.get(['wsUrl', 'amount', 'gameUrlPattern'], function(items) {
        wsUrlInput.value = items.wsUrl || 'ws://localhost:8765/long-hu';
        amountInput.value = items.amount || 10;
        gameUrlPatternInput.value = items.gameUrlPattern || '/video/,?token=';
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const wsUrl = wsUrlInput.value;
        const amount = parseFloat(amountInput.value);
        const gameUrlPattern = gameUrlPatternInput.value;

        if (!wsUrl) {
            status.textContent = 'WebSocket服务器地址不能为空';
            status.style.color = 'red';
            return;
        }

        if (isNaN(amount)) {
            status.textContent = '金额必须是数字';
            status.style.color = 'red';
            return;
        }

        if (!gameUrlPattern) {
            status.textContent = '游戏URL特征不能为空';
            status.style.color = 'red';
            return;
        }

        try {
            new RegExp(gameUrlPattern);
        } catch (e) {
            status.textContent = '游戏URL特征不是有效的正则表达式';
            status.style.color = 'red';
            return;
        }

        chrome.storage.local.set({ wsUrl, amount, gameUrlPattern }, function() {
            status.textContent = '配置保存成功';
            status.style.color = 'green';
        });
    });
});
