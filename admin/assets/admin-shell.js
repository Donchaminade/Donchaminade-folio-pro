(function () {
  const STORAGE_KEY = 'adminSidebarCollapsed';
  const PUSH_ASKED_KEY = 'adminPushAsked';
  const sidebar = document.getElementById('adminSidebar');
  const overlay = document.getElementById('adminSidebarOverlay');
  const toggleBtn = document.getElementById('adminSidebarToggle');
  const mobileBtn = document.getElementById('adminMobileMenuBtn');

  function isMobile() {
    return window.matchMedia('(max-width: 1023px)').matches;
  }

  function setCollapsed(collapsed) {
    if (!sidebar) return;
    document.body.classList.toggle('admin-sidebar-collapsed', collapsed && !isMobile());
    document.body.classList.toggle('admin-sidebar-open', false);
    if (!isMobile()) {
      localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
    }
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    }
  }

  function openMobile() {
    document.body.classList.add('admin-sidebar-open');
    if (overlay) overlay.classList.remove('hidden');
  }

  function closeMobile() {
    document.body.classList.remove('admin-sidebar-open');
    if (overlay) overlay.classList.add('hidden');
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (isMobile()) {
        closeMobile();
        return;
      }
      setCollapsed(!document.body.classList.contains('admin-sidebar-collapsed'));
    });
  }

  if (mobileBtn) mobileBtn.addEventListener('click', openMobile);
  if (overlay) overlay.addEventListener('click', closeMobile);

  if (!isMobile() && localStorage.getItem(STORAGE_KEY) === '1') {
    setCollapsed(true);
  }

  window.addEventListener('resize', () => {
    if (!isMobile()) closeMobile();
  });

  // ——— Cloche & notifications ———
  const bellBtn = document.getElementById('adminNotifBell');
  const bellPanel = document.getElementById('adminNotifPanel');
  const bellList = document.getElementById('adminNotifList');
  const bellBadge = document.getElementById('adminNotifTotal');
  const pushBtn = document.getElementById('adminPushEnableBtn');
  const pushStatus = document.getElementById('adminPushStatus');

  let lastTotal = 0;
  let swRegistration = null;
  let vapidPublicKey = '';

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const raw = atob(base64);
    const arr = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return arr;
  }

  function updateBellBadge(total) {
    if (!bellBadge) return;
    if (total > 0) {
      bellBadge.textContent = total > 99 ? '99+' : String(total);
      bellBadge.classList.remove('hidden');
    } else {
      bellBadge.classList.add('hidden');
    }
    if ('setAppBadge' in navigator) {
      try {
        if (total > 0) navigator.setAppBadge(total);
        else if ('clearAppBadge' in navigator) navigator.clearAppBadge();
      } catch (_) {}
    }
  }

  function renderNotifList(items) {
    if (!bellList) return;
    if (!items || items.length === 0) {
      bellList.innerHTML = '<p class="text-slate-500 text-xs p-3 text-center">Aucune alerte en attente</p>';
      return;
    }
    bellList.innerHTML = items
      .map(
        (it) =>
          `<a href="${it.href}" class="flex items-center justify-between gap-2 px-3 py-2.5 hover:bg-white/5 border-b border-white/5 text-sm">
            <span class="text-slate-200">${it.label}</span>
            <span class="admin-nav-badge shrink-0">${it.count}</span>
          </a>`
      )
      .join('');
  }

  function updateSidebarBadges(data) {
    Object.entries({
      comments: data.comments,
      testimonials: data.testimonials,
      recommendations: data.recommendations,
      messages: data.messages,
    }).forEach(([key, n]) => {
      document.querySelectorAll(`[data-notif-key="${key}"]`).forEach((el) => {
        if (n > 0) {
          el.textContent = n > 99 ? '99+' : String(n);
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      });
    });
  }

  async function subscribePush() {
    if (!swRegistration || !vapidPublicKey) {
      if (pushStatus) pushStatus.textContent = 'Push non configuré sur le serveur.';
      return false;
    }
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') {
      if (pushStatus) pushStatus.textContent = 'Permission refusée.';
      return false;
    }
    try {
      let sub = await swRegistration.pushManager.getSubscription();
      if (!sub) {
        sub = await swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });
      }
      const res = await fetch('push-subscribe.php', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub.toJSON()),
      });
      const json = await res.json();
      if (pushStatus) pushStatus.textContent = json.message || 'Notifications push activées.';
      if (pushBtn) pushBtn.classList.add('hidden');
      return true;
    } catch (e) {
      if (pushStatus) pushStatus.textContent = 'Erreur : ' + (e.message || 'abonnement impossible');
      return false;
    }
  }

  async function initPush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      if (pushStatus) pushStatus.textContent = 'Push non supporté par ce navigateur.';
      if (pushBtn) pushBtn.classList.add('hidden');
      return;
    }
    try {
      const cfgRes = await fetch('push-config.php', { credentials: 'same-origin' });
      const cfg = await cfgRes.json();
      if (!cfg.success || !cfg.data.enabled) {
        if (pushStatus) pushStatus.textContent = 'Configurez VAPID dans .env (voir generate-vapid-keys.php).';
        return;
      }
      vapidPublicKey = cfg.data.publicKey;
      swRegistration = await navigator.serviceWorker.register('sw.js');
      await swRegistration.ready;

      const existing = await swRegistration.pushManager.getSubscription();
      if (existing) {
        await fetch('push-subscribe.php', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(existing.toJSON()),
        });
        if (pushBtn) pushBtn.classList.add('hidden');
        if (pushStatus) pushStatus.textContent = 'Notifications push actives sur cet appareil.';
      } else if (pushStatus) {
        pushStatus.textContent = 'Recevez les alertes sur votre téléphone (app installée).';
      }

      if (Notification.permission === 'default' && !localStorage.getItem(PUSH_ASKED_KEY)) {
        localStorage.setItem(PUSH_ASKED_KEY, '1');
        setTimeout(() => subscribePush(), 1500);
      }
    } catch (_) {
      if (pushStatus) pushStatus.textContent = 'Impossible d\'initialiser le service worker.';
    }
  }

  if (pushBtn) {
    pushBtn.addEventListener('click', (e) => {
      e.preventDefault();
      subscribePush();
    });
  }

  if (bellBtn && bellPanel) {
    bellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      bellPanel.classList.toggle('hidden');
    });
    document.addEventListener('click', () => bellPanel.classList.add('hidden'));
    bellPanel.addEventListener('click', (e) => e.stopPropagation());
  }

  async function pollNotifications() {
    try {
      const res = await fetch('notifications.php', { credentials: 'same-origin' });
      if (!res.ok) return;
      const json = await res.json();
      if (!json.success || !json.data) return;

      const total = json.data.total || 0;
      updateBellBadge(total);
      updateSidebarBadges(json.data);
      renderNotifList(json.data.items || []);

      if (total > lastTotal && lastTotal > 0 && swRegistration && Notification.permission === 'granted') {
        const first = (json.data.items || [])[0];
        swRegistration.showNotification('Donchaminade Admin', {
          body: first ? `${first.label} (${first.count})` : 'Nouvelle activité',
          icon: '../public/favicon.png',
          tag: 'dc-admin-poll',
          data: { url: first?.href || 'index.php' },
        });
      }
      lastTotal = total;
    } catch (_) {}
  }

  initPush().then(pollNotifications);
  setInterval(pollNotifications, 45000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') pollNotifications();
  });
})();
