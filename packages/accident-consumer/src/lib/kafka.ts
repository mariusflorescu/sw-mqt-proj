import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "traffic-control",
  brokers: ["localhost:9092"],
});

export const kafkaProducer = kafka.producer();
export const kafkaConsumer = kafka.consumer({
  groupId: "accident-group",
});
