import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Activity,
  ArrowLeft,
  Plus,
  User,
  Stethoscope,
  XCircle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MyAppointments() {
  const [filter, setFilter] = useState('upcoming');
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Appointment.filter({ patient_email: user.email }, '-date');
    }
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => base44.entities.Appointment.update(id, { status: 'Cancelled' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
  });

  const now = new Date();
  const filteredAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    if (filter === 'upcoming') return aptDate >= now && apt.status !== 'Cancelled';
    if (filter === 'past') return aptDate < now || apt.status === 'Completed';
    if (filter === 'cancelled') return apt.status === 'Cancelled';
    return true;
  });

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Confirmed: 'bg-green-100 text-green-700 border-green-200',
    Completed: 'bg-blue-100 text-blue-700 border-blue-200',
    Cancelled: 'bg-red-100 text-red-700 border-red-200',
    'No-Show': 'bg-gray-100 text-gray-700 border-gray-200'
  };

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-500">View and manage your appointments</p>
          </div>
          <Link to={createPageUrl('BookAppointment')}>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Book New
            </Button>
          </Link>
        </div>

        <Tabs value={filter} onValueChange={setFilter} className="mb-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
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
        ) : filteredAppointments.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No {filter} appointments
              </h3>
              <p className="text-gray-500 mb-4">
                {filter === 'upcoming' && "You don't have any upcoming appointments scheduled."}
                {filter === 'past' && "You don't have any past appointments."}
                {filter === 'cancelled' && "You don't have any cancelled appointments."}
              </p>
              {filter === 'upcoming' && (
                <Link to={createPageUrl('BookAppointment')}>
                  <Button className="bg-teal-600 hover:bg-teal-700">Book an Appointment</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((apt, idx) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-7 h-7 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{apt.appointment_type}</h3>
                          <div className="flex items-center gap-2 text-gray-500 mt-1">
                            <Stethoscope className="w-4 h-4" />
                            <span>{apt.department}</span>
                          </div>
                          {apt.doctor_name && (
                            <div className="flex items-center gap-2 text-gray-500 mt-1">
                              <User className="w-4 h-4" />
                              <span>{apt.doctor_name}</span>
                            </div>
                          )}
                          {apt.reason && (
                            <p className="text-gray-600 mt-2 text-sm">{apt.reason}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${statusColors[apt.status]} border`}>
                          {apt.status}
                        </Badge>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {format(new Date(apt.date), 'EEEE, dd MMM yyyy')}
                          </div>
                          <div className="flex items-center justify-end gap-1 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{apt.time}</span>
                          </div>
                        </div>

                        {apt.status === 'Pending' || apt.status === 'Confirmed' ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                <XCircle className="w-4 h-4 mr-1" />
                                Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel this appointment? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => cancelMutation.mutate(apt.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Yes, Cancel
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
