import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [mqttBytes, setMqttBytes] = useState(null);

  useEffect(() => {
    socket.on('mqttData', (bytes) => {
      console.log('Bytes reçus depuis le serveur:', bytes);
      setMqttBytes(bytes);
    });

    // Nettoyage lors du démontage du composant
    return () => {
      socket.off('mqttData');
    };
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Mosquito stats</h1>
      {mqttBytes ? (
        <p>{mqttBytes.join(', ')}</p>
      ) : (
        <p>En attente de données...</p>
      )}
    </div>
  );
}

export default App;
