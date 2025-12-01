import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Activity,
  ArrowLeft,
  CheckCircle,
  User,
  Stethoscope,
} from "lucide-react";

// ---------- Types -----------------------------------------------------------

interface CurrentUser {
  full_name?: string;
  email?: string;
}

interface Doctor {
  id: string;
  full_name: string;
  title?: string;
  specialisation?: string;
}

interface AppointmentFormData {
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  appointment_type: string;
  department: string;
  date: Date | null;
  time: string;
  doctor_name: string;
  reason: string;
  notes: string;
}

// ---------- Component -------------------------------------------------------

export default function BookAppointment() {
  const [step, setStep] = useState<number>(1);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [user, setUser] = useState<CurrentUser | null>(null);

  const [formData, setFormData] = useState<AppointmentFormData>({
    patient_name: "",
    patient_email: "",
    patient_phone: "",
    appointment_type: "",
    department: "",
    date: null,
    time: "",
    doctor_name: "",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    void loadDoctors();
    void checkUser();
  }, []);

  const checkUser = async () => {
    const isAuth = await base44.auth.isAuthenticated();
    if (isAuth) {
      const userData = (await base44.auth.me()) as CurrentUser;
      setUser(userData);
      setFormData((prev) => ({
        ...prev,
        patient_name: userData.full_name || "",
        patient_email: userData.email || "",
      }));
    }
  };

  const loadDoctors = async () => {
    const docs = (await base44.entities.Doctor.list()) as Doctor[];
    setDoctors(docs);
  };

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];

  const appointmentTypes = [
    "Consultation",
    "Surgery",
    "Follow-up",
    "Emergency",
    "Check-up",
    "Specialist Referral",
  ];

  const departments = [
    "General Surgery",
    "Orthopaedics",
    "Cardiology",
    "Neurology",
    "Paediatrics",
    "Gynaecology",
    "Dermatology",
    "ENT",
    "Ophthalmology",
  ];

  const handleSubmit = async () => {
    if (!formData.date || !formData.time) return;

    setLoading(true);
    try {
      await base44.entities.Appointment.create({
        ...formData,
        date: format(formData.date, "yyyy-MM-dd"),
        status: "Pending",
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(
    (doc) =>
      !formData.department || doc.specialisation === formData.department
  );

  // ---------- Submitted screen ---------------------------------------------

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Appointment Requested!
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Thank you for booking with MediCare. We'll confirm your appointment
            shortly via email or phone.
          </p>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-4">
              Appointment Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium">
                  {formData.appointment_type || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Department:</span>
                <span className="font-medium">
                  {formData.department || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-medium">
                  {formData.date
                    ? format(formData.date, "dd MMMM yyyy")
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time:</span>
                <span className="font-medium">{formData.time || "-"}</span>
              </div>
              {formData.doctor_name && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Doctor:</span>
                  <span className="font-medium">{formData.doctor_name}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <Link to={createPageUrl("Home")}>
              <Button variant="outline">Return Home</Button>
            </Link>
            {user && (
              <Link to={createPageUrl("Dashboard")}>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------- Booking flow --------------------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to={createPageUrl("Home")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Book an Appointment
          </h1>
          <p className="text-gray-600">
            Fill in your details and we'll confirm your booking
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${step >= s
                      ? "bg-teal-600 text-white"
                      : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 rounded ${step > s ? "bg-teal-600" : "bg-gray-200"
                      }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-6 md:p-8">
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Personal Details
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Tell us about yourself
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input
                      placeholder="e.g. Thabo Mokoena"
                      value={formData.patient_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          patient_name: e.target.value,
                        }))
                      }
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number *</Label>
                    <Input
                      placeholder="e.g. 082 123 4567"
                      value={formData.patient_phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          patient_phone: e.target.value,
                        }))
                      }
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    placeholder="e.g. thabo@email.com"
                    value={formData.patient_email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        patient_email: e.target.value,
                      }))
                    }
                    className="h-12"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => setStep(2)}
                    className="bg-teal-600 hover:bg-teal-700"
                    disabled={
                      !formData.patient_name ||
                      !formData.patient_phone ||
                      !formData.patient_email
                    }
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Appointment Details */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Appointment Details
                    </h2>
                    <p className="text-gray-500 text-sm">
                      What type of appointment do you need?
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Appointment Type *</Label>
                    <Select
                      value={formData.appointment_type}
                      onValueChange={(v) =>
                        setFormData((prev) => ({
                          ...prev,
                          appointment_type: v,
                        }))
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {appointmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(v) =>
                        setFormData((prev) => ({
                          ...prev,
                          department: v,
                          doctor_name: "",
                        }))
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {filteredDoctors.length > 0 && (
                  <div className="space-y-2">
                    <Label>Preferred Doctor (Optional)</Label>
                    <Select
                      value={formData.doctor_name}
                      onValueChange={(v) =>
                        setFormData((prev) => ({
                          ...prev,
                          doctor_name: v === "__any" ? "" : v,
                        }))
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Any available doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__any">
                          Any available doctor
                        </SelectItem>
                        {filteredDoctors.map((doc) => (
                          <SelectItem
                            key={doc.id}
                            value={`${doc.title || ""} ${doc.full_name}`.trim()}
                          >
                            {doc.title ? `${doc.title} ` : ""}
                            {doc.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Reason for Visit</Label>
                  <Textarea
                    placeholder="Briefly describe your symptoms or reason for the appointment"
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="bg-teal-600 hover:bg-teal-700"
                    disabled={
                      !formData.appointment_type || !formData.department
                    }
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Select Date & Time
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Choose your preferred slot
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Preferred Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-12 justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.date
                            ? format(formData.date, "dd MMMM yyyy")
                            : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.date || undefined}
                          onSelect={(date) =>
                            setFormData((prev) => ({
                              ...prev,
                              date: date ?? null,
                            }))
                          }
                          disabled={(date) =>
                            date < new Date() || date.getDay() === 0
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Time *</Label>
                    <Select
                      value={formData.time}
                      onValueChange={(v) =>
                        setFormData((prev) => ({ ...prev, time: v }))
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Additional Notes (Optional)</Label>
                  <Textarea
                    placeholder="Any additional information we should know?"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                  />
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-xl p-4 mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Booking Summary
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Patient:</span>
                      <span className="ml-2 font-medium">
                        {formData.patient_name || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <span className="ml-2 font-medium">
                        {formData.appointment_type || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Department:</span>
                      <span className="ml-2 font-medium">
                        {formData.department || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="ml-2 font-medium">
                        {formData.date
                          ? format(formData.date, "dd MMM yyyy")
                          : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Time:</span>
                      <span className="ml-2 font-medium">
                        {formData.time || "-"}
                      </span>
                    </div>
                    {formData.doctor_name && (
                      <div>
                        <span className="text-gray-500">Doctor:</span>
                        <span className="ml-2 font-medium">
                          {formData.doctor_name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-teal-600 hover:bg-teal-700"
                    disabled={!formData.date || !formData.time || loading}
                  >
                    {loading ? "Submitting..." : "Confirm Booking"}
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-gray-500 text-sm mt-6">
          Need immediate assistance? Call us at{" "}
          <a
            href="tel:+27123456789"
            className="text-teal-600 font-medium"
          >
            +27 12 345 6789
          </a>
        </p>
      </div>
    </div>
  );
}

