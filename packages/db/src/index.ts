import { EventType, PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

export { EventType };
