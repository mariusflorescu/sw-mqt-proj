import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "traffic-control",
  brokers: ["localhost:9092"],
});

export const kafkaConsumer = kafka.consumer({
  groupId: "traffic-jam-group",
});
