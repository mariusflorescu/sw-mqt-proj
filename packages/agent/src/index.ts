import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { eventsRouter } from "./routes/events";
import { consume } from "./lib/consumer";
import { Server } from "socket.io";
import { createServer } from "node:http";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
  },
});

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);
app.use("/api/events", eventsRouter);

consume(io);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Backend listening in port ${PORT}`);
});
