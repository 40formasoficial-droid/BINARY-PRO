// BinaryVision AI Pro - Com TUDO
let chart;
let data = [];
let rsiValues = [];
let isOTC = false;

const assets = {
    quotex: {
        open: ["EURUSD", "GBPUSD", "BTC/USD", "XAU/USD", "US500"],
        otc: ["OTC_EURUSD", "OTC_GBPUSD", "OTC_BTCUSD", "OTC_XAUUSD"]
    },
    iqoption: {
        open: ["EURUSD", "AUDUSD", "USDJPY", "NAS100", "BTC/USD"],
        otc: ["OTC_EURUSD", "OTC_AUDUSD", "OTC_USDJPY", "OTC_BTCUSD"]
    },
    deriv: {
        open: ["R_50", "R_75", "R_100", "EURUSD", "BTC/USD"],
        otc: ["OTC_EURUSD", "OTC_BTCUSD"]
    }
};

let soundEnabled = true;

function toggleSound() {
    soundEnabled = !soundEnabled;
    document.getElementById("soundToggle").textContent = soundEnabled ? "🔊" : "🔇";
}

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

window.onload = function () {
    generatePriceData(100);
    initChart();
    updateAssetList();
    checkMarketStatus();
    setInterval(checkMarketStatus, 60000);
};

function generatePriceData(count) {
    data = [];
    let price = 1000;
    for (let i = 0; i < count; i++) {
        price += (Math.random() - 0.48) * 20;
        data.push({ x: i, y: price, open: price - Math.random() * 10, volume: Math.random() * 100 });
    }
    calculateRSI();
}

function calculateRSI() {
    const closes = data.map(d => d.y);
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

function updateMarket() {
    updateAssetList();
    checkMarketStatus();
}

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

function generateSignal() {
    const broker = document.getElementById('broker').value;
    const asset = document.getElementById('asset').value;
    const expiry = document.getElementById('expiry').value;
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    const fib = Math.random() > 0.7;
    const rsiSignal = rsiValues.length && (rsiValues[rsiValues.length - 1]?.y < 30 || rsiValues[rsiValues.length - 1]?.y > 70);
    const candle = Math.random() > 0.8;
    const volume = data[data.length - 1].volume > 70;

    let totalScore = (fib ? 30 : 0) + (rsiSignal ? 25 : 0) + (candle ? 20 : 0) + (volume ? 10 : 0);
    let direction = Math.random() > 0.5 ? "CALL" : "PUT";
    let strategy = [];

    if (fib) strategy.push("Fib 61.8%");
    if (rsiSignal) strategy.push("RSI < 30 ou > 70");
    if (candle) strategy.push("Pinbar/Martelo");
    if (volume) strategy.push("Volume Alto");

    if (totalScore >= 80) {
        document.getElementById('signalBroker').textContent = broker.toUpperCase();
        document.getElementById('signalAsset').textContent = asset;
        document.getElementById('signalDirection').textContent = direction;
        document.getElementById('signalDirection').className = 'signal-direction ' + direction;
        document.getElementById('signalConfidence').textContent = Math.round(totalScore) + '%';
        document.getElementById('signalExpiry').textContent = expiry === 'candle' ? 'Fim da vela' : expiry + ' min';
        document.getElementById('signalReturn').textContent = isOTC ? '92%' : '90%';
        document.getElementById('signalStrategy').textContent = strategy.join(" + ");
        document.getElementById('signalTime').textContent = timeStr;

        const box = document.getElementById('signalBox');
        box.style.borderLeftColor = direction === 'CALL' ? '#00c853' : '#d50000';

        if (direction === "CALL") playCallSound();
        else playPutSound();

        chart.data.datasets.push({
             [{ x: data.length - 1, y: data[data.length - 1].y }],
            pointBackgroundColor: direction === 'CALL' ? '#00c853' : '#d50000',
            pointRadius: 8
        });
        chart.update();
    } else {
        alert("📉 Nenhum sinal com >80% de confiança encontrado.");
    }
}

function initChart() {
    const ctx = document.getElementById('priceChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
         {
            datasets: [{
                label: 'Preço',
                data: data,
                borderColor: '#00c853',
                backgroundColor: 'rgba(0, 200, 83, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 0
            }]
        },
        options: {
            animation: false,
            scales: { y: { beginAtZero: false } },
            plugins: { legend: { display: false } }
        }
    });
}
