
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, Archive, Trash2 } from "lucide-react";

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
  const hasSelectedApplications = selectedApplications.length > 0;
  const allSelected = selectedApplications.length === totalApplications && totalApplications > 0;

  return (
    <div className="bg-white border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={allSelected}
              onCheckedChange={onSelectAll}
              className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
            />
            <span className="text-sm font-medium">
              Select All ({totalApplications})
            </span>
          </div>
          
          {hasSelectedApplications && (
            <Badge variant="default" className="bg-orange-500">
              {selectedApplications.length} selected
            </Badge>
          )}
        </div>

        {hasSelectedApplications && (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={onBulkExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>

            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Email Selected
            </Button>

            <Button variant="outline" size="sm">
              <Archive className="h-4 w-4 mr-2" />
              Archive Selected
            </Button>

            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkActions;
