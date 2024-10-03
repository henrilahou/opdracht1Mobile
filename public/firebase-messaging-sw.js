// firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');


// Initialize the Firebase app in the service worker by passing the generated config

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


messaging.onBackgroundMessage(function (payload) {

 console.log('[firebase-messaging-sw.js] Received background message ', payload);

 const notificationTitle = payload.notification.title;

 const notificationOptions = {

  body: payload.notification.body,

  icon: '/firebase-logo.png' // Customize this if needed

 };



 self.registration.showNotification(notificationTitle, notificationOptions);

});