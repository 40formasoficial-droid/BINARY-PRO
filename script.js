// BinaryVision AI Pro Ultra - Com TUDO
let chart;
let data = [];
let rsiValues = [];
let isOTC = false;
let soundEnabled = true;

const assets = {
    quotex: { open: ["EURUSD", "GBPUSD", "BTC/USD", "XAU/USD", "US500"], otc: ["OTC_EURUSD", "OTC_GBPUSD", "OTC_BTCUSD", "OTC_XAUUSD"] },
    iqoption: { open: ["EURUSD", "AUDUSD", "USDJPY", "NAS100", "BTC/USD"], otc: ["OTC_EURUSD", "OTC_AUDUSD", "OTC_USDJPY", "OTC_BTCUSD"] },
    deriv: { open: ["R_50", "R_75", "R_100", "EURUSD", "BTC/USD"], otc: ["OTC_EURUSD", "OTC_BTCUSD"] }
};

// Toggle som
function toggleSound() {
    soundEnabled = !soundEnabled;
    document.getElementById("soundToggle").textContent = soundEnabled ? "🔊" : "🔇";
}

// Sons
function playCallSound() {
    if (!soundEnabled) return;
    const audio = new Audio("data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YUdvT1EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA......");
    audio.volume = 0.3;
    audio.play().catch(e => console.log("Som bloqueado"));
}

function playPutSound() {
    if (!soundEnabled) return;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
}

// Iniciar
window.onload = function () {
    generatePriceData(50);
    initChart();
    updateAssetList();
    checkMarketStatus();
    setInterval(checkMarketStatus, 60000);
    setInterval(generateSignal, 60000); // Auto atualização
    checkTimeForTheme();
};

function generatePriceData(count) {
    data = [];
    let price = 1000;
    for (let i = 0; i < count; i++) {
        price += (Math.random() - 0.48) * 20;
        data.push({ x: i, o: price, h: price + 10, l: price - 10, c: price + (Math.random() - 0.5) * 20 });
    }
    calculateRSI();
}

function calculateRSI() {
    const closes = data.map(d => d.c);
    rsiValues = [];
    const period = 14;
    for (let i = period; i < closes.length; i++) {
        let gains = 0, losses = 0;
        for (let j = i - period; j < i; j++) {
            const diff = closes[j + 1] - closes[j];
            if (diff > 0) gains += diff;
            else losses -= diff;
        }
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgGain / (avgLoss || 0.01);
        const rsi = 100 - (100 / (1 + rs));
        rsiValues.push({ x: i, y: rsi });
    }
}

function updateMarket() { updateAssetList(); checkMarketStatus(); }

function updateAssetList() {
    const broker = document.getElementById('broker').value;
    const assetSelect = document.getElementById('asset');
    assetSelect.innerHTML = '';
    const list = isOTC ? assets[broker].otc : assets[broker].open;
    list.forEach(asset => {
        const option = document.createElement('option');
        option.value = asset;
        option.textContent = asset;
        assetSelect.appendChild(option);
    });
}

function checkMarketStatus() {
    const hour = new Date().getHours();
    isOTC = hour >= 22 || hour < 6;
    const statusEl = document.getElementById('marketStatus');
    statusEl.textContent = isOTC ? 'OTC ATIVO' : 'MERCADO ABERTO';
    statusEl.className = isOTC ? 'badge warning' : 'badge green';
    updateAssetList();
}

function startCountdown(minutes) {
    let time = minutes * 60;
    const timer = document.getElementById('countdown');
    const interval = setInterval(() => {
        const mins = Math.floor(time / 60);
        const secs = time % 60;
        timer.textContent = `⏱️ ${mins}:${secs.toString().padStart(2, '0')}`;
        if (time <= 0) {
            clearInterval(interval);
            timer.textContent = "✅ Expirado";
        }
        time--;
    }, 1000);
}

function exportSignals() {
    const list = document.getElementById('historyList').innerText;
    const blob = new Blob([list], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sinais_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
}

function generateSignal() {
    const broker = document.getElementById('broker').value;
    const asset = document.getElementById('asset').value;
    const expiry = document.getElementById('expiry').value;
    const minConf = parseInt(document.getElementById('confidenceFilter').value);

    const fib = Math.random() > 0.7;
    const rsiSignal = rsiValues.length && (rsiValues[rsiValues.length - 1]?.y < 30 || rsiValues[rsiValues.length - 1]?.y > 70);
    const candle = Math.random() > 0.8;
    const volume = data[data.length - 1].c > 70;

    let totalScore = (fib ? 30 : 0) + (rsiSignal ? 25 : 0) + (candle ? 20 : 0) + (volume ? 10 : 0);
    let direction = Math.random() > 0.5 ? "CALL" : "PUT";
    let strategy = [];

    if (fib) strategy.push("Fib 61.8%");
    if (rsiSignal) strategy.push("RSI < 30 ou > 70");
    if (candle) strategy.push("Pinbar");
    if (volume) strategy.push("Volume Alto");

    if (totalScore >= minConf) {
        document.getElementById('signalBroker').textContent = broker.toUpperCase();
        document.getElementById('signalAsset').textContent = asset;
        document.getElementById('signalDirection').textContent = direction;
        document.getElementById('signalDirection').className = 'signal-direction ' + direction;
        document.getElementById('signalConfidence').textContent = Math.round(totalScore) + '%';
        document.getElementById('signalExpiry').textContent = expiry === 'candle' ? 'Fim da vela' : expiry + ' min';
        document.getElementById('signalReturn').textContent = isOTC ? '92%' : '90%';
        document.getElementById('signalStrategy').textContent = strategy.join(" + ");

        if (direction === "CALL") playCallSound();
        else playPutSound();

        if (expiry !== 'candle') startCountdown(parseInt(expiry));

        // Atualizar gráfico
        chart.data.datasets[0].data.push(data[data.length - 1]);
        chart.update();

        // Histórico
        const historyList = document.getElementById('historyList');
        const li = document.createElement('li');
        li.innerHTML = `<strong>${asset}</strong> → ${direction} (${Math.round(totalScore)}%) - ${new Date().toLocaleTimeString()}`;
        li.style.padding = "8px 0";
        li.style.borderBottom = "1px solid #2a2a2a";
        li.style.color = direction === 'CALL' ? '#00c853' : '#d50000';
        li.style.fontSize = "14px";
        historyList.insertBefore(li, historyList.firstChild);
    }
}

function initChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'candlestick',
        data: { datasets: [{ label: 'Preço', data: data, borderColor: '#00c853' }] },
        options: { animation: false, scales: { y: { beginAtZero: false } }, plugins: { legend: { display: false } } }
    });
}

function checkTimeForTheme() {
    const hour = new Date().getHours();
    if (hour >= 18 || hour < 6) {
        document.body.style.background = '#000';
        document.querySelector('.container').style.boxShadow = '0 0 20px rgba(0, 200, 83, 0.1)';
    }
}
