import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  FileText, 
  Activity, 
  ArrowLeft,
  User,
  Calendar,
  Pill,
  Stethoscope,
  Heart,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function MyRecords() {
  const [openRecords, setOpenRecords] = React.useState({});

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['my-records'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.MedicalRecord.filter({ patient_email: user.email }, '-record_date');
    }
  });

  const toggleRecord = (id) => {
    setOpenRecords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const typeColors = {
    Consultation: 'bg-blue-100 text-blue-700',
    'Lab Results': 'bg-purple-100 text-purple-700',
    Prescription: 'bg-green-100 text-green-700',
    'Surgery Report': 'bg-red-100 text-red-700',
    Imaging: 'bg-orange-100 text-orange-700',
    'Discharge Summary': 'bg-teal-100 text-teal-700'
  };

  const typeIcons = {
    Consultation: Stethoscope,
    'Lab Results': FileText,
    Prescription: Pill,
    'Surgery Report': Heart,
    Imaging: FileText,
    'Discharge Summary': FileText
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
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-gray-500">View your complete medical history</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : records.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="py-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Medical Records</h3>
              <p className="text-gray-500">
                Your medical records will appear here after your appointments.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {records.map((record, idx) => {
              const Icon = typeIcons[record.record_type] || FileText;
              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Collapsible open={openRecords[record.id]}>
                    <Card className="border-0 shadow-md">
                      <CollapsibleTrigger 
                        className="w-full"
                        onClick={() => toggleRecord(record.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeColors[record.record_type]?.replace('text-', 'bg-').replace('-700', '-100')}`}>
                                <Icon className={`w-6 h-6 ${typeColors[record.record_type]?.split(' ')[1]}`} />
                              </div>
                              <div className="text-left">
                                <h3 className="font-semibold text-gray-900">{record.record_type}</h3>
                                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{format(new Date(record.record_date), 'dd MMMM yyyy')}</span>
                                </div>
                                {record.doctor_name && (
                                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                    <User className="w-4 h-4" />
                                    <span>{record.doctor_name}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={typeColors[record.record_type]}>
                                {record.record_type}
                              </Badge>
                              {openRecords[record.id] ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="px-6 pb-6 border-t pt-4 bg-gray-50">
                          <div className="grid sm:grid-cols-2 gap-6">
                            {record.diagnosis && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Diagnosis</h4>
                                <p className="text-gray-900">{record.diagnosis}</p>
                              </div>
                            )}
                            {record.treatment && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Treatment</h4>
                                <p className="text-gray-900">{record.treatment}</p>
                              </div>
                            )}
                            {record.prescription && (
                              <div className="sm:col-span-2">
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Prescription</h4>
                                <p className="text-gray-900">{record.prescription}</p>
                              </div>
                            )}
                            {record.vitals && Object.keys(record.vitals).length > 0 && (
                              <div className="sm:col-span-2">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Vitals</h4>
                                <div className="flex flex-wrap gap-4">
                                  {record.vitals.blood_pressure && (
                                    <div className="bg-white px-4 py-2 rounded-lg border">
                                      <span className="text-gray-500 text-sm">BP:</span>
                                      <span className="ml-2 font-medium">{record.vitals.blood_pressure}</span>
                                    </div>
                                  )}
                                  {record.vitals.heart_rate && (
                                    <div className="bg-white px-4 py-2 rounded-lg border">
                                      <span className="text-gray-500 text-sm">Heart Rate:</span>
                                      <span className="ml-2 font-medium">{record.vitals.heart_rate} bpm</span>
                                    </div>
                                  )}
                                  {record.vitals.temperature && (
                                    <div className="bg-white px-4 py-2 rounded-lg border">
                                      <span className="text-gray-500 text-sm">Temp:</span>
                                      <span className="ml-2 font-medium">{record.vitals.temperature}°C</span>
                                    </div>
                                  )}
                                  {record.vitals.weight && (
                                    <div className="bg-white px-4 py-2 rounded-lg border">
                                      <span className="text-gray-500 text-sm">Weight:</span>
                                      <span className="ml-2 font-medium">{record.vitals.weight} kg</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {record.notes && (
                              <div className="sm:col-span-2">
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Notes</h4>
                                <p className="text-gray-900">{record.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}