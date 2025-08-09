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
  Heart,
  Activity,
  FileText
} from 'lucide-react';
import { dynamicConfig } from '@/lib/dynamic-config';

// Apply dynamic rendering configuration
export const { dynamic, revalidate } = dynamicConfig;

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  address: string;
  bloodType: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: string[];
  allergies: string[];
  lastVisit: Date;
  nextAppointment?: Date;
  status: 'active' | 'inactive';
  totalVisits: number;
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genderOptions = ['male', 'female', 'other'];

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: 0,
    gender: 'male' as 'male' | 'female' | 'other',
    phone: '',
    email: '',
    address: '',
    bloodType: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    medicalHistory: '',
    allergies: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading patients data
    setTimeout(() => {
      setPatients([
        {
          id: '1',
          name: 'John Doe',
          age: 35,
          gender: 'male',
          phone: '+1 (555) 123-4567',
          email: 'john.doe@email.com',
          address: '123 Main St, City, State 12345',
          bloodType: 'A+',
          emergencyContact: {
            name: 'Jane Doe',
            phone: '+1 (555) 234-5678',
            relationship: 'Spouse'
          },
          medicalHistory: ['Hypertension', 'Diabetes Type 2'],
          allergies: ['Penicillin', 'Peanuts'],
          lastVisit: new Date(2024, 0, 10),
          nextAppointment: new Date(2024, 0, 20),
          status: 'active',
          totalVisits: 12
        },
        {
          id: '2',
          name: 'Sarah Wilson',
          age: 28,
          gender: 'female',
          phone: '+1 (555) 345-6789',
          email: 'sarah.wilson@email.com',
          address: '456 Oak Ave, City, State 12345',
          bloodType: 'O+',
          emergencyContact: {
            name: 'Mike Wilson',
            phone: '+1 (555) 456-7890',
            relationship: 'Husband'
          },
          medicalHistory: ['Asthma'],
          allergies: ['Dust', 'Pollen'],
          lastVisit: new Date(2024, 0, 8),
          status: 'active',
          totalVisits: 8
        },
        {
          id: '3',
          name: 'Michael Brown',
          age: 45,
          gender: 'male',
          phone: '+1 (555) 567-8901',
          email: 'michael.brown@email.com',
          address: '789 Pine Rd, City, State 12345',
          bloodType: 'B+',
          emergencyContact: {
            name: 'Lisa Brown',
            phone: '+1 (555) 678-9012',
            relationship: 'Wife'
          },
          medicalHistory: ['Heart Disease', 'High Cholesterol'],
          allergies: ['Shellfish'],
          lastVisit: new Date(2024, 0, 5),
          nextAppointment: new Date(2024, 0, 25),
          status: 'active',
          totalVisits: 15
        },
        {
          id: '4',
          name: 'Emily Davis',
          age: 22,
          gender: 'female',
          phone: '+1 (555) 789-0123',
          email: 'emily.davis@email.com',
          address: '321 Elm St, City, State 12345',
          bloodType: 'AB+',
          emergencyContact: {
            name: 'Robert Davis',
            phone: '+1 (555) 890-1234',
            relationship: 'Father'
          },
          medicalHistory: [],
          allergies: ['Latex'],
          lastVisit: new Date(2024, 0, 12),
          status: 'inactive',
          totalVisits: 3
        },
        {
          id: '5',
          name: 'David Johnson',
          age: 52,
          gender: 'male',
          phone: '+1 (555) 901-2345',
          email: 'david.johnson@email.com',
          address: '654 Maple Dr, City, State 12345',
          bloodType: 'O-',
          emergencyContact: {
            name: 'Mary Johnson',
            phone: '+1 (555) 012-3456',
            relationship: 'Sister'
          },
          medicalHistory: ['Diabetes Type 1', 'Kidney Disease'],
          allergies: ['Sulfa Drugs'],
          lastVisit: new Date(2024, 0, 3),
          nextAppointment: new Date(2024, 0, 18),
          status: 'active',
          totalVisits: 25
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const addPatient = () => {
    if (!newPatient.name || !newPatient.phone || !newPatient.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const patient: Patient = {
      id: Date.now().toString(),
      name: newPatient.name,
      age: newPatient.age,
      gender: newPatient.gender,
      phone: newPatient.phone,
      email: newPatient.email,
      address: newPatient.address,
      bloodType: newPatient.bloodType,
      emergencyContact: {
        name: newPatient.emergencyContactName,
        phone: newPatient.emergencyContactPhone,
        relationship: newPatient.emergencyContactRelationship
      },
      medicalHistory: newPatient.medicalHistory ? newPatient.medicalHistory.split(',').map(h => h.trim()) : [],
      allergies: newPatient.allergies ? newPatient.allergies.split(',').map(a => a.trim()) : [],
      lastVisit: new Date(),
      status: 'active',
      totalVisits: 0
    };

    setPatients(prev => [...prev, patient]);
    setNewPatient({
      name: '',
      age: 0,
      gender: 'male',
      phone: '',
      email: '',
      address: '',
      bloodType: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      medicalHistory: '',
      allergies: ''
    });
    setIsAddingPatient(false);
    
    toast({
      title: "Patient Added",
      description: `${patient.name} has been added to the system`,
    });
  };

  const togglePatientStatus = (patientId: string) => {
    setPatients(prev =>
      prev.map(patient =>
        patient.id === patientId
          ? { ...patient, status: patient.status === 'active' ? 'inactive' : 'active' }
          : patient
      )
    );

    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      toast({
        title: "Status Updated",
        description: `${patient.name} is now ${patient.status === 'active' ? 'inactive' : 'active'}`,
      });
    }
  };

  const deletePatient = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setPatients(prev => prev.filter(p => p.id !== patientId));
      toast({
        title: "Patient Removed",
        description: `${patient.name} has been removed from the system`,
      });
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    const matchesGender = genderFilter === 'all' || patient.gender === genderFilter;
    return matchesSearch && matchesStatus && matchesGender;
  });

  const stats = {
    total: patients.length,
    active: patients.filter(p => p.status === 'active').length,
    newThisMonth: patients.filter(p => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return p.lastVisit > lastMonth;
    }).length,
    averageAge: Math.round(patients.reduce((acc, p) => acc + p.age, 0) / patients.length)
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-gray-600 mt-2">Manage patient records and information</p>
          </div>
          <Dialog open={isAddingPatient} onOpenChange={setIsAddingPatient}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Register a new patient in the system
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newPatient.name}
                      onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={newPatient.age}
                      onChange={(e) => setNewPatient({ ...newPatient, age: parseInt(e.target.value) || 0 })}
                      placeholder="30"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={newPatient.gender} onValueChange={(value: 'male' | 'female' | 'other') => setNewPatient({ ...newPatient, gender: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map((gender) => (
                          <SelectItem key={gender} value={gender}>{gender.charAt(0).toUpperCase() + gender.slice(1)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Select value={newPatient.bloodType} onValueChange={(value) => setNewPatient({ ...newPatient, bloodType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newPatient.email}
                      onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                      placeholder="patient@email.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Emergency Contact Name</Label>
                    <Input
                      id="emergencyName"
                      value={newPatient.emergencyContactName}
                      onChange={(e) => setNewPatient({ ...newPatient, emergencyContactName: e.target.value })}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={newPatient.emergencyContactPhone}
                      onChange={(e) => setNewPatient({ ...newPatient, emergencyContactPhone: e.target.value })}
                      placeholder="+1 (555) 234-5678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Input
                      id="emergencyRelationship"
                      value={newPatient.emergencyContactRelationship}
                      onChange={(e) => setNewPatient({ ...newPatient, emergencyContactRelationship: e.target.value })}
                      placeholder="Spouse"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History (comma-separated)</Label>
                    <Input
                      id="medicalHistory"
                      value={newPatient.medicalHistory}
                      onChange={(e) => setNewPatient({ ...newPatient, medicalHistory: e.target.value })}
                      placeholder="Hypertension, Diabetes"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies (comma-separated)</Label>
                    <Input
                      id="allergies"
                      value={newPatient.allergies}
                      onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                      placeholder="Penicillin, Peanuts"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingPatient(false)}>
                  Cancel
                </Button>
                <Button onClick={addPatient}>Add Patient</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Patients</CardTitle>
              <User className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
              <p className="text-sm text-gray-600 mt-1">Registered patients</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Patients</CardTitle>
              <Activity className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.active}</div>
              <p className="text-sm text-gray-600 mt-1">Currently active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">New This Month</CardTitle>
              <Calendar className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.newThisMonth}</div>
              <p className="text-sm text-gray-600 mt-1">Recent registrations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Age</CardTitle>
              <Heart className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.averageAge}</div>
              <p className="text-sm text-gray-600 mt-1">Years old</p>
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
                  placeholder="Search by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
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
                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Gender</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <CardDescription>{patient.age} years old • {patient.gender}</CardDescription>
                    </div>
                  </div>
                  <Badge className={patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {patient.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{patient.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Heart className="h-4 w-4" />
                  <span>Blood Type: {patient.bloodType}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span>Visits: {patient.totalVisits}</span>
                </div>
                {patient.medicalHistory.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Medical History:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.medicalHistory.map((condition, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {patient.allergies.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Allergies:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between pt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePatientStatus(patient.id)}
                    className={patient.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                  >
                    {patient.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => deletePatient(patient.id)}
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

        {filteredPatients.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No patients found matching your criteria</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}