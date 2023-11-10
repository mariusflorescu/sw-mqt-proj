import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { socket } from "./lib/socket";
import { useEffect, useState } from "react";
import { z } from "zod";

const eventSchema = z.object({
  eventType: z.enum(["accident", "roadwork", "traffic_jam"]),
  street: z.string(),
  timestamp: z.string(),
});
type Event = z.infer<typeof eventSchema>;

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    socket.on("event", (rawEvent) => {
      const event = eventSchema.parse(rawEvent);
      setEvents([event, ...events]);
      console.log(events);
    });
  }, [events, setEvents]);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <section className="flex flex-col items-center justify-center space-y-4">
        <div className="w-full max-w-sm">
          <Label htmlFor="street">Street</Label>
          <Input id="street" placeholder="Street" type="text" />
        </div>
        <div className="flex space-x-4">
          <Button>Accident</Button>
          <Button>Roadwork</Button>
          <Button>Traffic Jam</Button>
        </div>
      </section>
      <Table className="max-w-lg">
        <TableCaption>A realtime list of events</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Event Type</TableHead>
            <TableHead>Street</TableHead>
            <TableHead>Tiemstamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map(({ eventType, street, timestamp }) => (
            <TableRow key={`${eventType}-${street}-${timestamp}`}>
              <TableCell className="font-medium">{eventType}</TableCell>
              <TableCell>{street}</TableCell>
              <TableCell>{timestamp}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
