'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Stethoscope, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="max-w-xl w-full shadow-sm">
        <CardContent className="p-10 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Page not found</h1>
            <p className="text-gray-600 mt-2">The page you are looking for doesn’t exist or may have been moved.</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600">
                <Home className="mr-2 h-4 w-4" /> Go to Dashboard
              </Button>
            </Link>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


