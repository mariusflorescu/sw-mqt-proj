import { kafkaConsumer } from "./lib/kafka";

const run = async () => {
  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe({ topic: "accident", fromBeginning: true });
  await kafkaConsumer.run({
    eachMessage: async ({ message }) => {
      console.log(message);
    },
  });
};

run();
