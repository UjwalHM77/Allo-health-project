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
  Calendar, 
  Clock, 
  User,
  Activity,
  Heart,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Zap,
  Edit,
  Eye,
  Trash2,
  Settings,
  Bell,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ScheduleItem {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  duration: number;
  type: 'consultation' | 'follow-up' | 'emergency' | 'routine' | 'surgery';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  doctorName: string;
  room: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export default function SchedulePage() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [userType, setUserType] = useState<'admin' | 'doctor' | 'patient'>('doctor');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
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

    // Simulate loading schedule data
    setTimeout(() => {
      const mockScheduleData: ScheduleItem[] = [
        {
          id: 'S001',
          patientName: 'Amit Patel',
          patientId: 'P001',
          date: '2024-01-15',
          time: '09:00 AM',
          duration: 30,
          type: 'consultation',
          status: 'confirmed',
          doctorName: 'Dr. Priya Sharma',
          room: 'Consultation Room 1',
          notes: 'Follow-up for chest pain evaluation',
          priority: 'high'
        },
        {
          id: 'S002',
          patientName: 'Priya Singh',
          patientId: 'P002',
          date: '2024-01-15',
          time: '10:30 AM',
          duration: 45,
          type: 'follow-up',
          status: 'scheduled',
          doctorName: 'Dr. Rajesh Kumar',
          room: 'Consultation Room 2',
          notes: 'Diabetes management follow-up',
          priority: 'medium'
        },
        {
          id: 'S003',
          patientName: 'Rajesh Verma',
          patientId: 'P003',
          date: '2024-01-15',
          time: '11:00 AM',
          duration: 30,
          type: 'routine',
          status: 'scheduled',
          doctorName: 'Dr. Priya Sharma',
          room: 'Consultation Room 1',
          notes: 'Regular health checkup',
          priority: 'low'
        },
        {
          id: 'S004',
          patientName: 'Sunita Devi',
          patientId: 'P004',
          date: '2024-01-15',
          time: '02:00 PM',
          duration: 60,
          type: 'emergency',
          status: 'confirmed',
          doctorName: 'Dr. Rajesh Kumar',
          room: 'Emergency Room',
          notes: 'Severe abdominal pain - urgent',
          priority: 'urgent'
        },
        {
          id: 'S005',
          patientName: 'Vikram Malhotra',
          patientId: 'P005',
          date: '2024-01-15',
          time: '03:30 PM',
          duration: 45,
          type: 'consultation',
          status: 'completed',
          doctorName: 'Dr. Priya Sharma',
          room: 'Consultation Room 1',
          notes: 'Migraine consultation',
          priority: 'medium'
        },
        {
          id: 'S006',
          patientName: 'Anjali Gupta',
          patientId: 'P006',
          date: '2024-01-16',
          time: '09:00 AM',
          duration: 30,
          type: 'follow-up',
          status: 'scheduled',
          doctorName: 'Dr. Rajesh Kumar',
          room: 'Consultation Room 2',
          notes: 'Skin rash follow-up',
          priority: 'low'
        },
        {
          id: 'S007',
          patientName: 'Mohan Sharma',
          patientId: 'P007',
          date: '2024-01-16',
          time: '10:00 AM',
          duration: 60,
          type: 'surgery',
          status: 'scheduled',
          doctorName: 'Dr. Priya Sharma',
          room: 'Operation Theater 1',
          notes: 'Appendectomy surgery',
          priority: 'high'
        },
        {
          id: 'S008',
          patientName: 'Kavita Joshi',
          patientId: 'P008',
          date: '2024-01-16',
          time: '11:30 AM',
          duration: 30,
          type: 'routine',
          status: 'scheduled',
          doctorName: 'Dr. Rajesh Kumar',
          room: 'Consultation Room 2',
          notes: 'Annual health check',
          priority: 'low'
        }
      ];

      // Filter based on user type
      if (role === 'doctor') {
        const doctorName = localStorage.getItem('userName') || 'Dr. Priya Sharma';
        setScheduleItems(mockScheduleData.filter(item => item.doctorName === doctorName));
      } else if (role === 'patient') {
        const patientName = localStorage.getItem('userName') || 'Amit Patel';
        setScheduleItems(mockScheduleData.filter(item => item.patientName === patientName));
      } else {
        setScheduleItems(mockScheduleData);
      }
      
      setIsLoading(false);
    }, 1000);
  }, [router]);

  const filteredScheduleItems = scheduleItems.filter(item => {
    const matchesSearch = item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesDate = item.date === selectedDate;
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const getScheduleStats = () => {
    const total = scheduleItems.length;
    const today = scheduleItems.filter(item => item.date === '2024-01-15').length;
    const confirmed = scheduleItems.filter(item => item.status === 'confirmed').length;
    const completed = scheduleItems.filter(item => item.status === 'completed').length;
    const urgent = scheduleItems.filter(item => item.priority === 'urgent').length;

    return { total, today, confirmed, completed, urgent };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
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
      case 'follow-up':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'emergency':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'routine':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'surgery':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAction = (action: string, scheduleId: string) => {
    setScheduleItems(prev => prev.map(item => {
      if (item.id === scheduleId) {
        switch (action) {
          case 'confirm':
            return { ...item, status: 'confirmed' as const };
          case 'start':
            return { ...item, status: 'in-progress' as const };
          case 'complete':
            return { ...item, status: 'completed' as const };
          case 'cancel':
            return { ...item, status: 'cancelled' as const };
          default:
            return item;
        }
      }
      return item;
    }));
  };

  const stats = getScheduleStats();

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
              <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {userType === 'doctor' ? 'My Schedule' : 
                   userType === 'patient' ? 'My Appointments' : 'Schedule Management'}
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  {userType === 'doctor' 
                    ? 'Manage your daily appointments and availability'
                    : userType === 'patient'
                    ? 'View and manage your scheduled appointments'
                    : 'Comprehensive schedule management system'
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
                onClick={() => router.push('/schedule')}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 text-lg font-medium shadow-lg"
              >
                <Plus className="mr-3 h-5 w-5" />
                Add Schedule
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
              <CardTitle className="text-sm font-medium text-gray-600">Total Appointments</CardTitle>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <CountUp end={stats.total} duration={2} />
              </div>
              <div className="text-sm text-blue-600 mt-2">All appointments</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600">Today&apos;s Schedule</CardTitle>
              <div className="p-3 bg-green-100 rounded-xl">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <CountUp end={stats.today} duration={2} />
              </div>
              <div className="text-sm text-green-600 mt-2">Scheduled today</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600">Confirmed</CardTitle>
              <div className="p-3 bg-orange-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <CountUp end={stats.confirmed} duration={2} />
              </div>
              <div className="text-sm text-orange-600 mt-2">Confirmed appointments</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600">Urgent Cases</CardTitle>
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <CountUp end={stats.urgent} duration={2} />
              </div>
              <div className="text-sm text-red-600 mt-2">Urgent appointments</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Date Selector and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-base focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search schedule..."
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
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 text-base focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="consultation">Consultation</option>
                <option value="follow-up">Follow-up</option>
                <option value="emergency">Emergency</option>
                <option value="routine">Routine</option>
                <option value="surgery">Surgery</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="px-4 py-2">
              <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
              {stats.completed} Completed
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Zap className="mr-2 h-4 w-4 text-blue-600" />
              Efficiency: 88%
            </Badge>
          </div>
        </motion.div>

        {/* Schedule List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <AnimatePresence>
            {filteredScheduleItems.map((item, index) => (
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
                          <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center">
                            <Calendar className="h-8 w-8 text-orange-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-4 mb-3">
                            <h3 className="text-xl font-semibold text-gray-900">{item.patientName}</h3>
                            <Badge className={`px-3 py-1 text-sm font-medium ${getStatusColor(item.status)}`}>
                              {item.status.toUpperCase()}
                            </Badge>
                            <Badge className={`px-3 py-1 text-sm font-medium ${getTypeColor(item.type)}`}>
                              {item.type.toUpperCase()}
                            </Badge>
                            <Badge className={`px-3 py-1 text-sm font-medium ${getPriorityColor(item.priority)}`}>
                              {item.priority.toUpperCase()} PRIORITY
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span>ID: {item.patientId}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{item.time} ({item.duration}min)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{item.room}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Stethoscope className="h-4 w-4 text-gray-400" />
                              <span>{item.doctorName}</span>
                            </div>
                          </div>
                          {item.notes && (
                            <div className="mt-3 text-sm text-gray-600">
                              <span className="font-medium">Notes:</span> {item.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {userType !== 'patient' && (
                          <>
                            {item.status === 'scheduled' && (
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  onClick={() => handleAction('confirm', item.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  size="sm"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Confirm
                                </Button>
                              </motion.div>
                            )}
                            
                            {item.status === 'confirmed' && (
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  onClick={() => handleAction('start', item.id)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                  size="sm"
                                >
                                  <Activity className="mr-2 h-4 w-4" />
                                  Start
                                </Button>
                              </motion.div>
                            )}
                            
                            {item.status === 'in-progress' && (
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  onClick={() => handleAction('complete', item.id)}
                                  className="bg-purple-600 hover:bg-purple-700 text-white"
                                  size="sm"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Complete
                                </Button>
                              </motion.div>
                            )}
                            
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                onClick={() => handleAction('cancel', item.id)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <AlertCircle className="mr-2 h-4 w-4" />
                                Cancel
                              </Button>
                            </motion.div>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredScheduleItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No schedule items found</h3>
                      <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
