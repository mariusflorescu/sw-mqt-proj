import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <section className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="w-full max-w-sm">
        <Label htmlFor="street">Street</Label>
        <Input id="street" placeholder="Street" type="text" />
      </div>
      <div className="flex space-x-4">
        <Button>Button 1</Button>
        <Button>Button 2</Button>
        <Button>Button 3</Button>
      </div>
    </section>
  );
}
