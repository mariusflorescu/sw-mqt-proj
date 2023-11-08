import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { eventsRouter } from "./routes/events"

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);
app.use('/api/events', eventsRouter)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend listening in port ${PORT}`);
});
