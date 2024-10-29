import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { firebaseConfig, vapidKey } from './firebaseConfig';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const messaging = getMessaging(app);

function App() {
  const [temperature, setTemperature] = useState(null);
  const [lightStatus, setLightStatus] = useState("off");

  useEffect(() => {
    const tempRef = ref(database, 'sensorData/temperature');
    onValue(tempRef, (snapshot) => {
      const newTemp = snapshot.val();
      if (newTemp !== temperature) { // Only update if temperature changes
        setTemperature(newTemp);
        if (Notification.permission === 'granted') {
          new Notification('Temperature Alert', { body: `Temperature is now ${newTemp}°C` });
          console.log("Temperature notification sent:", newTemp);
        }
      }
    });

    const lightRef = ref(database, 'lightControl/status');
    onValue(lightRef, (snapshot) => setLightStatus(snapshot.val()));

    getToken(messaging, { vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          console.log('FCM Token:', currentToken);
        } else {
          console.log('No registration token available.');
        }
      })
      .catch((err) => console.log('Error retrieving token:', err));

    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      }
    });

    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      new Notification(payload.notification.title, { body: payload.notification.body });
    });
  }, [temperature]);

  const toggleLight = () => {
    const newStatus = lightStatus === "on" ? "off" : "on";
    set(ref(database, 'lightControl/status'), newStatus)
      .then(() => console.log('Light status updated to:', newStatus))
      .catch((error) => console.error('Error updating light status:', error));
  };

  return (
    <div>
      <h1>IoT Dashboard</h1>
      <p>Temperature: {temperature}°C</p>
      <button onClick={toggleLight}>Turn Light {lightStatus === "on" ? "Off" : "On"}</button>
    </div>
  );
}

export default App;