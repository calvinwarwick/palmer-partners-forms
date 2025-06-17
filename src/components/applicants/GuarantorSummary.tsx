
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Edit, Trash2 } from "lucide-react";

interface GuarantorSummaryProps {
  guarantorName: string;
  guarantorRelationship: string;
  guarantorEmail?: string;
  guarantorPhone?: string;
  onEdit: () => void;
  onDelete: () => void;
}

const GuarantorSummary = ({ 
  guarantorName, 
  guarantorRelationship, 
  guarantorEmail,
  guarantorPhone,
  onEdit, 
  onDelete 
}: GuarantorSummaryProps) => {
  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="h-4 w-4 text-green-600" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">{guarantorName}</h4>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Guarantor Added
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                Relationship: <span className="font-medium">{guarantorRelationship}</span>
              </p>
              {guarantorEmail && (
                <p className="text-sm text-gray-600">
                  Email: <span className="font-medium">{guarantorEmail}</span>
                </p>
              )}
              {guarantorPhone && (
                <p className="text-sm text-gray-600">
                  Phone: <span className="font-medium">{guarantorPhone}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-50"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuarantorSummary;
