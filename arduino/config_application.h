/***********************************************************************/
/* Please see README page on https://github.com/SylvainMontagny/LoRaE5 */
/***********************************************************************/

#define REGION                  EU868
#define ACTIVATION_MODE         OTAA
#define CLASS                   CLASS_A
#define SPREADING_FACTOR        7
#define ADAPTIVE_DR             false
#define CONFIRMED               false
#define PORT_UP                 15

#define SEND_BY_PUSH_BUTTON     false
#define FRAME_DELAY             20000

String devEUI = "70B3D57ED006AFBD";

// Configuration for ABP Activation Mode
String devAddr = "00000000";
String nwkSKey = "00000000000000000000000000000000";
String appSKey = "00000000000000000000000000000000";

// Configuration for OTAA Activation Mode
String appKey = "E9B0CC8B263B97C689053F33260E4E78"; 
String appEUI = "7658768798969008";
