import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { firebaseConfig, vapidKey } from './firebaseConfig';
import reportWebVitals from './reportWebVitals';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Get FCM token
getToken(messaging, { vapidKey: vapidKey }).then((currentToken) => {
  if (currentToken) {
    console.log('FCM Token:', currentToken);
    // Dispatch a custom event with the FCM token so that the App component can display it
    const event = new CustomEvent('fcmToken', { detail: currentToken });
    window.dispatchEvent(event);
  } else {
    console.log('No registration token available. Request permission to generate one.');
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token.', err);
});

// Request permission for notifications
(function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    }
  });
})();

// Handle foreground messages
onMessage(messaging, (payload) => {
  console.log('Foreground message received: ', payload);
  const messageEvent = new CustomEvent('fcmMessage', { detail: payload.notification.body });
  window.dispatchEvent(messageEvent);
});

// Listen for messages from the service worker (background messages)
navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'backgroundMessage') {
    console.log('Background message received in main app:', event.data);
    const messageEvent = new CustomEvent('fcmMessage', { detail: `${event.data.title}: ${event.data.body}` });
    window.dispatchEvent(messageEvent);
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();