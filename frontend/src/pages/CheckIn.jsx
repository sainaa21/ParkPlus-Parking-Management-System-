import { Layout } from "../components/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCheckIn } from "../hooks/use-operations";
import { useSlots } from "../hooks/use-slots";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Car, User, Hash } from "lucide-react";
import { motion } from "framer-motion";

const checkInSchema = z.object({
  vehicleNumber: z.string().min(1, "Required"),
  ownerName: z.string().min(1, "Required"),
  vehicleType: z.enum([
    "Car",
    "Bike",
    "Truck",
    "SUV",
    "Handicap",
    "EV Charging",
    "Bicycle",
    "Scooter",
  ]),
  slotId: z.coerce.number().positive("Select a slot"),
});

export default function CheckIn() {
  const checkIn = useCheckIn();
  const { data: slots } = useSlots();

  const form = useForm({
    resolver: zodResolver(checkInSchema),
    defaultValues: { vehicleNumber: "", ownerName: "" },
  });

  const selectedType = form.watch("vehicleType");

  const availableSlots =
    slots?.filter(
      (s) =>
        s.status === "Free" &&
        (!selectedType || s.slotType === selectedType)
    ) || [];

  function onSubmit(values) {
    checkIn.mutate(values, {
      onSuccess: () => form.reset(),
    });
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Vehicle Check-In
          </h2>
          <p className="text-white/50">
            Register a new vehicle entry.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-2xl"
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="vehicleNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">
                        Vehicle Number
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <Input
                            {...field}
                            className="glass-input pl-10"
                            placeholder="e.g. ABC-1234"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">
                        Owner Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                          <Input
                            {...field}
                            className="glass-input pl-10"
                            placeholder="e.g. John Doe"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">
                        Vehicle Type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="glass-input">
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-neutral-900 border-white/10 text-white">
                          {[
                            "Car",
                            "Bike",
                            "Truck",
                            "SUV",
                            "Handicap",
                            "EV Charging",
                            "Bicycle",
                            "Scooter",
                          ].map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slotId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/70">
                        Assign Slot
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                        disabled={!selectedType}
                      >
                        <FormControl>
                          <SelectTrigger className="glass-input">
                            <SelectValue
                              placeholder={
                                selectedType
                                  ? "Select Slot"
                                  : "Select Type First"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-neutral-900 border-white/10 text-white max-h-60">
                          {availableSlots.length === 0 ? (
                            <div className="p-2 text-sm text-white/50 text-center">
                              No slots available
                            </div>
                          ) : (
                            availableSlots.map((slot) => (
                              <SelectItem
                                key={slot.id}
                                value={slot.id.toString()}
                              >
                                {slot.slotNumber} ({slot.level})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={checkIn.isPending}
                  className="w-full h-12 bg-primary hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]"
                >
                  {checkIn.isPending
                    ? "Generating Ticket..."
                    : "Confirm Check-In"}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </Layout>
  );
}