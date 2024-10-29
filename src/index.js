import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { firebaseConfig, vapidKey } from './firebaseConfig';
import reportWebVitals from './reportWebVitals';

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

getToken(messaging, { vapidKey })
  .then((currentToken) => {
    if (currentToken) {
      console.log('FCM Token:', currentToken);
      window.dispatchEvent(new CustomEvent('fcmToken', { detail: currentToken }));
    } else {
      console.log('No registration token available.');
    }
  })
  .catch((err) => console.error('Error retrieving token:', err));

Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    console.log('Notification permission granted.');
  }
});

onMessage(messaging, (payload) => {
  console.log('Foreground message received:', payload);
  const { title = 'Alert', body = 'Temperature has changed!' } = payload.notification;
  new Notification(title, { body });
  console.log("Notification displayed successfully:", title);
});

navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data?.type === 'backgroundMessage') {
    const { title, body } = event.data;
    new Notification(title, { body });
    console.log("Background notification displayed:", title);
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();