import mqtt from "mqtt";
import { BROKER_ADDRESS } from "../constants/constants";
import cube from "../model/cube/cube";
import CubeInserted from "./messages/cubeInserted.interface";
import CubeReleased from "./messages/cubeReleased.interface";
import CubeByPerson from "./messages/cubeByPerson.interface";
import cubeScanner from "../model/cubeScanner/cubeScanner";
import CubeScannerIpPublish from "./messages/cubeScannerIpPublish";

const client = mqtt.connect(BROKER_ADDRESS);

client.on("connect", () => {
  client.subscribe("sm_iot_lab/cube/inserted");
  client.subscribe("sm_iot_lab/cube/released");
  client.subscribe("sm_iot_lab/person/cubes/get");
  client.subscribe("sm_iot_lab/cube_scanner/+/ip/post");
});

client.on("message", async (topic, payload) => {
  let jsonPayload;

  if (topic.endsWith("cube_inserted")) {
    // a new cube has been inserted in a pickup point
    console.log("cube inserted");
    jsonPayload = JSON.parse(payload.toString()) as CubeInserted;
    cube.add(jsonPayload.person, jsonPayload.cube_dropper);
    return;
  }

  if (topic.endsWith("cube_released")) {
    // a cube has been released from a pickup point
    console.log("cube released");
    jsonPayload = JSON.parse(payload.toString()) as CubeReleased;
    cube.markAsReleased(jsonPayload.cube);
    return;
  }

  if (topic.endsWith("person/cubes/get")) {
    // a cube has been released from a pickup point
    console.log("request for cubes for person");
    jsonPayload = JSON.parse(payload.toString()) as CubeByPerson;
    const result = await cube.getByPerson(jsonPayload.person);
    client.publish("sm_iot_lab/person/cubes/info", result != null ? JSON.stringify(result) : "");
    return;
  }

  if (topic.endsWith("ip/post")) {
    jsonPayload = JSON.parse(payload.toString()) as CubeScannerIpPublish;
    console.log("a cube scanner has posted its ip address");
    cubeScanner.updateIpAddress(jsonPayload.pickupPointN, jsonPayload.ipAddress);
    return;
  }
});
