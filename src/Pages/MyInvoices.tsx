import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  CreditCard,
  Activity,
  ArrowLeft,
  Calendar,
  Eye,
  Receipt,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function MyInvoices() {
  const [filter, setFilter] = React.useState('all');
  const [selectedInvoice, setSelectedInvoice] = React.useState(null);

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['my-invoices'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Invoice.filter({ patient_email: user.email }, '-date');
    }
  });

  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'pending') return inv.status === 'Pending';
    if (filter === 'paid') return inv.status === 'Paid';
    if (filter === 'overdue') return inv.status === 'Overdue';
    return true;
  });

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Paid: 'bg-green-100 text-green-700 border-green-200',
    Overdue: 'bg-red-100 text-red-700 border-red-200',
    Cancelled: 'bg-gray-100 text-gray-700 border-gray-200'
  };

  const statusIcons = {
    Pending: Clock,
    Paid: CheckCircle,
    Overdue: AlertCircle,
    Cancelled: AlertCircle
  };

  const totalPending = invoices
    .filter(i => i.status === 'Pending' || i.status === 'Overdue')
    .reduce((sum, i) => sum + (i.total || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to={createPageUrl('Dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">MediCare</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Invoices</h1>
          <p className="text-gray-500">View and manage your billing</p>
        </div>

        {/* Summary Card */}
        {totalPending > 0 && (
          <Card className="border-0 shadow-md mb-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Total Amount Due</p>
                  <p className="text-3xl font-bold mt-1">R{totalPending.toLocaleString()}</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Receipt className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={filter} onValueChange={setFilter} className="mb-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredInvoices.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="py-12 text-center">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Invoices</h3>
              <p className="text-gray-500">
                {filter === 'all'
                  ? "You don't have any invoices yet."
                  : `No ${filter} invoices found.`
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map((invoice, idx) => {
              const StatusIcon = statusIcons[invoice.status] || Clock;
              return (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${invoice.status === 'Paid' ? 'bg-green-100' :
                              invoice.status === 'Overdue' ? 'bg-red-100' : 'bg-yellow-100'
                            }`}>
                            <StatusIcon className={`w-6 h-6 ${invoice.status === 'Paid' ? 'text-green-600' :
                                invoice.status === 'Overdue' ? 'text-red-600' : 'text-yellow-600'
                              }`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {invoice.invoice_number || `Invoice #${invoice.id.slice(0, 8)}`}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {invoice.date ? format(new Date(invoice.date), 'dd MMM yyyy') : '-'}
                              </span>
                            </div>
                            {invoice.due_date && invoice.status !== 'Paid' && (
                              <p className="text-sm text-gray-500 mt-1">
                                Due: {format(new Date(invoice.due_date), 'dd MMM yyyy')}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              R{invoice.total?.toLocaleString()}
                            </p>
                            <Badge className={`${statusColors[invoice.status]} border mt-1`}>
                              {invoice.status}
                            </Badge>
                          </div>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setSelectedInvoice(invoice)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Invoice Details</DialogTitle>
                              </DialogHeader>
                              {selectedInvoice && (
                                <div className="space-y-6">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="text-sm text-gray-500">Invoice Number</p>
                                      <p className="font-semibold">
                                        {selectedInvoice.invoice_number || `#${selectedInvoice.id.slice(0, 8)}`}
                                      </p>
                                    </div>
                                    <Badge className={statusColors[selectedInvoice.status]}>
                                      {selectedInvoice.status}
                                    </Badge>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-500">Date</p>
                                      <p className="font-medium">
                                        {selectedInvoice.date ? format(new Date(selectedInvoice.date), 'dd MMM yyyy') : '-'}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Due Date</p>
                                      <p className="font-medium">
                                        {selectedInvoice.due_date ? format(new Date(selectedInvoice.due_date), 'dd MMM yyyy') : '-'}
                                      </p>
                                    </div>
                                  </div>

                                  {selectedInvoice.items && selectedInvoice.items.length > 0 && (
                                    <div>
                                      <p className="text-sm text-gray-500 mb-2">Items</p>
                                      <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full text-sm">
                                          <thead className="bg-gray-50">
                                            <tr>
                                              <th className="text-left p-3">Description</th>
                                              <th className="text-right p-3">Amount</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {selectedInvoice.items.map((item, i) => (
                                              <tr key={i} className="border-t">
                                                <td className="p-3">{item.description}</td>
                                                <td className="p-3 text-right">R{item.total?.toLocaleString()}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}

                                  <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-500">Subtotal</span>
                                      <span>R{selectedInvoice.subtotal?.toLocaleString() || '-'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-500">VAT (15%)</span>
                                      <span>R{selectedInvoice.vat?.toLocaleString() || '-'}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                      <span>Total</span>
                                      <span>R{selectedInvoice.total?.toLocaleString()}</span>
                                    </div>
                                  </div>

                                  {selectedInvoice.status !== 'Paid' && (
                                    <div className="bg-teal-50 p-4 rounded-lg">
                                      <p className="text-sm text-teal-700">
                                        <strong>Payment Options:</strong> EFT, Card, or Medical Aid claim
                                      </p>
                                      <p className="text-sm text-teal-600 mt-1">
                                        Contact accounts: accounts@medicare.co.za
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
