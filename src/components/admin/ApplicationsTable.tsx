
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Mail, Download, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TenancyApplication {
  id: string;
  applicants: any[];
  property_preferences: any;
  status: string;
  submitted_at: string;
}

interface ApplicationsTableProps {
  applications: TenancyApplication[];
  selectedApplications: string[];
  onSelectApplication: (id: string, checked: boolean) => void;
  onStatusUpdate: (id: string, status: string) => void;
  onViewDetails: (application: TenancyApplication) => void;
}

const ApplicationsTable = ({
  applications,
  selectedApplications,
  onSelectApplication,
  onStatusUpdate,
  onViewDetails
}: ApplicationsTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12">
              <span className="sr-only">Select</span>
            </TableHead>
            <TableHead className="font-semibold">Applicant</TableHead>
            <TableHead className="font-semibold">Property</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Submitted</TableHead>
            <TableHead className="font-semibold">Applicants</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id} className="hover:bg-gray-50">
              <TableCell>
                <Checkbox
                  checked={selectedApplications.includes(application.id)}
                  onCheckedChange={(checked) => onSelectApplication(application.id, !!checked)}
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
              </TableCell>
              
              <TableCell>
                <div>
                  <p className="font-medium text-gray-900">
                    {application.applicants?.[0]?.firstName} {application.applicants?.[0]?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {application.applicants?.[0]?.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    {application.applicants?.[0]?.phone}
                  </p>
                </div>
              </TableCell>
              
              <TableCell>
                <div>
                  <p className="font-medium text-gray-900">
                    {application.property_preferences?.streetAddress || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {application.property_preferences?.postcode}
                  </p>
                  <p className="text-sm text-gray-600">
                    £{application.property_preferences?.maxRent}/month
                  </p>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex flex-col space-y-2">
                  <Badge className={`text-xs ${getStatusColor(application.status)} border`}>
                    {application.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Select 
                    value={application.status} 
                    onValueChange={(value) => onStatusUpdate(application.id, value)}
                  >
                    <SelectTrigger className="w-32 h-8 text-xs">
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
              </TableCell>
              
              <TableCell>
                <p className="text-sm text-gray-900">
                  {formatDate(application.submitted_at)}
                </p>
              </TableCell>
              
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {application.applicants?.length || 0} {application.applicants?.length === 1 ? 'applicant' : 'applicants'}
                </Badge>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(application)}
                    className="h-8"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationsTable;
