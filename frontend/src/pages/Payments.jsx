import { Layout } from "../components/Layout";
import { usePayments } from "../hooks/use-operations";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export default function Payments() {
  const { data: payments, isLoading } = usePayments();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Transaction History
          </h2>
          <p className="text-white/50">All processed payments.</p>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden">
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/70">
                  Payment ID
                </TableHead>
                <TableHead className="text-white/70">
                  Ticket ID
                </TableHead>
                <TableHead className="text-white/70">
                  Amount
                </TableHead>
                <TableHead className="text-white/70">
                  Method
                </TableHead>
                <TableHead className="text-white/70">
                  Time
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-white/50"
                  >
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : payments?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-white/50"
                  >
                    No payments found
                  </TableCell>
                </TableRow>
              ) : (
                payments?.map((payment) => (
                  <TableRow
                    key={payment.id}
                    className="border-white/5 hover:bg-white/5"
                  >
                    <TableCell className="font-mono text-white/60">
                      #{payment.id}
                    </TableCell>
                    <TableCell className="text-white">
                      #{payment.ticketId}
                    </TableCell>
                    <TableCell className="font-bold text-emerald-400">
                      ${payment.amount}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {payment.method.methodName}
                    </TableCell>
                    <TableCell className="text-white/60">
                      {format(
                        new Date(payment.paymentTime),
                        "MMM dd, HH:mm"
                      )}
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