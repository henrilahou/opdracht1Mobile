// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyDXV6M1jEfKg7whybipdRxg7LCWrtuVSCc",
  authDomain: "opdracht1mobile.firebaseapp.com",
  projectId: "opdracht1mobile",
  storageBucket: "opdracht1mobile.appspot.com",
  messagingSenderId: "960547339082",
  appId: "1:960547339082:web:d6814791bc8e982e25dfb3",
  measurementId: "G-86P3XME3Q8"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new message.',
    icon: '/firebase-logo.png'  // Replace with your custom icon
  };

  // Show notification in the system tray
  self.registration.showNotification(notificationTitle, notificationOptions);

  // Dispatch a message to the React app (for background message)
  self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clients) => {
    clients.forEach(client => {
      client.postMessage({
        type: 'backgroundMessage',
        title: notificationTitle,
        body: notificationOptions.body,
      });
    });
  });
});