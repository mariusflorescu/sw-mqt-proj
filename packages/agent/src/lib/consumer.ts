import { z } from "zod";
import { db } from "@traffic-control/db";
import { kafkaConsumer } from "./kafka";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const eventSchema = z.object({
  eventType: z.enum(["accident", "roadwork", "traffic_jam"]),
  street: z.string(),
});

export const consume = async (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  await kafkaConsumer.connect();
  await kafkaConsumer.subscribe({ topic: "event", fromBeginning: true });
  await kafkaConsumer.run({
    eachMessage: async ({ message: bufMsg }) => {
      if (!bufMsg || !bufMsg.value) return;

      const rawMessage = JSON.parse(bufMsg.value.toString());
      const validatedMessage = eventSchema.safeParse(rawMessage);
      if (!validatedMessage.success) return;

      const message = validatedMessage.data;
      await db.realEvent.create({
        data: {
          eventType: message.eventType,
          street: message.street,
        },
      });
      io.emit("event", {
        eventType: message.eventType,
        street: message.street,
        timestamp: new Date(),
      });
    },
  });
};
