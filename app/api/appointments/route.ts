import { NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Mock data for dynamic appointments
let mockAppointments = [
  {
    id: '1',
    date: new Date('2024-01-20T09:00:00'),
    duration: 30,
    status: 'SCHEDULED',
    type: 'CONSULTATION',
    symptoms: 'Fever, headache, fatigue',
    notes: 'Patient reports feeling unwell for 3 days',
    doctorId: '1',
    patientId: '1',
    doctor: { id: '1', name: 'Dr. Sarah Johnson', specialization: 'General Medicine' },
    patient: { id: '1', name: 'John Smith', age: 35, gender: 'male' },
    createdAt: new Date('2024-01-15T10:00:00'),
    updatedAt: new Date('2024-01-15T10:00:00')
  },
  {
    id: '2',
    date: new Date('2024-01-20T10:30:00'),
    duration: 45,
    status: 'CONFIRMED',
    type: 'FOLLOW_UP',
    symptoms: 'Follow-up for diabetes management',
    notes: 'Regular check-up, blood sugar monitoring',
    doctorId: '2',
    patientId: '2',
    doctor: { id: '2', name: 'Dr. Michael Chen', specialization: 'Endocrinology' },
    patient: { id: '2', name: 'Maria Garcia', age: 52, gender: 'female' },
    createdAt: new Date('2024-01-14T14:00:00'),
    updatedAt: new Date('2024-01-16T09:00:00')
  },
  {
    id: '3',
    date: new Date('2024-01-20T11:00:00'),
    duration: 60,
    status: 'IN_PROGRESS',
    type: 'EMERGENCY',
    symptoms: 'Chest pain, shortness of breath',
    notes: 'Emergency consultation, ECG required',
    doctorId: '3',
    patientId: '3',
    doctor: { id: '3', name: 'Dr. Emily Rodriguez', specialization: 'Cardiology' },
    patient: { id: '3', name: 'Robert Wilson', age: 68, gender: 'male' },
    createdAt: new Date('2024-01-20T10:45:00'),
    updatedAt: new Date('2024-01-20T10:45:00')
  },
  {
    id: '4',
    date: new Date('2024-01-20T14:00:00'),
    duration: 30,
    status: 'COMPLETED',
    type: 'ROUTINE',
    symptoms: 'Annual physical examination',
    notes: 'All vitals normal, patient healthy',
    doctorId: '1',
    patientId: '4',
    doctor: { id: '1', name: 'Dr. Sarah Johnson', specialization: 'General Medicine' },
    patient: { id: '4', name: 'Lisa Thompson', age: 28, gender: 'female' },
    createdAt: new Date('2024-01-10T16:00:00'),
    updatedAt: new Date('2024-01-20T14:30:00')
  },
  {
    id: '5',
    date: new Date('2024-01-21T09:00:00'),
    duration: 45,
    status: 'SCHEDULED',
    type: 'CONSULTATION',
    symptoms: 'Back pain, difficulty walking',
    notes: 'Patient needs orthopedic consultation',
    doctorId: '4',
    patientId: '5',
    doctor: { id: '4', name: 'Dr. David Kim', specialization: 'Orthopedics' },
    patient: { id: '5', name: 'James Brown', age: 45, gender: 'male' },
    createdAt: new Date('2024-01-16T11:00:00'),
    updatedAt: new Date('2024-01-16T11:00:00')
  },
  {
    id: '6',
    date: new Date('2024-01-21T10:00:00'),
    duration: 30,
    status: 'SCHEDULED',
    type: 'FOLLOW_UP',
    symptoms: 'Post-surgery recovery check',
    notes: 'Appendectomy follow-up, wound healing well',
    doctorId: '5',
    patientId: '6',
    doctor: { id: '5', name: 'Dr. Amanda Lee', specialization: 'Surgery' },
    patient: { id: '6', name: 'Jennifer Davis', age: 31, gender: 'female' },
    createdAt: new Date('2024-01-12T15:00:00'),
    updatedAt: new Date('2024-01-12T15:00:00')
  }
];

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Return appointments sorted by date
  const sortedAppointments = mockAppointments.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return NextResponse.json(sortedAppointments);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.patientId || !body.doctorId || !body.date || !body.time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new appointment
    const newAppointment = {
      id: (mockAppointments.length + 1).toString(),
      date: new Date(`${body.date}T${body.time}`),
      duration: body.duration || 30,
      status: 'SCHEDULED',
      type: body.type?.toUpperCase() || 'CONSULTATION',
      symptoms: body.symptoms || null,
      notes: body.notes || null,
      doctorId: body.doctorId,
      patientId: body.patientId,
      doctor: { id: body.doctorId, name: body.doctorName || 'Unknown Doctor', specialization: 'General Medicine' },
      patient: { id: body.patientId, name: body.patientName || 'Unknown Patient', age: null, gender: null },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockAppointments.push(newAppointment);
    
    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create appointment' },
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
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const appointmentIndex = mockAppointments.findIndex(apt => apt.id === id);
    if (appointmentIndex === -1) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Update appointment
    mockAppointments[appointmentIndex] = {
      ...mockAppointments[appointmentIndex],
      ...updateData,
      updatedAt: new Date()
    };

    return NextResponse.json(mockAppointments[appointmentIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update appointment' },
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
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    const appointmentIndex = mockAppointments.findIndex(apt => apt.id === id);
    if (appointmentIndex === -1) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Remove appointment
    const deletedAppointment = mockAppointments.splice(appointmentIndex, 1)[0];
    
    return NextResponse.json({ message: 'Appointment deleted successfully', appointment: deletedAppointment });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}


