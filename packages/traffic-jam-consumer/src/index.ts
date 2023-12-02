import { db, EventType } from "@traffic-control/db";
import { kafkaConsumer, kafkaProducer } from "./lib/kafka";
import { z } from "zod";
import { sub } from "date-fns";

const messageSchema = z.object({
  street: z.string(),
  timestamp: z.number(),
});

const run = async () => {
  await kafkaConsumer.connect();
  await kafkaProducer.connect();
  await kafkaConsumer.subscribe({ topic: "traffic_jam", fromBeginning: true });
  await kafkaConsumer.run({
    eachMessage: async ({ message: bufMsg }) => {
      if (!bufMsg || !bufMsg.value) return;

      const rawMessage = JSON.parse(bufMsg.value.toString());
      const validatedMessage = messageSchema.safeParse(rawMessage);
      if (!validatedMessage.success) return;
      const message = validatedMessage.data;

      const threeMinutesAgo = sub(new Date(message.timestamp), { minutes: 3 });

      await db.event.create({
        data: {
          street: message.street,
          eventType: EventType.traffic_jam,
          timestamp: new Date(message.timestamp),
        },
      });

      const cnt = await db.event.count({
        where: {
          eventType: EventType.traffic_jam,
          street: message.street,
          timestamp: {
            gte: threeMinutesAgo,
            lt: new Date(message.timestamp),
          },
        },
      });

      if (cnt === 2) {
        kafkaProducer.send({
          topic: "event",
          messages: [
            {
              value: JSON.stringify({
                eventType: EventType.traffic_jam,
                street: message.street,
              }),
            },
          ],
        });
      }
    },
  });
};

run();
