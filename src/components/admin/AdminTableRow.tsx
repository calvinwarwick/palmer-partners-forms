
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Download, MoreHorizontal, Clock, Mail, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TenancyApplication {
  id: string;
  applicants: any[];
  property_preferences: any;
  additional_details: any;
  data_sharing: any;
  signature: string;
  submitted_at: string;
}

interface AdminTableRowProps {
  application: TenancyApplication;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onView: (application: TenancyApplication) => void;
  onDownload: (application: TenancyApplication) => void;
  onViewActivity: (application: TenancyApplication) => void;
}

const AdminTableRow = ({
  application,
  isSelected,
  onSelect,
  onView,
  onDownload,
  onViewActivity
}: AdminTableRowProps) => {
  const formatTimeAgo = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const getSiteBadge = (application: TenancyApplication) => {
    const postcode = application.property_preferences?.postcode?.toLowerCase() || '';
    
    if (postcode.startsWith('co') || postcode.includes('colchester')) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs font-medium">Colchester</Badge>;
    } else if (postcode.startsWith('ip') || postcode.includes('ipswich')) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs font-medium">Ipswich</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300 text-xs font-medium">Other</Badge>;
    }
  };

  const getApplicantCount = () => {
    const count = application.applicants?.length || 0;
    if (count > 1) {
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300 text-xs ml-2">
          <User className="h-3 w-3 mr-1" />
          {count}
        </Badge>
      );
    }
    return null;
  };

  return (
    <TableRow className="hover:bg-gray-50/50 border-b transition-colors">
      <TableCell className="w-12">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(application.id, !!checked)}
          className="h-4 w-4 border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
        />
      </TableCell>
      
      <TableCell className="min-w-0">
        <div className="space-y-1">
          <div className="flex items-center">
            <p className="font-semibold text-gray-900 text-sm truncate">
              {application.applicants?.[0]?.firstName} {application.applicants?.[0]?.lastName}
            </p>
            {getApplicantCount()}
          </div>
          <p className="text-xs text-gray-600 truncate">
            {application.applicants?.[0]?.email}
          </p>
          <p className="text-xs text-gray-500">
            {application.applicants?.[0]?.phone}
          </p>
        </div>
      </TableCell>
      
      <TableCell className="min-w-0">
        <div className="space-y-1">
          <p className="font-medium text-gray-900 text-sm truncate">
            {application.property_preferences?.streetAddress || 'No address provided'}
          </p>
          <p className="text-xs text-gray-600 uppercase tracking-wide">
            {application.property_preferences?.postcode}
          </p>
          {application.property_preferences?.maxRent && (
            <p className="text-xs text-green-600 font-medium">
              £{application.property_preferences.maxRent}/month
            </p>
          )}
        </div>
      </TableCell>
      
      <TableCell className="w-32">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">
            {formatTimeAgo(application.submitted_at)}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(application.submitted_at).toLocaleDateString()}
          </p>
        </div>
      </TableCell>
      
      <TableCell className="w-24 text-center">
        {getSiteBadge(application)}
      </TableCell>
      
      <TableCell className="w-40">
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(application)}
            className="h-8 px-3 border-blue-300 hover:bg-blue-50 text-blue-600 hover:text-blue-700"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50">
                <MoreHorizontal className="h-4 w-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white shadow-lg border border-gray-200 z-50">
              <DropdownMenuItem onClick={() => onViewActivity(application)} className="hover:bg-gray-50">
                <Clock className="h-4 w-4 mr-2 text-gray-600" />
                View Activity
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(application)} className="hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2 text-gray-600" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-50">
                <Mail className="h-4 w-4 mr-2 text-gray-600" />
                Send Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default AdminTableRow;
