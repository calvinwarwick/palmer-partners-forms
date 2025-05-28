
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Mail, Download, MoreHorizontal, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useNavigate } from "react-router-dom";

interface TenancyApplication {
  id: string;
  applicants: any[];
  property_preferences: any;
  submitted_at: string;
}

interface ApplicationsTableProps {
  applications: TenancyApplication[];
  selectedApplications: string[];
  onSelectApplication: (id: string, checked: boolean) => void;
  onViewDetails: (application: TenancyApplication) => void;
}

const ApplicationsTable = ({
  applications,
  selectedApplications,
  onSelectApplication,
  onViewDetails
}: ApplicationsTableProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewApplicants = (applicationId: string) => {
    navigate(`/applicants?application=${applicationId}`);
  };

  const handleViewApplicant = (applicationId: string, applicantId: string) => {
    navigate(`/applicants?application=${applicationId}&applicant=${applicantId}`);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12">
              <span className="sr-only">Select</span>
            </TableHead>
            <TableHead className="font-semibold">Primary Applicant</TableHead>
            <TableHead className="font-semibold">Property</TableHead>
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
                <p className="text-sm text-gray-900">
                  {formatDate(application.submitted_at)}
                </p>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center space-x-2">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Badge variant="outline" className="text-xs cursor-pointer hover:bg-orange-50">
                        {application.applicants?.length || 0} {application.applicants?.length === 1 ? 'applicant' : 'applicants'}
                      </Badge>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 bg-white shadow-lg border z-50">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Applicants</h4>
                        {application.applicants?.map((applicant, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleViewApplicant(application.id, applicant.id)}
                          >
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium">{applicant.firstName} {applicant.lastName}</p>
                                <p className="text-xs text-gray-500">{applicant.email}</p>
                              </div>
                            </div>
                            <span className="text-xs text-orange-500">View →</span>
                          </div>
                        ))}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewApplicants(application.id)}
                    className="h-7 px-2"
                  >
                    <User className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
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
                    <DropdownMenuContent align="end" className="bg-white shadow-lg border z-50">
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Generate PDF
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
