import { db, EventType } from "@traffic-control/db";
import { kafkaConsumer } from "./lib/kafka";
import { z } from "zod";

const messageSchema = z.object({
  street: z.string(),
  timestamp: z.number(),
});

const run = async () => {
  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe({ topic: "accident", fromBeginning: true });
  await kafkaConsumer.run({
    eachMessage: async ({ message: bufMsg }) => {
      if (!bufMsg || !bufMsg.value) return;

      const rawMessage = JSON.parse(bufMsg.value.toString());
      const validatedMessage = messageSchema.safeParse(rawMessage);
      if (!validatedMessage.success) return;
      const message = validatedMessage.data;

      console.log("🚨 ACCIDENT CONSUMER -> ingesting message");
      await db.event.create({
        data: {
          street: message.street,
          eventType: EventType.accident,
          timestamp: new Date(message.timestamp),
        },
      });
    },
  });
};

run();
