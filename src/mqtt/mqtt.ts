import mqtt from "mqtt";

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
  client.subscribe("sm_iot_lab/smart_car");
  client.subscribe("sm_iot_lab/pickup_point");
});

client.on("message", (topic, payload) => {
  console.log(topic);
  console.log(payload.toString());
});
