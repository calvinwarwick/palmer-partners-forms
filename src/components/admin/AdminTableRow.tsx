
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Eye, Download, MoreHorizontal, Clock, Mail, User, MapPin, Phone, Calendar } from "lucide-react";
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
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs font-medium">
          <MapPin className="h-3 w-3 mr-1" />
          Colchester
        </Badge>
      );
    } else if (postcode.startsWith('ip') || postcode.includes('ipswich')) {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs font-medium">
          <MapPin className="h-3 w-3 mr-1" />
          Ipswich
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300 text-xs font-medium">
          <MapPin className="h-3 w-3 mr-1" />
          Other
        </Badge>
      );
    }
  };

  const getApplicantCount = () => {
    const count = application.applicants?.length || 0;
    if (count > 1) {
      return (
        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300 text-xs ml-2">
          <User className="h-3 w-3 mr-1" />
          {count} applicants
        </Badge>
      );
    }
    return null;
  };

  const primaryApplicant = application.applicants?.[0];

  return (
    <TableRow className="hover:bg-gray-50/80 border-b transition-all duration-200 group">
      <TableCell className="w-12">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(application.id, !!checked)}
          className="h-4 w-4 border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
        />
      </TableCell>
      
      <TableCell className="min-w-0">
        <div className="space-y-2">
          <div className="flex items-center flex-wrap gap-2">
            <p className="font-semibold text-gray-900 text-sm">
              {primaryApplicant?.firstName} {primaryApplicant?.lastName}
            </p>
            {getApplicantCount()}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-xs text-gray-600">
              <Mail className="h-3 w-3 mr-1 text-gray-400" />
              <span className="truncate">{primaryApplicant?.email}</span>
            </div>
            {primaryApplicant?.phone && (
              <div className="flex items-center text-xs text-gray-500">
                <Phone className="h-3 w-3 mr-1 text-gray-400" />
                <span>{primaryApplicant.phone}</span>
              </div>
            )}
          </div>
        </div>
      </TableCell>
      
      <TableCell className="min-w-0">
        <div className="space-y-2">
          <div>
            <p className="font-medium text-gray-900 text-sm truncate">
              {application.property_preferences?.streetAddress || 'No address provided'}
            </p>
            <p className="text-xs text-gray-600 uppercase tracking-wide font-medium">
              {application.property_preferences?.postcode}
            </p>
          </div>
          
          {application.property_preferences?.maxRent && (
            <div className="inline-flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
              £{application.property_preferences.maxRent}/month
            </div>
          )}
        </div>
      </TableCell>
      
      <TableCell className="w-36">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center text-sm font-medium text-gray-900">
            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
            {formatTimeAgo(application.submitted_at)}
          </div>
          <p className="text-xs text-gray-500">
            {new Date(application.submitted_at).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </p>
        </div>
      </TableCell>
      
      <TableCell className="w-28 text-center">
        {getSiteBadge(application)}
      </TableCell>
      
      <TableCell className="w-44">
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(application)}
            className="h-8 px-3 border-blue-300 hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors group-hover:shadow-sm"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50 transition-colors group-hover:shadow-sm"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white shadow-lg border border-gray-200 z-50 w-48">
              <DropdownMenuItem 
                onClick={() => onViewActivity(application)} 
                className="hover:bg-gray-50 cursor-pointer"
              >
                <Clock className="h-4 w-4 mr-2 text-gray-600" />
                View Activity Log
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => onDownload(application)} 
                className="hover:bg-gray-50 cursor-pointer"
              >
                <Download className="h-4 w-4 mr-2 text-gray-600" />
                Download PDF
              </DropdownMenuItem>
              
              <DropdownMenuItem className="hover:bg-gray-50 cursor-pointer">
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
