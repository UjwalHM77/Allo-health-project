'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Stethoscope, User, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type UserType = 'admin' | 'doctor' | 'patient';

interface DoctorOption {
  id: string;
  name: string;
  specialization: string;
  room: string;
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [userType, setUserType] = useState<UserType>('patient');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);

  const [form, setForm] = useState({
    patientName: '',
    doctorId: '',
    date: '',
    time: '',
    type: 'consultation' as 'consultation' | 'follow-up' | 'emergency' | 'routine',
    symptoms: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = (localStorage.getItem('userRole') as UserType) || 'patient';
    const userName = localStorage.getItem('userName');

    if (!token) {
      router.push('/');
      return;
    }

    setUserType(role);
    if (role === 'patient' && userName) {
      setForm((f) => ({ ...f, patientName: userName }));
    }
    // Load doctors from API
    fetch('/api/doctors')
      .then((r) => r.json())
      .then((list) => {
        const mapped = list.map((d: any) => ({ id: d.id, name: d.name, specialization: d.specialization, room: d.location || 'Consultation Room' }));
        setDoctors(mapped);
      })
      .catch(() => {});
  }, [router]);

  const canSubmit =
    form.patientName.trim() && form.doctorId && form.date && form.time && !isSubmitting;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);

    // Create or reuse a patient, then create appointment
    const ensurePatient = async () => {
      const existing = await fetch('/api/patients').then((r) => r.json());
      const found = existing.find((p: any) => p.name === form.patientName);
      if (found) return found.id as string;
      const created = await fetch('/api/patients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.patientName }) }).then((r) => r.json());
      return created.id as string;
    };

    ensurePatient()
      .then(async (patientId) => {
        await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patientId,
            doctorId: form.doctorId,
            date: form.date,
            time: form.time,
            type: form.type,
            symptoms: form.symptoms
          })
        });
        const doctor = doctors.find((d) => d.id === form.doctorId);
        toast({ title: 'Appointment Booked', description: `${form.patientName} with ${doctor?.name} on ${form.date} at ${form.time}` });
        router.push('/appointments');
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Book Appointment</h1>
                <p className="text-gray-600 mt-1">
                  {userType === 'patient' ? 'Schedule a visit with a doctor' : 'Create a booking for a patient'}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="px-3 py-1">New</Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="lg:col-span-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
                <CardDescription>Fill in the details to confirm your appointment</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="patientName"
                          value={form.patientName}
                          onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                          placeholder="Full name"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="doctor">Doctor</Label>
                      <Select value={form.doctorId} onValueChange={(value) => setForm({ ...form, doctorId: value })}>
                        <SelectTrigger id="doctor">
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((d) => (
                            <SelectItem key={d.id} value={d.id}>{`${d.name} • ${d.specialization}`}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="date"
                          type="date"
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="time"
                          type="time"
                          value={form.time}
                          onChange={(e) => setForm({ ...form, time: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Visit Type</Label>
                      <Select value={form.type} onValueChange={(value: any) => setForm({ ...form, type: value })}>
                        <SelectTrigger id="type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="follow-up">Follow-up</SelectItem>
                          <SelectItem value="routine">Routine</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Symptoms / Notes</Label>
                    <Input
                      id="symptoms"
                      placeholder="Briefly describe symptoms (optional)"
                      value={form.symptoms}
                      onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={!canSubmit} className="bg-gradient-to-r from-blue-600 to-cyan-600">
                      {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle>Availability & Info</CardTitle>
                <CardDescription>Selected doctor details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {form.doctorId ? (
                  (() => {
                    const d = doctors.find((x) => x.id === form.doctorId)!;
                    return (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Stethoscope className="h-4 w-4 text-blue-600" />
                          <span>{d.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <MapPin className="h-4 w-4 text-cyan-600" />
                          <span>{d.room}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">{d.specialization}</Badge>
                        <div className="text-xs text-gray-500">Typical slots: 9:00 AM - 5:00 PM</div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                    Select a doctor to view details
                  </div>
                )}
                <div className="pt-2">
                  <div className="text-xs text-gray-500">After booking, you can manage it from My Appointments.</div>
                </div>
                {canSubmit && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    Ready to book
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}


