const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mqtt = require('mqtt');

const app = express();
const server = http.createServer(app);

require('dotenv').config({ path: './config/.env' });

// Configuration CORS
app.use(cors({
    origin: 'http://localhost:3000',  // Adresse de l'application React
}));

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

// Paramètres de connexion MQTT
const protocol = 'mqtts';
const host = process.env.MQTT_HOST;
const port = process.env.MQTT_PORT;
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `${protocol}://${host}:${port}`;
// Nouvelle instance du client MQTT
const mqttClient = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 5000,
    username: process.env.MQTT_USER,
    password: process.env.MQTT_KEY,
});
// Topic MQTT
const topic = `v3/${process.env.MQTT_USER}/devices/+/up`;

mqttClient.on('connect', () => {
    console.log('Connecté au broker MQTT');
    mqttClient.subscribe(topic, (err) => {
        if (err) {
            console.error('Erreur de souscription au topic:', err);
        } else {
            console.log(`Souscrit au topic '${topic}' avec succès`);
        }
    });
});

mqttClient.on('error', (error) => {
    console.error('Erreur de connexion au broker MQTT:', error);
});

mqttClient.on('message', (topic, message) => {
    //console.log('Message reçu:', message.toString());
    try {
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.uplink_message && parsedMessage.uplink_message.decoded_payload) {
            const bytes = parsedMessage.uplink_message.decoded_payload.bytes;
            console.log('Bytes reçus:', bytes);
            io.emit('mqttData', bytes);
        } else {
            console.error('Erreur: Données MQTT incorrectes ou absentes.');
        }
    } catch (error) {
        console.error('Erreur de parsing JSON:', error.message);
    }
});

// Liasion avec React via Socket.IO
io.on('connection', (socket) => {
    console.log('Client React est connecté');
});

app.get('/', (req, res) => {
    res.send('zob');
});

server.listen(3001, () => {
    console.log('Serveur Node.js en écoute sur le port 3001');
});