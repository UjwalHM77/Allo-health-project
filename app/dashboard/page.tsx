'use client';

import { dynamicConfig } from '@/lib/dynamic-config';

// Apply dynamic rendering configuration
export const { dynamic, revalidate } = dynamicConfig;

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  Clock, 
  UserPlus,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Heart,
  DollarSign,
  ArrowUp,
  ArrowDown,
  FileText,
  UserCheck,
  Shield,
  User,
  Pill,
  Thermometer,
  Microscope
} from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  queueLength: number;
  completedToday: number;
  revenue: number;
  newPatients: number;
  averageWaitTime: number;
  satisfactionRate: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    queueLength: 0,
    completedToday: 0,
    revenue: 0,
    newPatients: 0,
    averageWaitTime: 0,
    satisfactionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<'admin' | 'doctor' | 'patient'>('admin');
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole') as 'admin' | 'doctor' | 'patient';
    const name = localStorage.getItem('userName');
    
    if (!token) {
      router.push('/');
      return;
    }

    if (role) {
      setUserType(role);
    }
    if (name) {
      setUserName(name);
    }

    // Simulate loading dashboard data
    setTimeout(() => {
      if (role === 'admin') {
        setStats({
          totalPatients: 1247,
          todayAppointments: 24,
          queueLength: 8,
          completedToday: 16,
          revenue: 15420,
          newPatients: 12,
          averageWaitTime: 25,
          satisfactionRate: 94
        });
      } else if (role === 'doctor') {
        setStats({
          totalPatients: 156,
          todayAppointments: 8,
          queueLength: 3,
          completedToday: 5,
          revenue: 3200,
          newPatients: 2,
          averageWaitTime: 15,
          satisfactionRate: 96
        });
      } else {
        setStats({
          totalPatients: 1,
          todayAppointments: 1,
          queueLength: 0,
          completedToday: 0,
          revenue: 0,
          newPatients: 0,
          averageWaitTime: 0,
          satisfactionRate: 98
        });
      }
      setIsLoading(false);
    }, 1000);
  }, [router]);

  const getQuickActions = () => {
    switch (userType) {
      case 'admin':
        return [
          {
            title: 'Add Walk-in Patient',
            description: 'Register new patient to queue',
            icon: UserPlus,
            color: 'bg-blue-500',
            action: () => router.push('/queue')
          },
          {
            title: 'Book Appointment',
            description: 'Schedule patient appointment',
            icon: Calendar,
            color: 'bg-green-500',
            action: () => router.push('/appointments')
          },
          {
            title: 'Manage Queue',
            description: 'View and update patient queue',
            icon: Clock,
            color: 'bg-orange-500',
            action: () => router.push('/queue')
          },
          {
            title: 'Doctor Profiles',
            description: 'Manage doctor information',
            icon: Users,
            color: 'bg-purple-500',
            action: () => router.push('/doctors')
          }
        ];
      case 'doctor':
        return [
          {
            title: 'View My Patients',
            description: 'Check patient records and history',
            icon: Users,
            color: 'bg-blue-500',
            action: () => router.push('/patients')
          },
          {
            title: 'Today\'s Schedule',
            description: 'View today\'s appointments',
            icon: Calendar,
            color: 'bg-green-500',
            action: () => router.push('/appointments')
          },
          {
            title: 'Medical Records',
            description: 'Access patient medical files',
            icon: FileText,
            color: 'bg-purple-500',
            action: () => router.push('/records')
          },
          {
            title: 'Update Schedule',
            description: 'Manage availability and appointments',
            icon: Clock,
            color: 'bg-orange-500',
            action: () => router.push('/schedule')
          }
        ];
      case 'patient':
        return [
          {
            title: 'Book Appointment',
            description: 'Schedule a new appointment',
            icon: Calendar,
            color: 'bg-blue-500',
            action: () => router.push('/book')
          },
          {
            title: 'My Appointments',
            description: 'View upcoming appointments',
            icon: Clock,
            color: 'bg-green-500',
            action: () => router.push('/appointments')
          },
          {
            title: 'Medical History',
            description: 'View your medical records',
            icon: FileText,
            color: 'bg-purple-500',
            action: () => router.push('/history')
          },
          {
            title: 'Prescriptions',
            description: 'View your prescriptions',
            icon: Pill,
            color: 'bg-orange-500',
            action: () => router.push('/prescriptions')
          }
        ];
      default:
        return [];
    }
  };

  const getRecentActivity = () => {
    switch (userType) {
      case 'admin':
        return [
          { id: 1, type: 'appointment', message: 'Dr. Priya Sharma appointment booked for Amit Patel', time: '5 min ago', status: 'success' },
          { id: 2, type: 'queue', message: 'Patient #Q008 moved to consultation', time: '10 min ago', status: 'info' },
          { id: 3, type: 'complete', message: 'Appointment with Dr. Rajesh Kumar completed', time: '15 min ago', status: 'success' },
          { id: 4, type: 'cancel', message: 'Appointment cancelled by patient', time: '20 min ago', status: 'warning' }
        ];
      case 'doctor':
        return [
          { id: 1, type: 'appointment', message: 'New appointment with Amit Patel scheduled', time: '5 min ago', status: 'success' },
          { id: 2, type: 'patient', message: 'Updated medical records for Priya Singh', time: '10 min ago', status: 'info' },
          { id: 3, type: 'complete', message: 'Consultation with Rajesh Kumar completed', time: '15 min ago', status: 'success' },
          { id: 4, type: 'schedule', message: 'Schedule updated for tomorrow', time: '20 min ago', status: 'info' }
        ];
      case 'patient':
        return [
          { id: 1, type: 'appointment', message: 'Appointment with Dr. Priya Sharma confirmed', time: '5 min ago', status: 'success' },
          { id: 2, type: 'prescription', message: 'New prescription uploaded', time: '10 min ago', status: 'info' },
          { id: 3, type: 'test', message: 'Blood test results available', time: '15 min ago', status: 'success' },
          { id: 4, type: 'reminder', message: 'Appointment reminder for tomorrow', time: '20 min ago', status: 'warning' }
        ];
      default:
        return [];
    }
  };

  const getUserTitle = () => {
    switch (userType) {
      case 'admin':
        return 'System Overview';
      case 'doctor':
        return 'Doctor Dashboard';
      case 'patient':
        return 'Patient Portal';
      default:
        return 'Dashboard';
    }
  };

  const getUserDescription = () => {
    switch (userType) {
      case 'admin':
        return 'Welcome back! Here\'s what\'s happening at your clinic today.';
      case 'doctor':
        return 'Welcome back! Here\'s your patient schedule and medical updates.';
      case 'patient':
        return 'Welcome back! Here\'s your health information and upcoming appointments.';
      default:
        return 'Welcome back! Here\'s what\'s happening today.';
    }
  };

  const getUserIcon = () => {
    switch (userType) {
      case 'admin':
        return <Shield className="h-6 w-6" />;
      case 'doctor':
        return <UserCheck className="h-6 w-6" />;
      case 'patient':
        return <User className="h-6 w-6" />;
      default:
        return <Activity className="h-6 w-6" />;
    }
  };

  // Chart data
  const patientGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Patients',
        data: [65, 78, 90, 85, 95, 120],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const appointmentData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Appointments',
        data: [12, 19, 15, 25, 22, 18, 8],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
      },
    ],
  };

  const satisfactionData = {
    labels: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
    datasets: [
      {
        data: [45, 35, 15, 5],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
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

  const quickActions = getQuickActions();
  const recentActivity = getRecentActivity();

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
              <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl">
                {getUserIcon()}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">{getUserTitle()}</h1>
                <p className="text-xl text-gray-600 mt-2">{getUserDescription()}</p>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
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
                <CountUp end={stats.totalPatients} duration={2} />
              </div>
              <div className="flex items-center text-sm text-green-600 mt-3">
                <ArrowUp className="h-4 w-4 mr-2" />
                +12% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600">Today&apos;s Appointments</CardTitle>
              <div className="p-3 bg-green-100 rounded-xl">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <CountUp end={stats.todayAppointments} duration={2} />
              </div>
              <Progress value={67} className="mt-3" />
              <div className="text-sm text-gray-600 mt-2">67% completed</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600">Queue Length</CardTitle>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                <CountUp end={stats.queueLength} duration={2} />
              </div>
              <div className="text-sm text-orange-600 mt-2">
                Average wait: {stats.averageWaitTime} mins
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600">Revenue Today</CardTitle>
              <div className="p-3 bg-purple-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                $<CountUp end={stats.revenue} duration={2} />
              </div>
              <div className="text-sm text-green-600 mt-2">
                +8% from yesterday
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600">New Patients</CardTitle>
              <div className="p-3 bg-cyan-100 rounded-xl">
                <UserPlus className="h-6 w-6 text-cyan-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                <CountUp end={stats.newPatients} duration={2} />
              </div>
              <div className="text-sm text-cyan-600 mt-2">This week</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600">Completed Today</CardTitle>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                <CountUp end={stats.completedToday} duration={2} />
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Efficiency: {stats.satisfactionRate}%
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-medium text-gray-600">Satisfaction Rate</CardTitle>
              <div className="p-3 bg-pink-100 rounded-xl">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                <CountUp end={stats.satisfactionRate} duration={2} />%
              </div>
              <div className="text-sm text-pink-600 mt-2">Patient satisfaction</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6" />
                Patient Growth
              </CardTitle>
              <CardDescription>Monthly patient registration trend</CardDescription>
            </CardHeader>
            <CardContent>
              <Line data={patientGrowthData} options={chartOptions} height={200} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Calendar className="h-6 w-6" />
                Weekly Appointments
              </CardTitle>
              <CardDescription>Appointment distribution by day</CardDescription>
            </CardHeader>
            <CardContent>
              <Bar data={appointmentData} options={chartOptions} height={200} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Satisfaction Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Heart className="h-6 w-6" />
                Patient Satisfaction
              </CardTitle>
              <CardDescription>Overall patient feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <Doughnut data={satisfactionData} options={doughnutOptions} height={200} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Activity className="h-6 w-6" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates from your system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div 
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-3 rounded-xl ${
                      activity.status === 'success' ? 'bg-green-100 text-green-600' :
                      activity.status === 'warning' ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {activity.status === 'success' ? <CheckCircle className="h-5 w-5" /> :
                       activity.status === 'warning' ? <AlertCircle className="h-5 w-5" /> :
                       <Activity className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-200">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-5">
                    <div className={`p-4 rounded-2xl ${action.color} bg-opacity-10`}>
                      <action.icon className={`h-8 w-8 ${action.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    </div>
                  </div>
                  <Button
                    onClick={action.action}
                    className="w-full mt-6 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 border border-gray-200 hover:border-blue-200 transition-all duration-200"
                    variant="outline"
                  >
                    Open
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}