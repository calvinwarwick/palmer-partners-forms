
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Applicant, PropertyPreferences, AdditionalDetails } from "@/domain/types/Applicant";
import { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";

interface TenancyApplication {
  id: string;
  applicants: Applicant[];
  property_preferences: PropertyPreferences;
  additional_details: AdditionalDetails;
  data_sharing: { utilities: boolean; insurance: boolean };
  signature: string;
  status: string;
  submitted_at: string;
}

const Admin = () => {
  const [applications, setApplications] = useState<TenancyApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<TenancyApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

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

      // Type cast the data properly
      const typedData = data.map(app => ({
        ...app,
        applicants: app.applicants as unknown as Applicant[],
        property_preferences: app.property_preferences as unknown as PropertyPreferences,
        additional_details: app.additional_details as unknown as AdditionalDetails,
        data_sharing: app.data_sharing as unknown as { utilities: boolean; insurance: boolean }
      }));

      setApplications(typedData);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.applicants.some(applicant => 
          applicant.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          applicant.email.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        app.property_preferences.streetAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.property_preferences.postcode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const updateApplicationStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tenancy_applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setApplications(prev => 
        prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
      );
      toast.success('Application status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage tenancy applications</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name, email, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 focus:ring-orange-500">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        {filteredApplications.map((application) => (
          <Card key={application.id} className="shadow-sm border border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {application.applicants[0]?.firstName} {application.applicants[0]?.lastName}
                    {application.applicants.length > 1 && ` + ${application.applicants.length - 1} other(s)`}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">{application.applicants[0]?.email}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <p className="text-sm text-gray-500">
                    {new Date(application.submitted_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Property Details</h4>
                  <p className="text-sm text-gray-600">
                    {application.property_preferences.streetAddress}
                  </p>
                  <p className="text-sm text-gray-600">
                    {application.property_preferences.postcode}
                  </p>
                  <p className="text-sm text-gray-600">
                    Rent: £{application.property_preferences.maxRent}/month
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
                  <p className="text-sm text-gray-600">
                    Phone: {application.applicants[0]?.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    Move-in: {application.property_preferences.moveInDate}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Select 
                  value={application.status} 
                  onValueChange={(value) => updateApplicationStatus(application.id, value)}
                >
                  <SelectTrigger className="w-48 focus:ring-orange-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredApplications.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No applications found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Admin;
