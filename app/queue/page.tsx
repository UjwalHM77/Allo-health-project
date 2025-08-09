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
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  SkipForward,
  Trash2,
  ArrowUp,
  ArrowDown,
  User,
  Stethoscope,
  Heart,
  Activity,
  TrendingUp,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { dynamicConfig } from '@/lib/dynamic-config';

// Apply dynamic rendering configuration
export const { dynamic, revalidate } = dynamicConfig;

interface QueueItem {
  id: string;
  patientName: string;
  doctorName: string;
  priority: 'high' | 'medium' | 'low';
  status: 'waiting' | 'consulting' | 'completed' | 'cancelled';
  waitTime: number;
  appointmentTime?: string;
  symptoms?: string;
}

export default function QueuePage() {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userType, setUserType] = useState<'admin' | 'doctor' | 'patient'>('admin');
  const [isLoading, setIsLoading] = useState(true);
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

    // Simulate loading queue data
    setTimeout(() => {
      const mockQueueData: QueueItem[] = [
        {
          id: 'Q001',
          patientName: 'Amit Patel',
          doctorName: 'Dr. Priya Sharma',
          priority: 'high',
          status: 'waiting',
          waitTime: 45,
          symptoms: 'Chest pain, shortness of breath'
        },
        {
          id: 'Q002',
          patientName: 'Priya Singh',
          doctorName: 'Dr. Rajesh Kumar',
          priority: 'medium',
          status: 'consulting',
          waitTime: 15,
          symptoms: 'Fever, headache'
        },
        {
          id: 'Q003',
          patientName: 'Rajesh Verma',
          doctorName: 'Dr. Priya Sharma',
          priority: 'low',
          status: 'waiting',
          waitTime: 30,
          symptoms: 'Regular checkup'
        },
        {
          id: 'Q004',
          patientName: 'Sunita Devi',
          doctorName: 'Dr. Rajesh Kumar',
          priority: 'high',
          status: 'waiting',
          waitTime: 60,
          symptoms: 'Severe abdominal pain'
        },
        {
          id: 'Q005',
          patientName: 'Vikram Malhotra',
          doctorName: 'Dr. Priya Sharma',
          priority: 'medium',
          status: 'completed',
          waitTime: 0,
          symptoms: 'Blood pressure check'
        },
        {
          id: 'Q006',
          patientName: 'Anjali Gupta',
          doctorName: 'Dr. Rajesh Kumar',
          priority: 'low',
          status: 'waiting',
          waitTime: 20,
          symptoms: 'Follow-up consultation'
        },
        {
          id: 'Q007',
          patientName: 'Mohan Sharma',
          doctorName: 'Dr. Priya Sharma',
          priority: 'high',
          status: 'consulting',
          waitTime: 5,
          symptoms: 'Diabetes management'
        },
        {
          id: 'Q008',
          patientName: 'Kavita Joshi',
          doctorName: 'Dr. Rajesh Kumar',
          priority: 'medium',
          status: 'waiting',
          waitTime: 35,
          symptoms: 'Skin rash'
        }
      ];

      // Filter based on user type
      if (role === 'doctor') {
        const doctorName = localStorage.getItem('userName') || 'Dr. Priya Sharma';
        setQueueItems(mockQueueData.filter(item => item.doctorName === doctorName));
      } else {
        setQueueItems(mockQueueData);
      }
      
      setIsLoading(false);
    }, 1000);
  }, [router]);

  const filteredQueueItems = queueItems.filter(item => {
    const matchesSearch = item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getQueueStats = () => {
    const total = queueItems.length;
    const waiting = queueItems.filter(item => item.status === 'waiting').length;
    const consulting = queueItems.filter(item => item.status === 'consulting').length;
    const completed = queueItems.filter(item => item.status === 'completed').length;
    const averageWaitTime = queueItems.length > 0 
      ? Math.round(queueItems.reduce((sum, item) => sum + item.waitTime, 0) / queueItems.length)
      : 0;

    return { total, waiting, consulting, completed, averageWaitTime };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'consulting':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAction = (action: string, itemId: string) => {
    setQueueItems(prev => prev.map(item => {
      if (item.id === itemId) {
        switch (action) {
          case 'start':
            return { ...item, status: 'consulting' as const };
          case 'complete':
            return { ...item, status: 'completed' as const, waitTime: 0 };
          case 'cancel':
            return { ...item, status: 'cancelled' as const };
          default:
            return item;
        }
      }
      return item;
    }));
  };

  const moveItem = (itemId: string, direction: 'up' | 'down') => {
    setQueueItems(prev => {
      const newItems = [...prev];
      const currentIndex = newItems.findIndex(item => item.id === itemId);
      
      if (direction === 'up' && currentIndex > 0) {
        [newItems[currentIndex], newItems[currentIndex - 1]] = [newItems[currentIndex - 1], newItems[currentIndex]];
      } else if (direction === 'down' && currentIndex < newItems.length - 1) {
        [newItems[currentIndex], newItems[currentIndex + 1]] = [newItems[currentIndex + 1], newItems[currentIndex]];
      }
      
      return newItems;
    });
  };

  const stats = getQueueStats();

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
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {userType === 'doctor' ? 'My Patient Queue' : 'Queue Management'}
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  {userType === 'doctor' 
                    ? 'Manage your patient appointments and consultations'
                    : 'Monitor and manage patient queue efficiently'
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
                onClick={() => router.push('/queue')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 text-lg font-medium shadow-lg"
              >
                <Plus className="mr-3 h-5 w-5" />
                Add Patient
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
              <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <CountUp end={stats.total} duration={2} />
              </div>
              <div className="text-sm text-blue-600 mt-2">In queue today</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600">Waiting</CardTitle>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <CountUp end={stats.waiting} duration={2} />
              </div>
              <div className="text-sm text-orange-600 mt-2">Patients waiting</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600">Consulting</CardTitle>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <CountUp end={stats.consulting} duration={2} />
              </div>
              <div className="text-sm text-blue-600 mt-2">Currently consulting</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Wait Time</CardTitle>
              <div className="p-3 bg-green-100 rounded-xl">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <CountUp end={stats.averageWaitTime} duration={2} /> min
              </div>
              <div className="text-sm text-green-600 mt-2">Average wait time</div>
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
                placeholder="Search patients, doctors..."
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
                <option value="waiting">Waiting</option>
                <option value="consulting">Consulting</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="px-4 py-2">
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              {stats.completed} Completed
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <TrendingUp className="mr-2 h-4 w-4 text-blue-600" />
              Efficiency: 85%
            </Badge>
          </div>
        </motion.div>

        {/* Queue List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <AnimatePresence>
            {filteredQueueItems.map((item, index) => (
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
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center">
                            <User className="h-8 w-8 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-4 mb-3">
                            <h3 className="text-xl font-semibold text-gray-900">{item.patientName}</h3>
                            <Badge className={`px-3 py-1 text-sm font-medium ${getPriorityColor(item.priority)}`}>
                              {item.priority.toUpperCase()} PRIORITY
                            </Badge>
                            <Badge className={`px-3 py-1 text-sm font-medium ${getStatusColor(item.status)}`}>
                              {item.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <Stethoscope className="h-4 w-4 text-gray-400" />
                              <span>{item.doctorName}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>Wait: {item.waitTime} min</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Activity className="h-4 w-4 text-gray-400" />
                              <span className="truncate">{item.symptoms}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {userType !== 'patient' && (
                          <>
                            {item.status === 'waiting' && (
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  onClick={() => handleAction('start', item.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  size="sm"
                                >
                                  <Play className="mr-2 h-4 w-4" />
                                  Start
                                </Button>
                              </motion.div>
                            )}
                            
                            {item.status === 'consulting' && (
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  onClick={() => handleAction('complete', item.id)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
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
                            
                            {userType === 'admin' && (
                              <div className="flex items-center space-x-1">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    onClick={() => moveItem(item.id, 'up')}
                                    variant="outline"
                                    size="sm"
                                    className="p-2"
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    onClick={() => moveItem(item.id, 'down')}
                                    variant="outline"
                                    size="sm"
                                    className="p-2"
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredQueueItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
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