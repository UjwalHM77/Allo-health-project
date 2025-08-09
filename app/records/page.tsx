'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  User, 
  Calendar,
  Activity,
  Heart,
  Thermometer,
  Pill,
  Microscope,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  Download,
  Edit,
  Eye,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface MedicalRecord {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  doctorName: string;
  type: 'consultation' | 'lab-test' | 'prescription' | 'follow-up' | 'emergency';
  status: 'completed' | 'pending' | 'in-progress' | 'cancelled';
  symptoms: string;
  diagnosis: string;
  prescription?: string;
  notes?: string;
  vitalSigns?: {
    bloodPressure: string;
    temperature: string;
    heartRate: string;
    weight: string;
  };
}

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [userType, setUserType] = useState<'admin' | 'doctor' | 'patient'>('doctor');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole') as 'admin' | 'doctor' | 'patient';
    
    if (!token) {
      router.push('/');
      return;
    }

    if (role) {
      setUserType(role);
    }

    // Simulate loading medical records data
    setTimeout(() => {
      const mockRecordsData: MedicalRecord[] = [
        {
          id: 'MR001',
          patientName: 'Amit Patel',
          patientId: 'P001',
          date: '2024-01-15',
          doctorName: 'Dr. Priya Sharma',
          type: 'consultation',
          status: 'completed',
          symptoms: 'Chest pain, shortness of breath',
          diagnosis: 'Angina pectoris - stable',
          prescription: 'Nitroglycerin 0.4mg sublingual, Aspirin 81mg daily',
          notes: 'Patient advised to avoid strenuous activities and follow up in 2 weeks',
          vitalSigns: {
            bloodPressure: '140/90 mmHg',
            temperature: '98.6°F',
            heartRate: '85 bpm',
            weight: '75 kg'
          }
        },
        {
          id: 'MR002',
          patientName: 'Priya Singh',
          patientId: 'P002',
          date: '2024-01-14',
          doctorName: 'Dr. Rajesh Kumar',
          type: 'lab-test',
          status: 'completed',
          symptoms: 'Fatigue, increased thirst',
          diagnosis: 'Type 2 Diabetes Mellitus',
          prescription: 'Metformin 500mg twice daily, Lifestyle modifications',
          notes: 'Blood sugar monitoring advised, follow up in 1 month',
          vitalSigns: {
            bloodPressure: '135/85 mmHg',
            temperature: '98.4°F',
            heartRate: '78 bpm',
            weight: '68 kg'
          }
        },
        {
          id: 'MR003',
          patientName: 'Rajesh Verma',
          patientId: 'P003',
          date: '2024-01-13',
          doctorName: 'Dr. Priya Sharma',
          type: 'follow-up',
          status: 'completed',
          symptoms: 'Hypertension management',
          diagnosis: 'Essential Hypertension - well controlled',
          prescription: 'Amlodipine 5mg daily, Losartan 50mg daily',
          notes: 'Blood pressure well controlled, continue current medication',
          vitalSigns: {
            bloodPressure: '130/80 mmHg',
            temperature: '98.2°F',
            heartRate: '72 bpm',
            weight: '82 kg'
          }
        },
        {
          id: 'MR004',
          patientName: 'Sunita Devi',
          patientId: 'P004',
          date: '2024-01-12',
          doctorName: 'Dr. Rajesh Kumar',
          type: 'emergency',
          status: 'completed',
          symptoms: 'Severe abdominal pain, nausea',
          diagnosis: 'Acute appendicitis',
          prescription: 'Ceftriaxone 1g IV, Metronidazole 500mg IV',
          notes: 'Emergency appendectomy performed successfully',
          vitalSigns: {
            bloodPressure: '150/95 mmHg',
            temperature: '101.2°F',
            heartRate: '95 bpm',
            weight: '65 kg'
          }
        },
        {
          id: 'MR005',
          patientName: 'Vikram Malhotra',
          patientId: 'P005',
          date: '2024-01-11',
          doctorName: 'Dr. Priya Sharma',
          type: 'consultation',
          status: 'completed',
          symptoms: 'Headache, dizziness',
          diagnosis: 'Migraine with aura',
          prescription: 'Sumatriptan 50mg as needed, Propranolol 40mg daily',
          notes: 'Avoid trigger factors, follow up in 3 months',
          vitalSigns: {
            bloodPressure: '125/75 mmHg',
            temperature: '98.8°F',
            heartRate: '70 bpm',
            weight: '70 kg'
          }
        },
        {
          id: 'MR006',
          patientName: 'Anjali Gupta',
          patientId: 'P006',
          date: '2024-01-10',
          doctorName: 'Dr. Rajesh Kumar',
          type: 'prescription',
          status: 'completed',
          symptoms: 'Skin rash, itching',
          diagnosis: 'Contact dermatitis',
          prescription: 'Hydrocortisone 1% cream, Cetirizine 10mg daily',
          notes: 'Avoid contact with irritants, follow up in 1 week',
          vitalSigns: {
            bloodPressure: '120/75 mmHg',
            temperature: '98.6°F',
            heartRate: '75 bpm',
            weight: '58 kg'
          }
        },
        {
          id: 'MR007',
          patientName: 'Mohan Sharma',
          patientId: 'P007',
          date: '2024-01-09',
          doctorName: 'Dr. Priya Sharma',
          type: 'lab-test',
          status: 'pending',
          symptoms: 'Fatigue, joint pain',
          diagnosis: 'Rheumatoid arthritis suspected',
          prescription: 'Ibuprofen 400mg three times daily',
          notes: 'Blood tests ordered for RA factor and CRP',
          vitalSigns: {
            bloodPressure: '140/85 mmHg',
            temperature: '98.4°F',
            heartRate: '80 bpm',
            weight: '78 kg'
          }
        },
        {
          id: 'MR008',
          patientName: 'Kavita Joshi',
          patientId: 'P008',
          date: '2024-01-08',
          doctorName: 'Dr. Rajesh Kumar',
          type: 'consultation',
          status: 'in-progress',
          symptoms: 'Cough, fever, body aches',
          diagnosis: 'Upper respiratory tract infection',
          prescription: 'Azithromycin 500mg daily for 3 days',
          notes: 'Rest and plenty of fluids recommended',
          vitalSigns: {
            bloodPressure: '135/80 mmHg',
            temperature: '100.4°F',
            heartRate: '88 bpm',
            weight: '62 kg'
          }
        }
      ];

      // Filter based on user type
      if (role === 'doctor') {
        const doctorName = localStorage.getItem('userName') || 'Dr. Priya Sharma';
        setRecords(mockRecordsData.filter(item => item.doctorName === doctorName));
      } else if (role === 'patient') {
        const patientName = localStorage.getItem('userName') || 'Amit Patel';
        setRecords(mockRecordsData.filter(item => item.patientName === patientName));
      } else {
        setRecords(mockRecordsData);
      }
      
      setIsLoading(false);
    }, 1000);
  }, [router]);

  const filteredRecords = records.filter(item => {
    const matchesSearch = item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getRecordsStats = () => {
    const total = records.length;
    const completed = records.filter(item => item.status === 'completed').length;
    const pending = records.filter(item => item.status === 'pending').length;
    const inProgress = records.filter(item => item.status === 'in-progress').length;
    const consultations = records.filter(item => item.type === 'consultation').length;

    return { total, completed, pending, inProgress, consultations };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lab-test':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'prescription':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'follow-up':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'emergency':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const stats = getRecordsStats();

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
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {userType === 'doctor' ? 'My Medical Records' : 
                   userType === 'patient' ? 'My Medical History' : 'Medical Records Management'}
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  {userType === 'doctor' 
                    ? 'Access and manage patient medical records'
                    : userType === 'patient'
                    ? 'View your complete medical history and records'
                    : 'Comprehensive medical records management system'
                  }
                </p>
              </div>
            </div>
          </div>
          {userType === 'admin' && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => router.push('/records')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-medium shadow-lg"
              >
                <Plus className="mr-3 h-5 w-5" />
                Add Record
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600">Total Records</CardTitle>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <CountUp end={stats.total} duration={2} />
              </div>
              <div className="text-sm text-blue-600 mt-2">All medical records</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <CountUp end={stats.completed} duration={2} />
              </div>
              <div className="text-sm text-green-600 mt-2">Completed records</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <CountUp end={stats.pending} duration={2} />
              </div>
              <div className="text-sm text-yellow-600 mt-2">Pending records</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600">Consultations</CardTitle>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Stethoscope className="h-6 w-6 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <CountUp end={stats.consultations} duration={2} />
              </div>
              <div className="text-sm text-purple-600 mt-2">Consultation records</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-base"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-base focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-base focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="consultation">Consultation</option>
                <option value="lab-test">Lab Test</option>
                <option value="prescription">Prescription</option>
                <option value="follow-up">Follow-up</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="px-4 py-2">
              <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
              {stats.inProgress} In Progress
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Zap className="mr-2 h-4 w-4 text-blue-600" />
              Updated Today
            </Badge>
          </div>
        </motion.div>

        {/* Records List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <AnimatePresence>
            {filteredRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center">
                            <FileText className="h-8 w-8 text-purple-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-4 mb-3">
                            <h3 className="text-xl font-semibold text-gray-900">{record.patientName}</h3>
                            <Badge className={`px-3 py-1 text-sm font-medium ${getStatusColor(record.status)}`}>
                              {record.status.toUpperCase()}
                            </Badge>
                            <Badge className={`px-3 py-1 text-sm font-medium ${getTypeColor(record.type)}`}>
                              {record.type.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span>ID: {record.patientId}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{record.date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Stethoscope className="h-4 w-4 text-gray-400" />
                              <span>{record.doctorName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Activity className="h-4 w-4 text-gray-400" />
                              <span className="truncate">{record.diagnosis}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => setSelectedRecord(record)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </motion.div>
                        
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Export
                          </Button>
                        </motion.div>
                        
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-purple-600 border-purple-200 hover:bg-purple-50"
                          >
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredRecords.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No medical records found</h3>
                      <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Record Detail Modal */}
        {selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedRecord(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Medical Record Details</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRecord(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Patient Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedRecord.patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Patient ID:</span>
                        <span className="font-medium">{selectedRecord.patientId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{selectedRecord.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Doctor:</span>
                        <span className="font-medium">{selectedRecord.doctorName}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Vital Signs</h3>
                    {selectedRecord.vitalSigns && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="text-sm">{selectedRecord.vitalSigns.bloodPressure}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Thermometer className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">{selectedRecord.vitalSigns.temperature}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{selectedRecord.vitalSigns.heartRate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{selectedRecord.vitalSigns.weight}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Clinical Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 text-sm">Symptoms:</span>
                        <p className="text-sm mt-1">{selectedRecord.symptoms}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Diagnosis:</span>
                        <p className="text-sm mt-1 font-medium">{selectedRecord.diagnosis}</p>
                      </div>
                      {selectedRecord.prescription && (
                        <div>
                          <span className="text-gray-600 text-sm">Prescription:</span>
                          <p className="text-sm mt-1">{selectedRecord.prescription}</p>
                        </div>
                      )}
                      {selectedRecord.notes && (
                        <div>
                          <span className="text-gray-600 text-sm">Notes:</span>
                          <p className="text-sm mt-1">{selectedRecord.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
