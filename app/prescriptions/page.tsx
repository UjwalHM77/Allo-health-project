'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Pill, User, Calendar, Download, Printer, FileText, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type UserType = 'admin' | 'doctor' | 'patient';

interface Prescription {
  id: string;
  date: string;
  patientName: string;
  doctorName: string;
  medicines: { name: string; dosage: string; frequency: string; duration: string }[];
  notes?: string;
  status: 'active' | 'fulfilled' | 'cancelled';
}

export default function PrescriptionsPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>('patient');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = (localStorage.getItem('userRole') as UserType) || 'patient';
    const userName = localStorage.getItem('userName');

    if (!token) {
      router.push('/');
      return;
    }
    setUserType(role);

    setTimeout(() => {
      const mock: Prescription[] = [
        {
          id: 'PR001',
          date: '2024-01-15',
          patientName: 'Amit Patel',
          doctorName: 'Dr. Priya Sharma',
          medicines: [
            { name: 'Aspirin', dosage: '81 mg', frequency: 'Once daily', duration: '30 days' },
            { name: 'Nitroglycerin', dosage: '0.4 mg', frequency: 'PRN chest pain', duration: 'As needed' }
          ],
          notes: 'Avoid strenuous activity',
          status: 'active'
        },
        {
          id: 'PR002',
          date: '2024-01-12',
          patientName: 'Priya Singh',
          doctorName: 'Dr. Rajesh Kumar',
          medicines: [
            { name: 'Metformin', dosage: '500 mg', frequency: 'Twice daily', duration: '90 days' }
          ],
          status: 'fulfilled'
        },
        {
          id: 'PR003',
          date: '2024-01-10',
          patientName: 'Mohan Sharma',
          doctorName: 'Dr. Priya Sharma',
          medicines: [
            { name: 'Ibuprofen', dosage: '400 mg', frequency: 'TID after meals', duration: '7 days' }
          ],
          status: 'cancelled'
        }
      ];

      if (role === 'doctor') {
        setPrescriptions(mock.filter((p) => p.doctorName === (userName || 'Dr. Priya Sharma')));
      } else if (role === 'patient') {
        setPrescriptions(mock.filter((p) => p.patientName === (userName || 'Amit Patel')));
      } else {
        setPrescriptions(mock);
      }
      setIsLoading(false);
    }, 800);
  }, [router]);

  const filtered = prescriptions.filter((p) => {
    const matches =
      p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const statusOk = statusFilter === 'all' || p.status === statusFilter;
    return matches && statusOk;
  });

  const getStatusBadge = (status: Prescription['status']) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fulfilled':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl">
                <Pill className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Prescriptions</h1>
                <p className="text-xl text-gray-600 mt-2">
                  {userType === 'patient' ? 'Your prescribed medications' : userType === 'doctor' ? 'Prescriptions you issued' : 'All prescriptions'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-lg px-4 py-2 text-base focus:border-blue-500 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search patient, doctor, ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((p, index) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                <Card className="hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                          <Pill className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{p.id}</CardTitle>
                          <CardDescription>{p.date}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusBadge(p.status)}>{p.status.toUpperCase()}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2"><User className="h-4 w-4 text-gray-400" />{p.patientName}</div>
                      <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-gray-400" />{p.doctorName}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1">Medicines</div>
                      <ul className="space-y-2">
                        {p.medicines.map((m, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs">{i + 1}</span>
                            <span className="font-medium">{m.name}</span>
                            <span className="text-gray-500">{m.dosage}</span>
                            <span className="text-gray-500">• {m.frequency}</span>
                            <span className="text-gray-500">• {m.duration}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {p.notes && (
                      <div className="text-xs text-gray-600">Notes: {p.notes}</div>
                    )}
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                        <Download className="mr-2 h-4 w-4" /> Export
                      </Button>
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" /> Print
                      </Button>
                      {userType !== 'patient' && p.status === 'active' && (
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                          <CheckCircle className="mr-2 h-4 w-4" /> Mark Fulfilled
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No prescriptions found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}


