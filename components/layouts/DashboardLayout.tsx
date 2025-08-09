'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Clock, 
  UserCog,
  Menu,
  X,
  LogOut,
  Settings,
  Bell,
  Stethoscope,
  Shield,
  UserCheck,
  User,
  FileText,
  Activity,
  Heart
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const adminNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Queue Management', href: '/queue', icon: Clock },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Doctors', href: '/doctors', icon: Users },
  { name: 'Patients', href: '/patients', icon: UserCog },
];

const doctorNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Patients', href: '/patients', icon: Users },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Medical Records', href: '/records', icon: FileText },
  { name: 'Schedule', href: '/schedule', icon: Clock },
];

const patientNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Appointments', href: '/appointments', icon: Calendar },
  { name: 'Medical History', href: '/history', icon: FileText },
  { name: 'Book Appointment', href: '/book', icon: Calendar },
  { name: 'Prescriptions', href: '/prescriptions', icon: Activity },
];

const userInfo = {
  admin: { name: 'Dr. Rajesh Kumar', role: 'System Administrator', avatar: 'RK' },
  doctor: { name: 'Dr. Priya Sharma', role: 'Cardiologist', avatar: 'PS' },
  patient: { name: 'Amit Patel', role: 'Patient', avatar: 'AP' }
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({ name: 'Dr. Rajesh Kumar', role: 'System Administrator', avatar: 'RK' });
  const [userType, setUserType] = useState<'admin' | 'doctor' | 'patient'>('admin');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole') as 'admin' | 'doctor' | 'patient';
    const userName = localStorage.getItem('userName');
    
    if (!token) {
      router.push('/');
      return;
    }

    if (role && userName) {
      setUserType(role);
      setUser({
        name: userName,
        role: userInfo[role].role,
        avatar: userInfo[role].avatar
      });
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    router.push('/');
  };

  const getNavigation = () => {
    switch (userType) {
      case 'doctor':
        return doctorNavigation;
      case 'patient':
        return patientNavigation;
      default:
        return adminNavigation;
    }
  };

  const getUserIcon = () => {
    switch (userType) {
      case 'admin':
        return <Shield className="w-5 h-5 text-white" />;
      case 'doctor':
        return <UserCheck className="w-5 h-5 text-white" />;
      case 'patient':
        return <User className="w-5 h-5 text-white" />;
      default:
        return <User className="w-5 h-5 text-white" />;
    }
  };

  const getUserColor = () => {
    switch (userType) {
      case 'admin':
        return 'from-purple-600 to-pink-600';
      case 'doctor':
        return 'from-blue-600 to-cyan-600';
      case 'patient':
        return 'from-green-600 to-emerald-600';
      default:
        return 'from-blue-600 to-cyan-600';
    }
  };

  const navigation = getNavigation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      <div className={cn(
        "fixed inset-0 z-40 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full text-white hover:bg-gray-600"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1" />
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-500">
                <Settings className="h-5 w-5" />
              </Button>
              <div className="relative">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-r ${getUserColor()} flex items-center justify-center`}>
                      {getUserIcon()}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.role}</div>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
              {children}
            </div>
          </div>
        </main>
      </div>
      
      <Toaster />
    </div>
  );

  function SidebarContent() {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex items-center h-20 flex-shrink-0 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Allo Health
              </h1>
              <p className="text-xs text-gray-500 capitalize">{userType} Portal</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-r-2 border-blue-500 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-4 flex-shrink-0 h-5 w-5',
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-6">
          <div className="flex items-center w-full">
            <div className="flex-shrink-0">
              <div className={`h-12 w-12 rounded-full bg-gradient-to-r ${getUserColor()} flex items-center justify-center`}>
                {getUserIcon()}
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}