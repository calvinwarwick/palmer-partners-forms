
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Download, Trash2, Mail, FileText, Users, CheckCircle } from "lucide-react";
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
  const switchRef = useRef<HTMLButtonElement>(null);
  const isAllSelected = selectedApplications.length === totalApplications && totalApplications > 0;
  const isIndeterminate = selectedApplications.length > 0 && selectedApplications.length < totalApplications;

  useEffect(() => {
    if (switchRef.current) {
      (switchRef.current as any).indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6">
        {/* Selection Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Switch
                  ref={switchRef}
                  checked={isAllSelected}
                  onCheckedChange={onSelectAll}
                  className="data-[state=checked]:bg-orange-500"
                />
                <span className="text-sm font-medium text-gray-900">
                  Select all applications
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center text-xs text-gray-500">
                  <Users className="h-3 w-3 mr-1" />
                  {selectedApplications.length} of {totalApplications} selected
                </div>
                
                {selectedApplications.length > 0 && (
                  <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready for action
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedApplications.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-700 mr-2 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200 font-medium">
              {selectedApplications.length} item{selectedApplications.length !== 1 ? 's' : ''} selected
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onBulkExport}
                className="shadow-sm hover:shadow-md transition-all border-green-500 hover:bg-green-50 text-green-600 hover:text-green-700 h-9"
              >
                <Download className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Export CSV</span>
                <span className="md:hidden">Export</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm hover:shadow-md transition-all border-blue-500 hover:bg-blue-50 text-blue-600 hover:text-blue-700 h-9"
              >
                <Mail className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Send Email</span>
                <span className="md:hidden">Email</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm hover:shadow-md transition-all border-red-500 hover:bg-red-50 text-red-600 hover:text-red-700 h-9"
              >
                <Trash2 className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Delete</span>
                <span className="md:hidden">Delete</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkActions;
