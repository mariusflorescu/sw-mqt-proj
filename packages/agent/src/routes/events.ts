import { Router } from "express";
import { z } from "zod";
import { kafkaProducer } from "../lib/kafka";

const eventSchema = z.object({
  type: z.enum(["accident", "roadwork", "traffic-jam"]),
  street: z.string(),
});

const eventsRouter = Router();

eventsRouter.post("/", async (req, res) => {
  try {
    const event = req.body;

    const validatedEvent = eventSchema.safeParse(event);
    if (!validatedEvent.success) {
      return res.status(400).json({ error: "Invalid event" });
    }

    await kafkaProducer.connect();
    await kafkaProducer.send({
      topic: validatedEvent.data.type,
      messages: [
        {
          value: JSON.stringify({
            street: validatedEvent.data.street,
            timestamp: Date.now(),
          }),
        },
      ],
    });
    return res.status(201).json({ success: true, message: "Event sent" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export { eventsRouter };
