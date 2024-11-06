import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Header from './components/Header';
import Toggle from './components/Toggle';
import Recap from './components/Recap';
import Counter from './components/Counter';
import CO2LevelBar from './components/CO2LevelBar';

const socket = io('http://localhost:3001');

function App() {
  const [mqttBytes, setMqttBytes] = useState(null);
  const [alert, setAlert] = useState(false); // Nouvel état pour gérer l'alerte

  useEffect(() => {
    socket.on('mqttData', (bytes) => {
      console.log('Bytes reçus depuis le serveur:', bytes);
      setMqttBytes(bytes);

      // Activer l'alerte si mqttBytes[5] est égal à 1 (alerte CO2 bas)
      if (bytes[5] === 1) {
        setAlert(true);
      } else {
        setAlert(false);
      }
    });

    // Nettoyage lors du démontage du composant
    return () => {
      socket.off('mqttData');
    };
  }, []);

  // Supposons que mqttBytes[0] contienne le bit fort et mqttBytes[1] le bit faible pour le CO2
  const mosquitoCount = mqttBytes ? (mqttBytes[2] << 8) | mqttBytes[3] : 0; // Par exemple, byte[2] pour les moustiques
  const co2Level = mqttBytes ? (mqttBytes[0] << 8) | mqttBytes[1] : 0; // Combiner les 2 octets pour le CO2
  // Vérifier le calcul du niveau de CO2
  console.log('Niveau de CO2 calculé:', co2Level);

  return (
    <div>
      <Header />
      <div className='flex flex-col gap-y-10 mx-5'>
        <Toggle />
        <Recap co2Level={co2Level} mosquitoCount={mosquitoCount} />
        <Counter mosquitoCount={mosquitoCount} />
        <CO2LevelBar level={co2Level} />
      </div>

      {/* Affichage de l'alerte si le byte [5] est à 1 (alerte CO2 bas) */}
      {alert && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className='bg-white rounded-3xl shadow-lg p-6 text-center mx-5'>
            <h2 className="text-red-600 text-2xl font-bold mb-4">Alerte CO2 bas</h2>
            <p className="text-gray-700">Le niveau de CO2 est trop bas. Prenez des mesures pour augmenter le taux de CO2.</p>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => setAlert(false)} // Ferme l'alerte
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
