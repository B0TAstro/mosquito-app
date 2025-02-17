#include <Arduino.h>
#include "lorae5.h"
#include "config_board.h"
#include "config_application.h"

#define RELAI 5        // Ventilateur contrôlé par le relais
#define LED1 7         // LED1 toujours allumée
#define LED2 6         // LED2 toujours allumée
#define CO2_PIN A0     // Capteur de CO2
#define OPTICAL_SENSOR 3  // Broche pour le capteur optique

volatile int mosquitoCount = 0;  // Compteur de moustiques

uint8_t sizePayloadUp = 6;  // Ajout d'un octet pour l'état du relais et un pour le niveau de CO2
uint8_t payloadUp[20] = {0};

uint8_t sizePayloadDown = 1;
uint8_t payloadDown[20] = {0};

unsigned long lastDetectionTime = 0;
const unsigned long DETECTION_DELAY = 500;

unsigned long relayStartTime = 0;  // Moment où le relais est activé
const unsigned long RELAY_ON_DURATION = 5000;  // Durée en ms pour garder le relais actif

bool relayActive = false;  // État du relais

LORAE5 lorae5(devEUI, appEUI, appKey, devAddr, nwkSKey, appSKey);

// Timer pour les transmissions LoRa
unsigned long previousMillisLoRa = 0;
unsigned long intervalLoRa = 10000;  // 10 secondes pour l'envoi LoRa

void setup() {
  pinMode(RELAI, OUTPUT);
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(OPTICAL_SENSOR, INPUT);
  digitalWrite(LED1, HIGH);
  digitalWrite(LED2, HIGH);
  // Relais éteint au démarrage
  digitalWrite(RELAI, LOW);

  Serial.begin(9600);

  // Initialisation du matériel LoRa
  lorae5.setup_hardware(&Debug_Serial, &LoRa_Serial);
  lorae5.setup_lorawan(REGION, ACTIVATION_MODE, CLASS, SPREADING_FACTOR, ADAPTIVE_DR, CONFIRMED, PORT_UP, SEND_BY_PUSH_BUTTON, FRAME_DELAY);
  lorae5.printInfo();
  if (ACTIVATION_MODE == OTAA) {
    Serial.println("Join Procedure in progress...");
    while (lorae5.join() == false);
    delay(2000);
  }
}

void loop() {
  unsigned long currentMillis = millis();

  // Lire l'état du capteur optique
  if (digitalRead(OPTICAL_SENSOR) == LOW && (currentMillis - lastDetectionTime > DETECTION_DELAY)) {
    mosquitoCount++;  // Incrémenter le compteur de moustiques
    Serial.print("Moustique détecté ! Compteur : ");
    Serial.println(mosquitoCount);

    // Activer le relais
    digitalWrite(RELAI, HIGH);
    relayStartTime = currentMillis;
    relayActive = true;

    lastDetectionTime = currentMillis;  // Mettre à jour le temps de détection
  }

  // Désactiver le relais après la durée définie
  if (relayActive && (currentMillis - relayStartTime >= RELAY_ON_DURATION)) {
    digitalWrite(RELAI, LOW);  // Éteindre le relais
    relayActive = false;
  }

  // Envoi LoRa toutes les 30 secondes
  if (currentMillis - previousMillisLoRa >= intervalLoRa) {
    previousMillisLoRa = currentMillis;
    sendLoRaData();  // Envoyer les données
  }

  // Traitement des messages descendus via LoRa
  if (lorae5.awaitForDownlinkClass_A(payloadDown, &sizePayloadDown) == RET_DOWNLINK) {
    processDownlink();
  }

  lorae5.sleep();
}

// Fonction pour envoyer les données LoRa
void sendLoRaData() {
  int sensorValue = analogRead(CO2_PIN);
  float voltage = sensorValue * (5.0 / 1023.0);
  float CO2 = 2000 * voltage / 5.0;
  Serial.print("Concentration CO2 : ");
  Serial.print(CO2);
  Serial.println(" ppm");

  uint8_t co2State = 0;
  if (CO2 < 400.0) co2State = 1;

  payloadUp[0] = (uint8_t)((int)CO2 >> 8);
  payloadUp[1] = (uint8_t)((int)CO2 & 0xFF);
  payloadUp[2] = (uint8_t)(mosquitoCount >> 8);
  payloadUp[3] = (uint8_t)(mosquitoCount & 0xFF);
  payloadUp[4] = relayActive ? 1 : 0;  // État du relais
  payloadUp[5] = co2State;

  lorae5.sendData(payloadUp, sizePayloadUp);
}

// Fonction pour traiter les données descendantes
void processDownlink() {
  Serial.print("Downlink reçu : ");
  Serial.println(payloadDown[0]);

  if (payloadDown[0] == 49) {  // Code 49 : Allumer le ventilateur
    digitalWrite(RELAI, HIGH);
    relayActive = true;
    payloadUp[4] = 1;  // Mettre à jour l'état du relais
    Serial.println("Relais activé par downlink.");
  } else if (payloadDown[0] == 48) {  // Code 48 : Éteindre le ventilateur
    digitalWrite(RELAI, LOW);
    relayActive = false;
    payloadUp[4] = 0;  // Mettre à jour l'état du relais
    Serial.println("Relais désactivé par downlink.");
  } else {
    Serial.println("Commande inconnue.");
  }
}