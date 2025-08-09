'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  UserPlus, 
  Search, 
  Filter,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Edit,
  Trash2,
  Stethoscope
} from 'lucide-react';
import { dynamicConfig } from '@/lib/dynamic-config';

// Apply dynamic rendering configuration
export const { dynamic, revalidate } = dynamicConfig;

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
  location: string;
  experience: number;
  availability: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  consultationFee: number;
  status: 'active' | 'inactive';
  totalPatients: number;
  rating: number;
}

const specializationList = [
  'General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics', 'Dermatology',
  'Neurology', 'Psychiatry', 'Gynecology', 'Ophthalmology', 'ENT'
];

const locationList = [
  'Building A - Floor 1', 'Building A - Floor 2', 'Building B - Floor 1', 
  'Building B - Floor 2', 'Emergency Wing', 'Surgery Wing'
];

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialization: '',
    gender: 'male' as 'male' | 'female',
    phone: '',
    email: '',
    location: '',
    experience: 0,
    availableDays: [] as string[],
    startTime: '',
    endTime: '',
    consultationFee: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/doctors');
      if (response.ok) {
        const doctorsData = await response.json();
        // Transform API data to match component interface
        const transformedDoctors = doctorsData.map((doc: any) => ({
          id: doc.id,
          name: doc.name,
          specialization: doc.specialization,
          gender: doc.gender || 'male',
          phone: doc.phone,
          email: doc.email,
          location: doc.location || 'Main Building',
          experience: doc.experience,
          availability: {
            days: Object.keys(doc.schedule || {}),
            startTime: doc.schedule?.monday?.start || '09:00',
            endTime: doc.schedule?.monday?.end || '17:00'
          },
          consultationFee: doc.consultationFee || 100,
          status: doc.status === 'ACTIVE' ? 'active' : 'inactive',
          totalPatients: doc.patientsCount,
          rating: doc.rating
        }));
        setDoctors(transformedDoctors);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch doctors",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
          totalPatients: 245,
          rating: 4.8
        },
        {
          id: '2',
          name: 'Dr. Michael Brown',
          specialization: 'Cardiology',
          gender: 'male',
          phone: '+1 (555) 234-5678',
          email: 'michael.brown@medflow.com',
          location: 'Building B - Floor 2',
          experience: 12,
          availability: {
            days: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
            startTime: '08:00',
            endTime: '16:00'
          },
          consultationFee: 150,
          status: 'active',
          totalPatients: 198,
          rating: 4.9
        },
        {
          id: '3',
          name: 'Dr. Emily Davis',
          specialization: 'Pediatrics',
          gender: 'female',
          phone: '+1 (555) 345-6789',
          email: 'emily.davis@medflow.com',
          location: 'Building A - Floor 2',
          experience: 6,
          availability: {
            days: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
            startTime: '10:00',
            endTime: '18:00'
          },
          consultationFee: 120,
          status: 'active',
          totalPatients: 167,
          rating: 4.7
        },
        {
          id: '4',
          name: 'Dr. James Wilson',
          specialization: 'Orthopedics',
          gender: 'male',
          phone: '+1 (555) 456-7890',
          email: 'james.wilson@medflow.com',
          location: 'Surgery Wing',
          experience: 15,
          availability: {
            days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
            startTime: '07:00',
            endTime: '15:00'
          },
          consultationFee: 180,
          status: 'active',
          totalPatients: 312,
          rating: 4.9
        },
        {
          id: '5',
          name: 'Dr. Lisa Anderson',
          specialization: 'Dermatology',
          gender: 'female',
          phone: '+1 (555) 567-8901',
          email: 'lisa.anderson@medflow.com',
          location: 'Building B - Floor 1',
          experience: 10,
          availability: {
            days: ['Monday', 'Wednesday', 'Friday'],
            startTime: '09:00',
            endTime: '17:00'
          },
          consultationFee: 130,
          status: 'inactive',
          totalPatients: 89,
          rating: 4.6
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const addDoctor = () => {
    if (!newDoctor.name || !newDoctor.specialization || !newDoctor.phone || !newDoctor.email || !newDoctor.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const doctor: Doctor = {
      id: Date.now().toString(),
      name: newDoctor.name,
      specialization: newDoctor.specialization,
      gender: newDoctor.gender,
      phone: newDoctor.phone,
      email: newDoctor.email,
      location: newDoctor.location,
      experience: newDoctor.experience,
      availability: {
        days: newDoctor.availableDays,
        startTime: newDoctor.startTime,
        endTime: newDoctor.endTime
      },
      consultationFee: newDoctor.consultationFee,
      status: 'active',
      totalPatients: 0,
      rating: 5.0
    };

    setDoctors(prev => [...prev, doctor]);
    setNewDoctor({
      name: '',
      specialization: '',
      gender: 'male',
      phone: '',
      email: '',
      location: '',
      experience: 0,
      availableDays: [],
      startTime: '',
      endTime: '',
      consultationFee: 0
    });
    setIsAddingDoctor(false);
    
    toast({
      title: "Doctor Added",
      description: `${doctor.name} has been added to the system`,
    });
  };

  const toggleDoctorStatus = (doctorId: string) => {
    setDoctors(prev =>
      prev.map(doctor =>
        doctor.id === doctorId
          ? { ...doctor, status: doctor.status === 'active' ? 'inactive' : 'active' }
          : doctor
      )
    );

    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      toast({
        title: "Status Updated",
        description: `${doctor.name} is now ${doctor.status === 'active' ? 'inactive' : 'active'}`,
      });
    }
  };

  const deleteDoctor = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      setDoctors(prev => prev.filter(d => d.id !== doctorId));
      toast({
        title: "Doctor Removed",
        description: `${doctor.name} has been removed from the system`,
      });
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = specializationFilter === 'all' || doctor.specialization === specializationFilter;
    const matchesStatus = statusFilter === 'all' || doctor.status === statusFilter;
    return matchesSearch && matchesSpecialization && matchesStatus;
  });

  const activeDoctors = doctors.filter(d => d.status === 'active').length;
  const totalSpecializations = [...new Set(doctors.map(d => d.specialization))].length;
  const averageRating = doctors.reduce((acc, d) => acc + d.rating, 0) / doctors.length;

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
            <p className="text-gray-600 mt-2">Manage doctor profiles and availability</p>
          </div>
          <Dialog open={isAddingDoctor} onOpenChange={setIsAddingDoctor}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Doctor</DialogTitle>
                <DialogDescription>
                  Add a new doctor to the clinic system
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newDoctor.name}
                      onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                      placeholder="Dr. John Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization *</Label>
                    <Select value={newDoctor.specialization} onValueChange={(value) => setNewDoctor({ ...newDoctor, specialization: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializationList.map((spec) => (
                          <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={newDoctor.gender} onValueChange={(value: 'male' | 'female') => setNewDoctor({ ...newDoctor, gender: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (Years)</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={newDoctor.experience}
                      onChange={(e) => setNewDoctor({ ...newDoctor, experience: parseInt(e.target.value) || 0 })}
                      placeholder="5"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={newDoctor.phone}
                      onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newDoctor.email}
                      onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                      placeholder="doctor@medflow.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select value={newDoctor.location} onValueChange={(value) => setNewDoctor({ ...newDoctor, location: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationList.map((location) => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newDoctor.startTime}
                      onChange={(e) => setNewDoctor({ ...newDoctor, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newDoctor.endTime}
                      onChange={(e) => setNewDoctor({ ...newDoctor, endTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fee">Consultation Fee ($)</Label>
                  <Input
                    id="fee"
                    type="number"
                    value={newDoctor.consultationFee}
                    onChange={(e) => setNewDoctor({ ...newDoctor, consultationFee: parseInt(e.target.value) || 0 })}
                    placeholder="100"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingDoctor(false)}>
                  Cancel
                </Button>
                <Button onClick={addDoctor}>Add Doctor</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Doctors</CardTitle>
              <User className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{activeDoctors}</div>
              <p className="text-sm text-gray-600 mt-1">Currently available</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Specializations</CardTitle>
              <Stethoscope className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{totalSpecializations}</div>
              <p className="text-sm text-gray-600 mt-1">Medical fields covered</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
              <Calendar className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{averageRating.toFixed(1)}</div>
              <p className="text-sm text-gray-600 mt-1">Patient satisfaction</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by doctor name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specializations</SelectItem>
                      {specializationList.map((spec) => (
                        <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{doctor.name}</CardTitle>
                      <CardDescription>{doctor.specialization}</CardDescription>
                    </div>
                  </div>
                  <Badge className={doctor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {doctor.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{doctor.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{doctor.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{doctor.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{doctor.availability.days.join(', ')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Experience: {doctor.experience} years</span>
                  <span className="text-gray-600">Rating: {doctor.rating}/5</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Patients: {doctor.totalPatients}</span>
                  <span className="font-semibold text-green-600">${doctor.consultationFee}</span>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleDoctorStatus(doctor.id)}
                    className={doctor.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                  >
                    {doctor.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => deleteDoctor(doctor.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No doctors found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}