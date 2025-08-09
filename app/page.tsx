'use client';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-6">Allo Health</h1>
        <p className="text-2xl text-gray-600 mb-8">Healthcare Management System</p>
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Welcome Back</h2>
          <p className="text-gray-600 mb-6">Sign in to access your dashboard</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                placeholder="admin@allohealth.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
                    </div>
                    <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">
              Sign In
            </button>
          </div>
          <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-4 rounded-lg">
            <p className="font-medium mb-2">Demo Credentials:</p>
            <p>Admin: admin@allohealth.com / admin123</p>
            <p>Doctor: doctor@allohealth.com / doctor123</p>
            <p>Patient: patient@allohealth.com / patient123</p>
          </div>
        </div>
      </div>
    </div>
  );
}