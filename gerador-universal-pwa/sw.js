let isActive = false;
let intervalId = null;
let count = 0;
let total = 0;

const PLATFORMS = {
  pix: {
    title: "💰 Pix Recebido!",
    bodyPrefix: "Pagamento via Pix: R$",
    icon: "/icons/pix.png",
    dashboard: "/dashboards/pix.html"
  },
  boleto: {
    title: "📄 Boleto Compensado!",
    bodyPrefix: "Boleto pago: R$",
    icon: "/icons/boleto.png",
    dashboard: "/dashboards/boleto.html"
  },
  kiwify: {
    title: "🚀 Venda na Kiwify!",
    bodyPrefix: "Nova venda: R$",
    icon: "/icons/kiwify.png",
    dashboard: "/dashboards/kiwify.html"
  },
  hotmart: {
    title: "🔥 Compra na Hotmart!",
    bodyPrefix: "Afiliado recebeu: R$",
    icon: "/icons/hotmart.png",
    dashboard: "/dashboards/hotmart.html"
  },
  mercadopago: {
    title: "💳 Pagamento Confirmado!",
    bodyPrefix: "Via Mercado Pago: R$",
    icon: "/icons/mercadopago.png",
    dashboard: "/dashboards/mercadopago.html"
  }
};

self.addEventListener('message', (event) => {
  if (event.data.type === 'START_UNIVERSAL') {
    const { platform, valor, interval, quantidade } = event.data.config;
    const config = PLATFORMS[platform] || PLATFORMS.pix;

    isActive = true;
    count = 0;
    total = quantidade;

    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(() => {
      if (!isActive || count >= total) {
        isActive = false;
        if (intervalId) clearInterval(intervalId);
        return;
      }

      const valorNum = parseFloat(valor.replace(',', '.'));
      const finalValor = isNaN(valorNum) ? 97.2 : valorNum;

      self.registration.showNotification(config.title, {
        body: `${config.bodyPrefix} ${finalValor.toFixed(2)}`,
        icon: config.icon,
        badge: config.icon,
        vibrate: [200, 100, 200],
        tag: `universal-${platform}-${Date.now()}`,
         { url: config.dashboard }
      });

      count++;
    }, interval * 1000);
  }

  if (event.data.type === 'STOP') {
    isActive = false;
    if (intervalId) clearInterval(intervalId);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboards/pix.html';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      for (let client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      return clients.openWindow(url);
    })
  );
});