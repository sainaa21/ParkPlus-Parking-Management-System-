import { Layout } from "../components/Layout";
import { useEmployees, useCreateEmployee } from "../hooks/use-employees";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
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
import { Plus, User } from "lucide-react";
import { useState } from "react";

const employeeSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  shiftTime: z.string().min(1),
  password: z.string().default("admin"),
});

export default function Employees() {
  const { data: employees, isLoading } = useEmployees();
  const createEmployee = useCreateEmployee();
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      role: "",
      shiftTime: "",
      password: "admin",
    },
  });

  const onSubmit = (values) => {
    createEmployee.mutate(values, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Staff Directory
            </h2>
            <p className="text-white/50">
              Manage employees and shifts.
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-red-600 text-white rounded-xl shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" /> New Employee
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-neutral-900 border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
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
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-white/5 border-white/10"
                            placeholder="e.g. Attendant"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shiftTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shift</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-white/5 border-white/10"
                            placeholder="e.g. 9AM - 5PM"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-primary"
                    disabled={createEmployee.isPending}
                  >
                    Create Employee
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="text-white/50">Loading staff...</div>
          ) : (
            employees?.map((employee) => (
              <div
                key={employee.id}
                className="glass-card p-6 rounded-2xl flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-white/60" />
                </div>
                <div>
                  <h3 className="font-bold text-white">
                    {employee.name}
                  </h3>
                  <p className="text-sm text-primary">
                    {employee.role}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    {employee.shiftTime}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}