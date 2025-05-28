
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, Archive, Trash2 } from "lucide-react";
import { useState } from "react";

interface BulkActionsProps {
  selectedApplications: string[];
  onSelectAll: (checked: boolean) => void;
  onBulkStatusUpdate: (status: string) => void;
  onBulkExport: () => void;
  totalApplications: number;
}

const BulkActions = ({
  selectedApplications,
  onSelectAll,
  onBulkStatusUpdate,
  onBulkExport,
  totalApplications
}: BulkActionsProps) => {
  const [bulkStatus, setBulkStatus] = useState("");
  const hasSelectedApplications = selectedApplications.length > 0;
  const allSelected = selectedApplications.length === totalApplications && totalApplications > 0;

  const handleBulkStatusUpdate = () => {
    if (bulkStatus && hasSelectedApplications) {
      onBulkStatusUpdate(bulkStatus);
      setBulkStatus("");
    }
  };

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
            <div className="flex items-center space-x-2">
              <Select value={bulkStatus} onValueChange={setBulkStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                size="sm" 
                onClick={handleBulkStatusUpdate}
                disabled={!bulkStatus}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Update
              </Button>
            </div>

            <Button variant="outline" size="sm" onClick={onBulkExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>

            <Button variant="outline" size="sm">
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkActions;
