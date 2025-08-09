import { NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Mock data for dynamic patients
let mockPatients = [
  {
    id: '1',
    name: 'John Smith',
    age: 35,
    gender: 'male',
    phone: '+1 (555) 111-2222',
    email: 'john.smith@email.com',
    address: '123 Main St, New York, NY 10001',
    bloodType: 'O+',
    status: 'active',
    emergencyContact: {
      name: 'Jane Smith',
      relationship: 'Spouse',
      phone: '+1 (555) 111-3333'
    },
    medicalHistory: [
      'Hypertension (2020)',
      'Diabetes Type 2 (2021)',
      'Appendectomy (2018)'
    ],
    allergies: ['Penicillin', 'Shellfish'],
    insurance: 'Blue Cross Blue Shield',
    lastVisit: new Date('2024-01-15'),
    nextAppointment: new Date('2024-01-25'),
    createdAt: new Date('2020-06-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Maria Garcia',
    age: 52,
    gender: 'female',
    phone: '+1 (555) 222-3333',
    email: 'maria.garcia@email.com',
    address: '456 Oak Ave, Los Angeles, CA 90210',
    bloodType: 'A-',
    status: 'active',
    emergencyContact: {
      name: 'Carlos Garcia',
      relationship: 'Husband',
      phone: '+1 (555) 222-4444'
    },
    medicalHistory: [
      'Gestational Diabetes (2010)',
      'Hypothyroidism (2015)',
      'Cataract Surgery (2022)'
    ],
    allergies: ['Sulfa drugs'],
    insurance: 'Kaiser Permanente',
    lastVisit: new Date('2024-01-10'),
    nextAppointment: new Date('2024-01-30'),
    createdAt: new Date('2018-03-22'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    name: 'Robert Wilson',
    age: 68,
    gender: 'male',
    phone: '+1 (555) 333-4444',
    email: 'robert.wilson@email.com',
    address: '789 Pine St, Chicago, IL 60601',
    bloodType: 'B+',
    status: 'active',
    emergencyContact: {
      name: 'Susan Wilson',
      relationship: 'Daughter',
      phone: '+1 (555) 333-5555'
    },
    medicalHistory: [
      'Heart Attack (2020)',
      'Coronary Bypass (2020)',
      'High Cholesterol (2018)',
      'Prostate Cancer (2022)'
    ],
    allergies: ['Aspirin', 'Latex'],
    insurance: 'Medicare + Aetna',
    lastVisit: new Date('2024-01-20'),
    nextAppointment: new Date('2024-02-05'),
    createdAt: new Date('2016-11-08'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '4',
    name: 'Lisa Thompson',
    age: 28,
    gender: 'female',
    phone: '+1 (555) 444-5555',
    email: 'lisa.thompson@email.com',
    address: '321 Elm St, Miami, FL 33101',
    bloodType: 'AB+',
    status: 'active',
    emergencyContact: {
      name: 'Mike Thompson',
      relationship: 'Brother',
      phone: '+1 (555) 444-6666'
    },
    medicalHistory: [
      'Tonsillectomy (2010)',
      'Broken Arm (2015)',
      'Pregnancy (2023)'
    ],
    allergies: ['None known'],
    insurance: 'UnitedHealth Group',
    lastVisit: new Date('2024-01-20'),
    nextAppointment: null,
    createdAt: new Date('2021-07-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '5',
    name: 'James Brown',
    age: 45,
    gender: 'male',
    phone: '+1 (555) 555-6666',
    email: 'james.brown@email.com',
    address: '654 Maple Dr, Seattle, WA 98101',
    bloodType: 'O-',
    status: 'active',
    emergencyContact: {
      name: 'Sarah Brown',
      relationship: 'Wife',
      phone: '+1 (555) 555-7777'
    },
    medicalHistory: [
      'Sports Injury - ACL (2019)',
      'Concussion (2021)',
      'Back Pain (2023)'
    ],
    allergies: ['Ibuprofen'],
    insurance: 'Premera Blue Cross',
    lastVisit: new Date('2024-01-16'),
    nextAppointment: new Date('2024-01-21'),
    createdAt: new Date('2019-01-20'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '6',
    name: 'Jennifer Davis',
    age: 31,
    gender: 'female',
    phone: '+1 (555) 666-7777',
    email: 'jennifer.davis@email.com',
    address: '987 Cedar Ln, Austin, TX 73301',
    bloodType: 'A+',
    status: 'active',
    emergencyContact: {
      name: 'David Davis',
      relationship: 'Father',
      phone: '+1 (555) 666-8888'
    },
    medicalHistory: [
      'Appendectomy (2024)',
      'Wisdom Teeth Removal (2018)',
      'Migraines (2020)'
    ],
    allergies: ['Codeine'],
    insurance: 'Cigna',
    lastVisit: new Date('2024-01-12'),
    nextAppointment: new Date('2024-01-21'),
    createdAt: new Date('2020-09-03'),
    updatedAt: new Date('2024-01-12')
  }
];

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Return patients sorted by name
  const sortedPatients = mockPatients.sort((a, b) => a.name.localeCompare(b.name));
  
  return NextResponse.json(sortedPatients);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.age || !body.gender) {
      return NextResponse.json(
        { error: 'Missing required fields: name, age, gender' },
        { status: 400 }
      );
    }

    // Check if email already exists (if provided)
    if (body.email && mockPatients.find(pat => pat.email === body.email)) {
      return NextResponse.json(
        { error: 'Patient with this email already exists' },
        { status: 409 }
      );
    }

    // Create new patient
    const newPatient = {
      id: (mockPatients.length + 1).toString(),
      name: body.name,
      age: body.age,
      gender: body.gender,
      phone: body.phone || '+1 (555) 000-0000',
      email: body.email || null,
      address: body.address || 'Address not provided',
      bloodType: body.bloodType || 'Unknown',
      status: 'active',
      emergencyContact: body.emergencyContact || {
        name: 'Emergency Contact',
        relationship: 'Unknown',
        phone: '+1 (555) 000-0000'
      },
      medicalHistory: body.medicalHistory || [],
      allergies: body.allergies || [],
      insurance: body.insurance || 'No insurance',
      lastVisit: null,
      nextAppointment: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockPatients.push(newPatient);
    
    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create patient' },
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
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const patientIndex = mockPatients.findIndex(pat => pat.id === id);
    if (patientIndex === -1) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // Update patient
    mockPatients[patientIndex] = {
      ...mockPatients[patientIndex],
      ...updateData,
      updatedAt: new Date()
    };

    return NextResponse.json(mockPatients[patientIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update patient' },
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
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const patientIndex = mockPatients.findIndex(pat => pat.id === id);
    if (patientIndex === -1) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // Remove patient
    const deletedPatient = mockPatients.splice(patientIndex, 1)[0];
    
    return NextResponse.json({ message: 'Patient deleted successfully', patient: deletedPatient });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete patient' },
      { status: 500 }
    );
  }
}


