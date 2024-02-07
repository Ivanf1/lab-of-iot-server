import mqtt from "mqtt";
import { BROKER_ADDRESS } from "../constants/constants";
import cube from "../model/cube/cube";
import CubeInserted from "./messages/cubeInserted.interface";
import CubeReleased from "./messages/cubeReleased.interface";
import CubeByPerson from "./messages/cubeByPerson.interface";

const client = mqtt.connect(BROKER_ADDRESS);

client.on("connect", () => {
  client.subscribe("sm_iot_lab/cube/inserted");
  client.subscribe("sm_iot_lab/cube/released");
  client.subscribe("sm_iot_lab/person/cubes/get");
});

client.on("message", async (topic, payload) => {
  let jsonPayload;

  switch (topic) {
    case "sm_iot_lab/cube_inserted":
      // a new cube has been inserted in a pickup point
      console.log("cube inserted");
      jsonPayload = JSON.parse(payload.toString()) as CubeInserted;
      // console.log(jsonPayload);
      cube.add(jsonPayload.person, jsonPayload.cube_dropper);
      break;
    case "sm_iot_lab/cube_released":
      // a cube has been released from a pickup point
      console.log("cube released");
      jsonPayload = JSON.parse(payload.toString()) as CubeReleased;
      // console.log(jsonPayload);
      cube.markAsReleased(jsonPayload.cube);
      break;
    case "sm_iot_lab/person/cubes/get":
      // a cube has been released from a pickup point
      console.log("request for cubes for person");
      jsonPayload = JSON.parse(payload.toString()) as CubeByPerson;
      // console.log(jsonPayload);
      const result = await cube.getByPerson(jsonPayload.person);
      client.publish("sm_iot_lab/person/cubes/info", result != null ? JSON.stringify(result) : "");
      break;
  }
});
