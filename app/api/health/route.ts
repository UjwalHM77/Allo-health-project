import { NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Generate dynamic health metrics
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay();
  
  // Dynamic metrics based on time of day
  const getTimeBasedMetrics = () => {
    if (currentHour >= 6 && currentHour < 12) {
      return {
        activePatients: Math.floor(Math.random() * 20) + 15,
        waitTime: Math.floor(Math.random() * 15) + 5,
        efficiency: Math.floor(Math.random() * 15) + 80
      };
    } else if (currentHour >= 12 && currentHour < 18) {
      return {
        activePatients: Math.floor(Math.random() * 25) + 20,
        waitTime: Math.floor(Math.random() * 20) + 10,
        efficiency: Math.floor(Math.random() * 20) + 75
      };
    } else {
      return {
        activePatients: Math.floor(Math.random() * 15) + 5,
        waitTime: Math.floor(Math.random() * 10) + 2,
        efficiency: Math.floor(Math.random() * 10) + 85
      };
    }
  };

  const timeMetrics = getTimeBasedMetrics();
  
  // Dynamic health data
  const healthData = {
    timestamp: now.toISOString(),
    metrics: {
      totalPatients: 1247,
      activePatients: timeMetrics.activePatients,
      totalDoctors: 6,
      availableDoctors: Math.floor(Math.random() * 3) + 4,
      totalAppointments: 89,
      completedToday: Math.floor(Math.random() * 15) + 25,
      pendingAppointments: Math.floor(Math.random() * 10) + 15,
      emergencyCases: Math.floor(Math.random() * 5) + 2,
      averageWaitTime: `${timeMetrics.waitTime} minutes`,
      systemEfficiency: `${timeMetrics.efficiency}%`,
      bedOccupancy: `${Math.floor(Math.random() * 20) + 70}%`,
      criticalAlerts: Math.floor(Math.random() * 3) + 1
    },
    trends: {
      patientGrowth: '+12.5%',
      appointmentIncrease: '+8.3%',
      efficiencyImprovement: '+5.2%',
      waitTimeReduction: '-15.7%'
    },
    alerts: [
      {
        id: 1,
        type: 'warning',
        message: 'High patient volume in Emergency Department',
        timestamp: new Date(now.getTime() - 30 * 60000).toISOString(),
        priority: 'medium'
      },
      {
        id: 2,
        type: 'info',
        message: 'Dr. Johnson completed 5 appointments ahead of schedule',
        timestamp: new Date(now.getTime() - 45 * 60000).toISOString(),
        priority: 'low'
      },
      {
        id: 3,
        type: 'success',
        message: 'Patient satisfaction score improved to 4.8/5.0',
        timestamp: new Date(now.getTime() - 60 * 60000).toISOString(),
        priority: 'low'
      }
    ],
    departments: {
      emergency: {
        status: 'busy',
        patients: Math.floor(Math.random() * 8) + 5,
        waitTime: '15-25 min'
      },
      cardiology: {
        status: 'moderate',
        patients: Math.floor(Math.random() * 6) + 3,
        waitTime: '10-20 min'
      },
      pediatrics: {
        status: 'normal',
        patients: Math.floor(Math.random() * 4) + 2,
        waitTime: '5-15 min'
      },
      orthopedics: {
        status: 'moderate',
        patients: Math.floor(Math.random() * 5) + 3,
        waitTime: '10-20 min'
      },
      general: {
        status: 'normal',
        patients: Math.floor(Math.random() * 6) + 4,
        waitTime: '5-15 min'
      }
    },
    recentActivity: [
      {
        id: 1,
        type: 'appointment',
        description: 'New appointment scheduled for John Smith',
        timestamp: new Date(now.getTime() - 5 * 60000).toISOString(),
        user: 'Dr. Johnson'
      },
      {
        id: 2,
        type: 'patient',
        description: 'Patient Maria Garcia checked in',
        timestamp: new Date(now.getTime() - 12 * 60000).toISOString(),
        user: 'Reception'
      },
      {
        id: 3,
        type: 'prescription',
        description: 'Prescription updated for Robert Wilson',
        timestamp: new Date(now.getTime() - 18 * 60000).toISOString(),
        user: 'Dr. Chen'
      },
      {
        id: 4,
        type: 'record',
        description: 'Medical record accessed for Lisa Thompson',
        timestamp: new Date(now.getTime() - 25 * 60000).toISOString(),
        user: 'Dr. Kim'
      }
    ],
    systemStatus: {
      database: 'healthy',
      api: 'healthy',
      frontend: 'healthy',
      notifications: 'healthy',
      lastCheck: now.toISOString()
    }
  };

  return NextResponse.json(healthData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Handle health check requests
    if (body.type === 'health_check') {
      return NextResponse.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '1.0.0'
      });
    }
    
    // Handle metric updates
    if (body.type === 'metric_update') {
      return NextResponse.json({
        message: 'Metrics updated successfully',
        timestamp: new Date().toISOString()
      });
    }
    
    return NextResponse.json({
      error: 'Invalid request type'
    }, { status: 400 });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to process health request'
    }, { status: 500 });
  }
}


