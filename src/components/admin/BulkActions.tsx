
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Trash2, Mail, FileText } from "lucide-react";

interface BulkActionsProps {
  selectedApplications: string[];
  onSelectAll: (checked: boolean) => void;
  onBulkExport: () => void;
  totalApplications: number;
}

const BulkActions = ({
  selectedApplications,
  onSelectAll,
  onBulkExport,
  totalApplications
}: BulkActionsProps) => {
  const isAllSelected = selectedApplications.length === totalApplications && totalApplications > 0;
  const isIndeterminate = selectedApplications.length > 0 && selectedApplications.length < totalApplications;

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
      {/* Selection Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={isAllSelected}
                ref={(ref) => {
                  if (ref) ref.indeterminate = isIndeterminate;
                }}
                onCheckedChange={onSelectAll}
                className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Select all applications
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {selectedApplications.length} of {totalApplications} selected
            </p>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedApplications.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600 mr-3 bg-gray-100 px-3 py-1 rounded-full">
            {selectedApplications.length} selected
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkExport}
            className="shadow-sm hover:shadow-md transition-shadow border-green-200 hover:bg-green-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="shadow-sm hover:shadow-md transition-shadow border-blue-200 hover:bg-blue-50"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="shadow-sm hover:shadow-md transition-shadow border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default BulkActions;
