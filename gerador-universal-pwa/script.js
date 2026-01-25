if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

document.getElementById('startBtn').addEventListener('click', startNotifications);
document.getElementById('stopBtn').addEventListener('click', stopNotifications);

function startNotifications() {
  const platform = document.getElementById('platform').value;
  const valor = document.getElementById('valor').value.trim();
  const interval = parseInt(document.getElementById('interval').value) || 10;
  const quantidade = parseInt(document.getElementById('quantidade').value) || 10;

  if (!valor) {
    alert('Digite um valor!');
    return;
  }

  Notification.requestPermission().then(status => {
    if (status !== 'granted') {
      alert('Permissão negada. Ative nas configurações.');
      return;
    }

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'START_UNIVERSAL',
        config: { platform, valor, interval, quantidade }
      });
      alert(`✅ ${quantidade} notificações iniciadas!`);
    }
  });
}

function stopNotifications() {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'STOP' });
    alert('🛑 Parado.');
  }
}