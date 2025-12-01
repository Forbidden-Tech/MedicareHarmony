import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  Calendar, 
  Clock, 
  FileText, 
  CreditCard, 
  MessageCircle,
  Activity,
  ChevronRight,
  Plus,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await base44.auth.me();
    setUser(userData);
  };

  const { data: appointments = [] } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Appointment.filter({ patient_email: user.email }, '-date');
    }
  });

  const { data: records = [] } = useQuery({
    queryKey: ['my-records'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.MedicalRecord.filter({ patient_email: user.email }, '-record_date');
    }
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['my-invoices'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Invoice.filter({ patient_email: user.email }, '-date');
    }
  });

  const upcomingAppointments = appointments.filter(
    a => new Date(a.date) >= new Date() && a.status !== 'Cancelled'
  ).slice(0, 3);

  const pendingInvoices = invoices.filter(i => i.status === 'Pending');
  const totalOwed = pendingInvoices.reduce((sum, i) => sum + (i.total || 0), 0);

  const navItems = [
    { icon: Home, label: 'Dashboard', page: 'Dashboard' },
    { icon: Calendar, label: 'Appointments', page: 'MyAppointments' },
    { icon: FileText, label: 'Medical Records', page: 'MyRecords' },
    { icon: CreditCard, label: 'Invoices', page: 'MyInvoices' },
    { icon: MessageCircle, label: 'AI Assistant', page: 'HealthChat' },
  ];

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Confirmed: 'bg-green-100 text-green-700',
    Completed: 'bg-blue-100 text-blue-700',
    Cancelled: 'bg-red-100 text-red-700',
    'No-Show': 'bg-gray-100 text-gray-700',
    Paid: 'bg-green-100 text-green-700',
    Overdue: 'bg-red-100 text-red-700'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link to={createPageUrl('Home')} className="flex items-center gap-2">
                <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900 hidden sm:block">MediCare</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                {upcomingAppointments.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                    {upcomingAppointments.length}
                  </span>
                )}
              </Button>
              <div className="flex items-center gap-2 pl-3 border-l">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-teal-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.full_name || 'Patient'}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => base44.auth.logout(createPageUrl('Home'))}
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r min-h-[calc(100vh-4rem)] p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.page}
                to={createPageUrl(item.page)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  item.page === 'Dashboard' 
                    ? 'bg-teal-50 text-teal-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-8 p-4 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl text-white">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-teal-100 mb-3">Chat with our AI assistant for quick answers</p>
            <Link to={createPageUrl('HealthChat')}>
              <Button size="sm" className="bg-white text-teal-600 hover:bg-teal-50 w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Chat
              </Button>
            </Link>
          </div>
        </aside>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div 
              className="w-64 bg-white h-full p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="space-y-1 mt-4">
                {navItems.map((item) => (
                  <Link 
                    key={item.page}
                    to={createPageUrl(item.page)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      item.page === 'Dashboard' 
                        ? 'bg-teal-50 text-teal-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Welcome */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Welcome back, {user?.full_name?.split(' ')[0] || 'Patient'}! 👋
              </h1>
              <p className="text-gray-500 mt-1">Here's an overview of your health journey</p>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Upcoming', value: upcomingAppointments.length, icon: Calendar, color: 'teal' },
                { label: 'Records', value: records.length, icon: FileText, color: 'blue' },
                { label: 'Pending Bills', value: pendingInvoices.length, icon: CreditCard, color: 'orange' },
                { label: 'Amount Due', value: `R${totalOwed.toLocaleString()}`, icon: Activity, color: 'red' },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-500 text-sm">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                          <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link to={createPageUrl('BookAppointment')}>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </Link>
              <Link to={createPageUrl('HealthChat')}>
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ask AI Assistant
                </Button>
              </Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Upcoming Appointments */}
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
                    <Link to={createPageUrl('MyAppointments')}>
                      <Button variant="ghost" size="sm" className="text-teal-600">
                        View All <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No upcoming appointments</p>
                      <Link to={createPageUrl('BookAppointment')}>
                        <Button variant="link" className="text-teal-600 mt-2">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    upcomingAppointments.map((apt) => (
                      <div 
                        key={apt.id} 
                        className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{apt.appointment_type}</p>
                          <p className="text-sm text-gray-500">{apt.department}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {format(new Date(apt.date), 'dd MMM')}
                          </p>
                          <p className="text-sm text-gray-500">{apt.time}</p>
                        </div>
                        <Badge className={statusColors[apt.status]}>
                          {apt.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Recent Invoices */}
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Recent Invoices</CardTitle>
                    <Link to={createPageUrl('MyInvoices')}>
                      <Button variant="ghost" size="sm" className="text-teal-600">
                        View All <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {invoices.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No invoices yet</p>
                    </div>
                  ) : (
                    invoices.slice(0, 3).map((inv) => (
                      <div 
                        key={inv.id} 
                        className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">{inv.invoice_number || 'Invoice'}</p>
                          <p className="text-sm text-gray-500">
                            {inv.date ? format(new Date(inv.date), 'dd MMM yyyy') : '-'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            R{inv.total?.toLocaleString()}
                          </p>
                        </div>
                        <Badge className={statusColors[inv.status]}>
                          {inv.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}