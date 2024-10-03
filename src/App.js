import React, { useState, useEffect } from 'react';

function App() {
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Add event listener for FCM token
    const handleToken = (event) => {
      console.log('Token received in App component:', event.detail);
      setToken(event.detail);
    };

    window.addEventListener('fcmToken', handleToken);

    // Add event listener for FCM message
    const handleMessage = (event) => {
      console.log('Message received in App component:', event.detail);
      setMessage(event.detail);
    };

    window.addEventListener('fcmMessage', handleMessage);

    // Clean up event listeners when the component unmounts
    return () => {
      window.removeEventListener('fcmToken', handleToken);
      window.removeEventListener('fcmMessage', handleMessage);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Firebase Cloud Messaging Demo</h1>
        
        {token ? (
          <>
            <h2>Your FCM Token:</h2>
            <p>{token}</p>
          </>
        ) : (
          <p>Fetching FCM Token...</p>
        )}

        {message ? (
          <>
            <h2>Received Message:</h2>
            <p>{message}</p>
          </>
        ) : (
          <p>No messages yet.</p>
        )}
      </header>
    </div>
  );
}

export default App;