importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAEOSrd_oKGxJCPZLP2J7KzFEl85e9s0jM",
  authDomain: "my-daily-clock-planner.firebaseapp.com",
  projectId: "my-daily-clock-planner",
  storageBucket: "my-daily-clock-planner.firebasestorage.app",
  messagingSenderId: "268091058772",
  appId: "1:268091058772:web:898f00a426ec071670dbc1",
  measurementId: "G-JT5LGLRR0E"
});

const messaging = firebase.messaging();

self.addEventListener('push', function(event) {
  let payload = {};
  try {
    payload = event.data && event.data.json ? event.data.json() : {};
  } catch (e) {
    payload = {};
  }
  const title = payload.notification?.title || 'My Daily Planner';
  const body = payload.notification?.body || 'คุณมีการแจ้งเตือนใหม่';
  const options = {
    body: body,
    icon: '/iconMiki192.png',
    tag: 'clock-planner-reminder'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const title = payload.notification?.title || 'My Daily Planner';
  const body = payload.notification?.body || 'ถึงเวลาทำ task แล้ว';
  const options = {
    body: body,
    icon: '/iconMiki192.png',
    tag: 'clock-planner-reminder'
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
