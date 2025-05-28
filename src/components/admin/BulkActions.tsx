
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
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gray-800 p-6 rounded-xl">
      {/* Selection Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-500/10 rounded-lg">
            <FileText className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <Checkbox
                ref={checkboxRef}
                checked={isAllSelected}
                onCheckedChange={onSelectAll}
                className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 border-gray-600"
              />
              <span className="text-sm font-medium text-gray-200">
                Select all applications
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {selectedApplications.length} of {totalApplications} selected
            </p>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedApplications.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-300 mr-3 bg-gray-700 px-3 py-1 rounded-full">
            {selectedApplications.length} selected
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkExport}
            className="shadow-sm hover:shadow-md transition-shadow border-green-600 hover:bg-green-500/10 text-green-400 hover:text-green-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="shadow-sm hover:shadow-md transition-shadow border-blue-600 hover:bg-blue-500/10 text-blue-400 hover:text-blue-300"
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="shadow-sm hover:shadow-md transition-shadow border-red-600 hover:bg-red-500/10 text-red-400 hover:text-red-300"
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
