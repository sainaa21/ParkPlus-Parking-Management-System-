import { Layout } from "../components/Layout";
import {
  useSlots,
  useCreateSlot,
  useUpdateSlot,
} from "../hooks/use-slots";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Plus, Edit2 } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const slotSchema = z.object({
  slotNumber: z.string().min(1),
  slotType: z.enum([
    "Car",
    "Bike",
    "Truck",
    "SUV",
    "Handicap",
    "EV Charging",
    "Bicycle",
    "Scooter",
  ]),
  level: z.string().min(1),
  status: z.enum(["Free", "Occupied"]),
});

export default function ManageSlots() {
  const { data: slots, isLoading } = useSlots();
  const createSlot = useCreateSlot();
  const updateSlot = useUpdateSlot();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const form = useForm({
    resolver: zodResolver(slotSchema),
    defaultValues: {
      slotNumber: "",
      slotType: "Car",
      level: "G",
      status: "Free",
    },
  });

  const onSubmit = (values) => {
    if (editingId) {
      updateSlot.mutate(
        { id: editingId, ...values },
        {
          onSuccess: () => {
            setOpen(false);
            setEditingId(null);
            form.reset();
          },
        }
      );
    } else {
      createSlot.mutate(values, {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      });
    }
  };

  const handleEdit = (slot) => {
    setEditingId(slot.id);
    form.reset({
      slotNumber: slot.slotNumber,
      slotType: slot.slotType,
      level: slot.level || "G",
      status: slot.status,
    });
    setOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Slot Management
            </h2>
            <p className="text-white/50">
              Add or edit parking slot configurations.
            </p>
          </div>

          <Dialog
            open={open}
            onOpenChange={(v) => {
              if (!v) {
                setEditingId(null);
                form.reset();
              }
              setOpen(v);
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-red-600 text-white rounded-xl shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" /> Add Slot
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-neutral-900 border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Slot" : "Create New Slot"}
                </DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="slotNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slot Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-white/5 border-white/10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slotType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue />
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
                            ].map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
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
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-white/5 border-white/10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-primary"
                    disabled={
                      createSlot.isPending || updateSlot.isPending
                    }
                  >
                    {editingId ? "Update Slot" : "Create Slot"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/70">
                  Number
                </TableHead>
                <TableHead className="text-white/70">
                  Type
                </TableHead>
                <TableHead className="text-white/70">
                  Level
                </TableHead>
                <TableHead className="text-white/70">
                  Status
                </TableHead>
                <TableHead className="text-right text-white/70">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-white/50 py-8"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                slots?.map((slot) => (
                  <TableRow
                    key={slot.id}
                    className="border-white/5 hover:bg-white/5"
                  >
                    <TableCell className="font-bold text-white">
                      {slot.slotNumber}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {slot.slotType}
                    </TableCell>
                    <TableCell className="text-white/60">
                      {slot.level}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          slot.status === "Free"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {slot.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(slot)}
                        className="hover:bg-white/10 hover:text-white text-white/50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}