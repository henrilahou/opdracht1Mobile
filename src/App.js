import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { firebaseConfig, vapidKey } from './firebaseConfig';
import './App.css';

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const messaging = getMessaging(app);

function App() {
  const [temperature, setTemperature] = useState(null);
  const [lightStatus, setLightStatus] = useState("off");
  const [showSidebar, setShowSidebar] = useState(false);
  const [minTemp, setMinTemp] = useState(15);
  const [maxTemp, setMaxTemp] = useState(30);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const tempRef = ref(database, 'sensorData/temperature');
    onValue(tempRef, (snapshot) => {
      const newTemp = snapshot.val();
      if (newTemp !== temperature) {
        setTemperature(newTemp);
        if (notificationsEnabled && Notification.permission === 'granted') {
          if (newTemp < minTemp || newTemp > maxTemp) {
            new Notification('Temperature Alert', {
              body: `Temperature is now ${newTemp}°C`,
            });
            console.log("Temperature notification sent:", newTemp);
          }
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
  }, [temperature, minTemp, maxTemp, notificationsEnabled]);

  const toggleLight = () => {
    const newStatus = lightStatus === "on" ? "off" : "on";
    set(ref(database, 'lightControl/status'), newStatus)
      .then(() => console.log('Light status updated to:', newStatus))
      .catch((error) => console.error('Error updating light status:', error));
  };

  return (
    <div className="App">
      <div className="dashboard">
        <h1>IoT Dashboard</h1>
        <p className="temperature-display">Temperature: {temperature}°C</p>
        <button onClick={toggleLight} className="light-toggle-button">
          Turn Light {lightStatus === "on" ? "Off" : "On"}
        </button>
      </div>

      <button className="hamburger" onClick={() => setShowSidebar(!showSidebar)}>
        ☰
      </button>

      {showSidebar && (
        <div className="sidebar">
          <button className="close-sidebar" onClick={() => setShowSidebar(false)}>
            ×
          </button>
          <h2>Settings</h2>
          <label>
            Min Temperature: {minTemp}°C
            <input
              type="range"
              min="0"
              max="50"
              value={minTemp}
              onChange={(e) => setMinTemp(parseInt(e.target.value))}
            />
          </label>
          <label>
            Max Temperature: {maxTemp}°C
            <input
              type="range"
              min="0"
              max="50"
              value={maxTemp}
              onChange={(e) => setMaxTemp(parseInt(e.target.value))}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            />
            Enable Notifications
          </label>
        </div>
      )}
    </div>
  );
}

export default App;