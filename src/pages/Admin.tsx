
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, Filter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface TenancyApplication {
  id: string;
  applicants: any[];
  property_preferences: any;
  additional_details: any;
  data_sharing: any;
  signature: string;
  submitted_at: string;
  status: string;
}

const Admin = () => {
  const [applications, setApplications] = useState<TenancyApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<TenancyApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<TenancyApplication | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('tenancy_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.applicants.some(applicant => 
          `${applicant.firstName} ${applicant.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        app.property_preferences.streetAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.signature.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tenancy_applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setApplications(prev => 
        prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
      );
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'reviewing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (selectedApplication) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 max-w-6xl py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => setSelectedApplication(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Button>
            <h1 className="text-2xl font-bold">Application Details</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Applicant Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedApplication.applicants.map((applicant, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <h4 className="font-medium">Applicant {index + 1}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                      <div><strong>Name:</strong> {applicant.firstName} {applicant.lastName}</div>
                      <div><strong>Email:</strong> {applicant.email}</div>
                      <div><strong>Phone:</strong> {applicant.phone}</div>
                      <div><strong>DOB:</strong> {applicant.dateOfBirth}</div>
                      <div><strong>Employment:</strong> {applicant.employment}</div>
                      <div><strong>Company:</strong> {applicant.companyName}</div>
                      <div><strong>Income:</strong> £{applicant.annualIncome}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>Address:</strong> {selectedApplication.property_preferences.streetAddress}</div>
                  <div><strong>Postcode:</strong> {selectedApplication.property_preferences.postcode}</div>
                  <div><strong>Rent:</strong> £{selectedApplication.property_preferences.maxRent}</div>
                  <div><strong>Move-in Date:</strong> {selectedApplication.property_preferences.moveInDate}</div>
                  <div><strong>Tenancy Term:</strong> {selectedApplication.property_preferences.initialTenancyTerm}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span>Current Status:</span>
                    <Badge className={getStatusColor(selectedApplication.status)}>
                      {selectedApplication.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => updateStatus(selectedApplication.id, 'reviewing')}>
                      Mark as Reviewing
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => updateStatus(selectedApplication.id, 'approved')}>
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => updateStatus(selectedApplication.id, 'rejected')}>
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div><strong>Signature:</strong> {selectedApplication.signature}</div>
                <div><strong>Submitted:</strong> {new Date(selectedApplication.submitted_at).toLocaleString()}</div>
                <div><strong>Data Sharing:</strong></div>
                <ul className="ml-4 list-disc">
                  <li>Utilities: {selectedApplication.data_sharing.utilities ? 'Yes' : 'No'}</li>
                  <li>Insurance: {selectedApplication.data_sharing.insurance ? 'Yes' : 'No'}</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/" className="flex items-center text-primary hover:text-primary/80">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Application Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, address, or signature..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredApplications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant(s)</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Rent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        {application.applicants.map((applicant, index) => (
                          <div key={index} className="text-sm">
                            {applicant.firstName} {applicant.lastName}
                            {index === 0 && <div className="text-xs text-muted-foreground">{applicant.email}</div>}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{application.property_preferences.streetAddress}</div>
                        <div className="text-xs text-muted-foreground">{application.property_preferences.postcode}</div>
                      </div>
                    </TableCell>
                    <TableCell>£{application.property_preferences.maxRent}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(application.submitted_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredApplications.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No applications found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
