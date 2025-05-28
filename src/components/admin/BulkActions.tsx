
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Trash2, Mail, FileText } from "lucide-react";
import { useRef, useEffect } from "react";

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
  const checkboxRef = useRef<HTMLButtonElement>(null);
  const isAllSelected = selectedApplications.length === totalApplications && totalApplications > 0;
  const isIndeterminate = selectedApplications.length > 0 && selectedApplications.length < totalApplications;

  useEffect(() => {
    if (checkboxRef.current) {
      (checkboxRef.current as any).indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6">
        {/* Selection Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-50 rounded-lg border border-orange-200">
              <FileText className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  ref={checkboxRef}
                  checked={isAllSelected}
                  onCheckedChange={onSelectAll}
                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 border-gray-400"
                />
                <span className="text-sm font-medium text-gray-900">
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
            <div className="text-sm text-gray-700 mr-3 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              {selectedApplications.length} selected
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onBulkExport}
              className="shadow-sm hover:shadow-md transition-shadow border-green-500 hover:bg-green-50 text-green-600 hover:text-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="shadow-sm hover:shadow-md transition-shadow border-blue-500 hover:bg-blue-50 text-blue-600 hover:text-blue-700"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="shadow-sm hover:shadow-md transition-shadow border-red-500 hover:bg-red-50 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkActions;
