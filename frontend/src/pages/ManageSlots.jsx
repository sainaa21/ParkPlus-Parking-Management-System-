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
  slotType: z.string(),
  level: z.string().min(1),
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
    });
    setOpen(true);
  };

  return (
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
              <Button className="bg-primary hover:bg-red-600 text-white rounded-xl">
                <Plus className="w-4 h-4 mr-2" /> Add Slot
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-neutral-900 border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Slot" : "Create Slot"}
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
                          <Input {...field} className="bg-white/5" />
                        </FormControl>
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
                            <SelectTrigger className="bg-white/5">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent className="bg-neutral-900 text-white">
                            {["Car", "Bike", "Truck"].map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <Input {...field} className="bg-white/5" />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-primary">
                    {editingId ? "Update Slot" : "Create Slot"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* TABLE */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow>
                <TableHead className="text-white/70">Number</TableHead>
                <TableHead className="text-white/70">Type</TableHead>
                <TableHead className="text-white/70">Level</TableHead>
                <TableHead className="text-white/70">Status</TableHead>
                <TableHead className="text-right text-white/70">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {slots?.map((slot) => {
                const status = slot.status?.toLowerCase();

                return (
                  <TableRow key={slot.id}>
                    <TableCell className="text-white font-bold">
                      {slot.slotNumber}
                    </TableCell>

                    <TableCell className="text-white/80">
                      {slot.slotType}
                    </TableCell>

                    <TableCell className="text-white/60">
                      {slot.level}
                    </TableCell>

                    {/* ✅ FIXED STATUS COLOR */}
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          status === "available"
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
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
  );
}