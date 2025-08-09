import { NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Mock data for dynamic doctors
let mockDoctors = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@allohealth.com',
    phone: '+1 (555) 123-4567',
    specialization: 'General Medicine',
    experience: 8,
    education: 'MD - Harvard Medical School',
    status: 'ACTIVE',
    avatar: '/api/avatars/doctor-1.jpg',
    schedule: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' }
    },
    rating: 4.8,
    patientsCount: 1247,
    createdAt: new Date('2020-03-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@allohealth.com',
    phone: '+1 (555) 234-5678',
    specialization: 'Endocrinology',
    experience: 12,
    education: 'MD - Stanford Medical School',
    status: 'ACTIVE',
    avatar: '/api/avatars/doctor-2.jpg',
    schedule: {
      monday: { start: '08:00', end: '16:00' },
      tuesday: { start: '08:00', end: '16:00' },
      wednesday: { start: '08:00', end: '16:00' },
      thursday: { start: '08:00', end: '16:00' },
      friday: { start: '08:00', end: '16:00' }
    },
    rating: 4.9,
    patientsCount: 892,
    createdAt: new Date('2018-07-22'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@allohealth.com',
    phone: '+1 (555) 345-6789',
    specialization: 'Cardiology',
    experience: 15,
    education: 'MD - Johns Hopkins University',
    status: 'ACTIVE',
    avatar: '/api/avatars/doctor-3.jpg',
    schedule: {
      monday: { start: '07:00', end: '19:00' },
      tuesday: { start: '07:00', end: '19:00' },
      wednesday: { start: '07:00', end: '19:00' },
      thursday: { start: '07:00', end: '19:00' },
      friday: { start: '07:00', end: '19:00' }
    },
    rating: 4.7,
    patientsCount: 1563,
    createdAt: new Date('2016-11-08'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '4',
    name: 'Dr. David Kim',
    email: 'david.kim@allohealth.com',
    phone: '+1 (555) 456-7890',
    specialization: 'Orthopedics',
    experience: 10,
    education: 'MD - UCLA Medical School',
    status: 'ACTIVE',
    avatar: '/api/avatars/doctor-4.jpg',
    schedule: {
      monday: { start: '10:00', end: '18:00' },
      tuesday: { start: '10:00', end: '18:00' },
      wednesday: { start: '10:00', end: '18:00' },
      thursday: { start: '10:00', end: '18:00' },
      friday: { start: '10:00', end: '18:00' }
    },
    rating: 4.6,
    patientsCount: 1034,
    createdAt: new Date('2019-01-20'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '5',
    name: 'Dr. Amanda Lee',
    email: 'amanda.lee@allohealth.com',
    phone: '+1 (555) 567-8901',
    specialization: 'Surgery',
    experience: 18,
    education: 'MD - Yale Medical School',
    status: 'ACTIVE',
    avatar: '/api/avatars/doctor-5.jpg',
    schedule: {
      monday: { start: '06:00', end: '18:00' },
      tuesday: { start: '06:00', end: '18:00' },
      wednesday: { start: '06:00', end: '18:00' },
      thursday: { start: '06:00', end: '18:00' },
      friday: { start: '06:00', end: '18:00' }
    },
    rating: 4.9,
    patientsCount: 2134,
    createdAt: new Date('2015-05-12'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '6',
    name: 'Dr. Robert Taylor',
    email: 'robert.taylor@allohealth.com',
    phone: '+1 (555) 678-9012',
    specialization: 'Pediatrics',
    experience: 6,
    education: 'MD - University of Michigan',
    status: 'ACTIVE',
    avatar: '/api/avatars/doctor-6.jpg',
    schedule: {
      monday: { start: '08:30', end: '16:30' },
      tuesday: { start: '08:30', end: '16:30' },
      wednesday: { start: '08:30', end: '16:30' },
      thursday: { start: '08:30', end: '16:30' },
      friday: { start: '08:30', end: '16:30' }
    },
    rating: 4.8,
    patientsCount: 756,
    createdAt: new Date('2021-09-03'),
    updatedAt: new Date('2024-01-16')
  }
];

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Return doctors sorted by name
  const sortedDoctors = mockDoctors.sort((a, b) => a.name.localeCompare(b.name));
  
  return NextResponse.json(sortedDoctors);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.specialization) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, specialization' },
        { status: 400 }
      );
    }

    // Check if email already exists
    if (mockDoctors.find(doc => doc.email === body.email)) {
      return NextResponse.json(
        { error: 'Doctor with this email already exists' },
        { status: 409 }
      );
    }

    // Create new doctor
    const newDoctor = {
      id: (mockDoctors.length + 1).toString(),
      name: body.name,
      email: body.email,
      phone: body.phone || '+1 (555) 000-0000',
      specialization: body.specialization,
      experience: body.experience || 0,
      education: body.education || 'MD - Medical School',
      status: 'ACTIVE',
      avatar: body.avatar || '/api/avatars/default-doctor.jpg',
      schedule: body.schedule || {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' }
      },
      rating: 0,
      patientsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockDoctors.push(newDoctor);
    
    return NextResponse.json(newDoctor, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create doctor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Doctor ID is required' },
        { status: 400 }
      );
    }

    const doctorIndex = mockDoctors.findIndex(doc => doc.id === id);
    if (doctorIndex === -1) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Update doctor
    mockDoctors[doctorIndex] = {
      ...mockDoctors[doctorIndex],
      ...updateData,
      updatedAt: new Date()
    };

    return NextResponse.json(mockDoctors[doctorIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update doctor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Doctor ID is required' },
        { status: 400 }
      );
    }

    const doctorIndex = mockDoctors.findIndex(doc => doc.id === id);
    if (doctorIndex === -1) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Remove doctor
    const deletedDoctor = mockDoctors.splice(doctorIndex, 1)[0];
    
    return NextResponse.json({ message: 'Doctor deleted successfully', doctor: deletedDoctor });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete doctor' },
      { status: 500 }
    );
  }
}


