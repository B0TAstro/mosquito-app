# Mosquito APP

An IoT solution for real-time mosquito detection and monitoring using Arduino and React.

## Overview

Mosquito APP is a collaborative project that combines hardware and software to detect and track mosquito presence. The system uses an Arduino-based sensor that communicates via LoRaWAN network to transmit detection data in real-time.

## Technical Stack

### Hardware
- Arduino device with mosquito detection sensor
- LoRaWAN module for data transmission

### Backend
- LoRaWAN protocol for IoT communication
- WebSocket server for real-time data streaming
- Data processing and management system

### Frontend
- React.js for user interface
- Tailwind CSS for styling
- WebSocket client for live data updates

## Features
- Real-time mosquito detection tracking
- Live data visualization
- Possibility of turning on a fan remotely via the app
- Responsive dashboard interface
- Seamless IoT integration

## Architecture
```
Arduino Sensor → LoRaWAN → Backend Server → WebSocket → React Frontend
```

## Getting Started
1. Set up the Arduino device with the sensor
2. Configure LoRaWAN connectivity
3. Start the backend server:
```bash
npm install
npm install mqtt cors socket.io express
node server.js
```
4. Launch the React frontend application:
```bash
cd mosquito-app-client
npm install
npm install -D tailwindcss
npx tailwindcss init -p
npm run dev
```

## Contributors
This project was developed as a collaborative effort, combining IoT hardware expertise with modern web development practices.

