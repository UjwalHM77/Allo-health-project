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
  Eye,
  Printer,
  History,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface MedicalHistory {
  id: string;
  date: string;
  doctorName: string;
  type: 'consultation' | 'lab-test' | 'prescription' | 'follow-up' | 'emergency' | 'surgery';
  diagnosis: string;
  symptoms: string;
  prescription?: string;
  notes?: string;
  vitalSigns?: {
    bloodPressure: string;
    temperature: string;
    heartRate: string;
    weight: string;
  };
  labResults?: {
    testName: string;
    result: string;
    normalRange: string;
    status: 'normal' | 'abnormal' | 'critical';
  }[];
}

export default function MedicalHistoryPage() {
  const [historyItems, setHistoryItems] = useState<MedicalHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [userType, setUserType] = useState<'admin' | 'doctor' | 'patient'>('patient');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState<MedicalHistory | null>(null);
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

    // Simulate loading medical history data
    setTimeout(() => {
      const mockHistoryData: MedicalHistory[] = [
        {
          id: 'H001',
          date: '2024-01-15',
          doctorName: 'Dr. Priya Sharma',
          type: 'consultation',
          diagnosis: 'Angina pectoris - stable',
          symptoms: 'Chest pain, shortness of breath',
          prescription: 'Nitroglycerin 0.4mg sublingual, Aspirin 81mg daily',
          notes: 'Patient advised to avoid strenuous activities and follow up in 2 weeks',
          vitalSigns: {
            bloodPressure: '140/90 mmHg',
            temperature: '98.6°F',
            heartRate: '85 bpm',
            weight: '75 kg'
          },
          labResults: [
            {
              testName: 'Complete Blood Count',
              result: 'Normal',
              normalRange: '4.5-11.0 x10^9/L',
              status: 'normal'
            },
            {
              testName: 'Lipid Profile',
              result: 'Cholesterol: 220 mg/dL',
              normalRange: '<200 mg/dL',
              status: 'abnormal'
            }
          ]
        },
        {
          id: 'H002',
          date: '2024-01-10',
          doctorName: 'Dr. Rajesh Kumar',
          type: 'lab-test',
          diagnosis: 'Type 2 Diabetes Mellitus',
          symptoms: 'Fatigue, increased thirst',
          prescription: 'Metformin 500mg twice daily, Lifestyle modifications',
          notes: 'Blood sugar monitoring advised, follow up in 1 month',
          vitalSigns: {
            bloodPressure: '135/85 mmHg',
            temperature: '98.4°F',
            heartRate: '78 bpm',
            weight: '68 kg'
          },
          labResults: [
            {
              testName: 'Fasting Blood Sugar',
              result: '180 mg/dL',
              normalRange: '70-100 mg/dL',
              status: 'abnormal'
            },
            {
              testName: 'HbA1c',
              result: '8.2%',
              normalRange: '<5.7%',
              status: 'abnormal'
            }
          ]
        },
        {
          id: 'H003',
          date: '2024-01-05',
          doctorName: 'Dr. Priya Sharma',
          type: 'follow-up',
          diagnosis: 'Essential Hypertension - well controlled',
          symptoms: 'Hypertension management',
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
          id: 'H004',
          date: '2023-12-20',
          doctorName: 'Dr. Rajesh Kumar',
          type: 'emergency',
          diagnosis: 'Acute appendicitis',
          symptoms: 'Severe abdominal pain, nausea',
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
          id: 'H005',
          date: '2023-12-10',
          doctorName: 'Dr. Priya Sharma',
          type: 'consultation',
          diagnosis: 'Migraine with aura',
          symptoms: 'Headache, dizziness',
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
          id: 'H006',
          date: '2023-11-25',
          doctorName: 'Dr. Rajesh Kumar',
          type: 'prescription',
          diagnosis: 'Contact dermatitis',
          symptoms: 'Skin rash, itching',
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
          id: 'H007',
          date: '2023-11-15',
          doctorName: 'Dr. Priya Sharma',
          type: 'lab-test',
          diagnosis: 'Rheumatoid arthritis suspected',
          symptoms: 'Fatigue, joint pain',
          prescription: 'Ibuprofen 400mg three times daily',
          notes: 'Blood tests ordered for RA factor and CRP',
          vitalSigns: {
            bloodPressure: '140/85 mmHg',
            temperature: '98.4°F',
            heartRate: '80 bpm',
            weight: '78 kg'
          },
          labResults: [
            {
              testName: 'Rheumatoid Factor',
              result: 'Positive',
              normalRange: 'Negative',
              status: 'abnormal'
            },
            {
              testName: 'CRP',
              result: '15 mg/L',
              normalRange: '<3 mg/L',
              status: 'abnormal'
            }
          ]
        },
        {
          id: 'H008',
          date: '2023-11-05',
          doctorName: 'Dr. Rajesh Kumar',
          type: 'consultation',
          diagnosis: 'Upper respiratory tract infection',
          symptoms: 'Cough, fever, body aches',
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

      setHistoryItems(mockHistoryData);
      setIsLoading(false);
    }, 1000);
  }, [router]);

  const filteredHistoryItems = historyItems.filter(item => {
    const matchesSearch = item.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getHistoryStats = () => {
    const total = historyItems.length;
    const consultations = historyItems.filter(item => item.type === 'consultation').length;
    const labTests = historyItems.filter(item => item.type === 'lab-test').length;
    const surgeries = historyItems.filter(item => item.type === 'surgery' || item.type === 'emergency').length;
    const recent = historyItems.filter(item => {
      const itemDate = new Date(item.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return itemDate >= thirtyDaysAgo;
    }).length;

    return { total, consultations, labTests, surgeries, recent };
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
      case 'surgery':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLabResultColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'abnormal':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const stats = getHistoryStats();

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
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl">
                <History className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">My Medical History</h1>
                <p className="text-xl text-gray-600 mt-2">
                  Complete medical history and health records
                </p>
              </div>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => window.print()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium shadow-lg"
            >
              <Printer className="mr-3 h-5 w-5" />
              Print History
            </Button>
          </motion.div>
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
              <CardTitle className="text-sm font-medium text-gray-600">Consultations</CardTitle>
              <div className="p-3 bg-green-100 rounded-xl">
                <Stethoscope className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <CountUp end={stats.consultations} duration={2} />
              </div>
              <div className="text-sm text-green-600 mt-2">Doctor consultations</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600">Lab Tests</CardTitle>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Microscope className="h-6 w-6 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <CountUp end={stats.labTests} duration={2} />
              </div>
              <div className="text-sm text-purple-600 mt-2">Laboratory tests</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600">Recent (30 days)</CardTitle>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <CountUp end={stats.recent} duration={2} />
              </div>
              <div className="text-sm text-orange-600 mt-2">Recent visits</div>
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
                placeholder="Search medical history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-base"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
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
                <option value="surgery">Surgery</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="px-4 py-2">
              <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
              {stats.surgeries} Surgeries
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Zap className="mr-2 h-4 w-4 text-blue-600" />
              Last Updated: Today
            </Badge>
          </div>
        </motion.div>

        {/* History List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <AnimatePresence>
            {filteredHistoryItems.map((item, index) => (
              <motion.div
                key={item.id}
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
                          <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                            <History className="h-8 w-8 text-indigo-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-4 mb-3">
                            <h3 className="text-xl font-semibold text-gray-900">{item.diagnosis}</h3>
                            <Badge className={`px-3 py-1 text-sm font-medium ${getTypeColor(item.type)}`}>
                              {item.type.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{item.date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Stethoscope className="h-4 w-4 text-gray-400" />
                              <span>{item.doctorName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Activity className="h-4 w-4 text-gray-400" />
                              <span className="truncate">{item.symptoms}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Pill className="h-4 w-4 text-gray-400" />
                              <span className="truncate">{item.prescription ? 'Prescribed' : 'No prescription'}</span>
                            </div>
                          </div>
                          {item.labResults && item.labResults.length > 0 && (
                            <div className="mt-3">
                              <span className="text-sm font-medium text-gray-700">Lab Results:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {item.labResults.map((result, idx) => (
                                  <Badge 
                                    key={idx}
                                    className={`px-2 py-1 text-xs ${getLabResultColor(result.status)}`}
                                  >
                                    {result.testName}: {result.status}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => setSelectedHistory(item)}
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredHistoryItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <History className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No medical history found</h3>
                      <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* History Detail Modal */}
        {selectedHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedHistory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Medical History Details</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedHistory(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Visit Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{selectedHistory.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Doctor:</span>
                        <span className="font-medium">{selectedHistory.doctorName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium capitalize">{selectedHistory.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Diagnosis:</span>
                        <span className="font-medium">{selectedHistory.diagnosis}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Vital Signs</h3>
                    {selectedHistory.vitalSigns && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="text-sm">{selectedHistory.vitalSigns.bloodPressure}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Thermometer className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">{selectedHistory.vitalSigns.temperature}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{selectedHistory.vitalSigns.heartRate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{selectedHistory.vitalSigns.weight}</span>
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
                        <p className="text-sm mt-1">{selectedHistory.symptoms}</p>
                      </div>
                      {selectedHistory.prescription && (
                        <div>
                          <span className="text-gray-600 text-sm">Prescription:</span>
                          <p className="text-sm mt-1">{selectedHistory.prescription}</p>
                        </div>
                      )}
                      {selectedHistory.notes && (
                        <div>
                          <span className="text-gray-600 text-sm">Notes:</span>
                          <p className="text-sm mt-1">{selectedHistory.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedHistory.labResults && selectedHistory.labResults.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Laboratory Results</h3>
                      <div className="space-y-3">
                        {selectedHistory.labResults.map((result, idx) => (
                          <div key={idx} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{result.testName}</span>
                              <Badge className={`px-2 py-1 text-xs ${getLabResultColor(result.status)}`}>
                                {result.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              <div>Result: {result.result}</div>
                              <div>Normal Range: {result.normalRange}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
