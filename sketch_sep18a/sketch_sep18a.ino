#include <WiFi.h>
#include <PubSubClient.h>
#include "DHT.h"

#define dhtpin 25
#define dhttype DHT11
DHT dht(dhtpin, dhttype);

#define LDR_PIN 32  // Chân ADC để đọc tín hiệu từ LDR

#define FAN_PIN 4    // LED đại diện cho quạt
#define AC_PIN 5    // LED đại diện cho điều hòa
#define LIGHT_PIN 2   // LED đại diện cho đèn


// Thông tin mạng WiFi
const char* ssid = "zing";
const char* password = "20032003";

// MQTT Server
const char *mqtt_broker = "192.168.32.180";
const int mqtt_port = 1883;
const char* mqtt_user = "Dinh";  // Username MQTT
const char* mqtt_pass = "b21dccn228";  // Password MQTT
const char* mqtt_sensor_topic = "iot";
const char* mqtt_status_topic = "home/device/status";
const char* TOPIC_CONTROL_LED = "control/led";
const char* TOPIC_CONTROL_FAN = "control/fan";
const char* TOPIC_CONTROL_AIR = "control/air";

WiFiClient espClient;
PubSubClient client(espClient);

// Hàm xử lý lệnh từ MQTT
void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("topic: ");
  Serial.print(topic);
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }


  if (String(topic) == TOPIC_CONTROL_LED) {
    // Điều khiển đèn từ MQTT
    if (message == "on") {
      digitalWrite(LIGHT_PIN, HIGH);  // Bật đèn
      client.publish(mqtt_status_topic, "on");
    } else if (message == "off") {
      digitalWrite(LIGHT_PIN, LOW);  // Tắt đèn
      client.publish(mqtt_status_topic, "off");
    } 
  }
  else if (String(topic) == TOPIC_CONTROL_FAN) {
    // Điều khiển quạt từ MQTT
    if (message == "on") {
      digitalWrite(FAN_PIN, HIGH);  // Bật quạt
      client.publish(mqtt_status_topic, "on");
    } else if (message == "off") {
      digitalWrite(FAN_PIN, LOW);  // Tắt quạt
      client.publish(mqtt_status_topic, "off");
    } 
  }
  else if (String(topic) == TOPIC_CONTROL_AIR) {
    // Điều khiển điều hòa từ MQTT
    if (message == "on") {
      digitalWrite(AC_PIN, HIGH);  // Bật điều hòa
      client.publish(mqtt_status_topic, "on");
    } else if (message == "off") {
      digitalWrite(AC_PIN, LOW);  // Tắt điều hòa
      client.publish(mqtt_status_topic, "off");
    } 
  }
}

void setup() {
  Serial.begin(9600);
  dht.begin();

  // Cấu hình chân xuất ra cho 3 thiết bị
  pinMode(FAN_PIN, OUTPUT);
  pinMode(AC_PIN, OUTPUT);
  pinMode(LIGHT_PIN, OUTPUT);

  // Kết nối WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Dang ket noi den WiFi...");
  }
  Serial.println("Da ket noi WiFi");

  // Kết nối đến MQTT Broker
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  while (!client.connected()) {
    String client_id = "esp32-client-";
    client_id += String(WiFi.macAddress());
    Serial.printf("The client %s connects to the public MQTT broker\n", client_id.c_str());

    if (client.connect(client_id.c_str(),mqtt_user, mqtt_pass)) {
      Serial.println("Public EMQX MQTT broker connected");
      // isConnected = true;
    } else {
      Serial.print("Failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }
      client.subscribe(TOPIC_CONTROL_LED);  
      client.subscribe(TOPIC_CONTROL_FAN); 
      client.subscribe(TOPIC_CONTROL_AIR); 
}

unsigned long previousMillis = 0;  // Biến lưu thời gian trước đó
const long interval = 5000;  // Khoảng thời gian giữa các lần gửi dữ liệu (5 giây)

void loop() {
  client.loop();  // Lắng nghe lệnh từ MQTT

    // Lấy thời gian hiện tại
  unsigned long currentMillis = millis();

   // Kiểm tra nếu đã đủ 5 giây kể từ lần gửi dữ liệu trước
  if (currentMillis - previousMillis >= interval) {
    // Cập nhật thời gian của lần gửi dữ liệu mới
    previousMillis = currentMillis;
    // Đọc dữ liệu cảm biến DHT11 và LDR
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();
    int sensorValue = analogRead(LDR_PIN);  
    float voltage = sensorValue * (3.3 / 4095.0);  // Chuyển đổi giá trị ADC sang điện áp (0 - 3.3V)
    float lux = (2500 / voltage - 500) / 3.3;  // Công thức chuyển đổi gần đúng từ điện áp sang lux
    if (lux > 200000) {
      lux = 200000;
    }
    float light = lux;

    // Chuẩn bị dữ liệu dưới dạng JSON
    String jsonData = "{\"temperature\": " + String(temperature) + 
                      ", \"humidity\": " + String(humidity) + 
                      ", \"light\": " + String(light) + "}";
    Serial.print("Du lieu");
    Serial.println(jsonData);
    //bật đèn

    // Gửi dữ liệu cảm biến qua MQTT
    client.publish(mqtt_sensor_topic, jsonData.c_str());

    //delay(5000); 
    // Gửi dữ liệu mỗi  giây
  }
}