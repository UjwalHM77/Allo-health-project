'use client';

import { useRouter } from 'next/navigation';
import { Shield, UserCheck, User as UserIcon } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const handleLogin = (role: 'admin' | 'doctor' | 'patient') => {
    const roleToName: Record<'admin' | 'doctor' | 'patient', string> = {
      admin: 'Dr. Rajesh Kumar',
      doctor: 'Dr. Priya Sharma',
      patient: 'Amit Patel',
    };

    // Persist auth in localStorage for client-side checks
    localStorage.setItem('authToken', 'demo-token');
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', roleToName[role]);

    // Also set a cookie so middleware allows protected routes
    const oneWeekSeconds = 60 * 60 * 24 * 7;
    document.cookie = `authToken=demo-token; path=/; max-age=${oneWeekSeconds}`;

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-3">Allo Health</h1>
          <p className="text-lg md:text-2xl text-gray-600">Healthcare Management System</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => handleLogin('admin')}
            className="group bg-white rounded-3xl shadow-2xl p-8 border border-purple-100 hover:border-purple-300 transition-all text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white mb-5">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Admin Login</h2>
            <p className="text-gray-600 mb-6">Manage doctors, patients, queue, and system settings.</p>
            <span className="inline-flex items-center text-purple-700 font-medium group-hover:underline">Continue as Admin</span>
          </button>

          <button
            onClick={() => handleLogin('doctor')}
            className="group bg-white rounded-3xl shadow-2xl p-8 border border-blue-100 hover:border-blue-300 transition-all text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white mb-5">
              <UserCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Doctor Login</h2>
            <p className="text-gray-600 mb-6">View schedule, patients, medical records, and prescriptions.</p>
            <span className="inline-flex items-center text-blue-700 font-medium group-hover:underline">Continue as Doctor</span>
          </button>

          <button
            onClick={() => handleLogin('patient')}
            className="group bg-white rounded-3xl shadow-2xl p-8 border border-emerald-100 hover:border-emerald-300 transition-all text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center text-white mb-5">
              <UserIcon className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Patient Login</h2>
            <p className="text-gray-600 mb-6">Book appointments, view history, and manage your care.</p>
            <span className="inline-flex items-center text-emerald-700 font-medium group-hover:underline">Continue as Patient</span>
          </button>
        </div>

        <div className="mt-10 text-xs text-gray-500 bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-gray-100">
          <p className="font-medium mb-2">Demo Accounts (auto-filled when you choose a role):</p>
          <p>Admin: admin@allohealth.com / admin123</p>
          <p>Doctor: doctor@allohealth.com / doctor123</p>
          <p>Patient: patient@allohealth.com / patient123</p>
        </div>
      </div>
    </div>
  );
}