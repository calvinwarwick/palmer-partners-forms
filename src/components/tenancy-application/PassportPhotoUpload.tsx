
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, User } from "lucide-react";

interface PassportPhotoUploadProps {
  applicantName: string;
  onPhotoUpload: (file: File) => void;
  existingPhoto?: string;
}

const PassportPhotoUpload = ({ applicantName, onPhotoUpload, existingPhoto }: PassportPhotoUploadProps) => {
  const [preview, setPreview] = useState<string | null>(existingPhoto || null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onPhotoUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files[0]) {
      handleFileChange(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removePhoto = () => {
    setPreview(null);
  };

  return (
    <Card className="border border-gray-200" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
      <CardContent className="p-6">
        <Label className="text-base font-medium text-dark-grey mb-3 block">
          Passport Photo - {applicantName}
        </Label>
        
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging 
              ? 'border-orange-500 bg-orange-50' 
              : preview 
                ? 'border-gray-200 bg-gray-50' 
                : 'border-gray-300 hover:border-orange-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {preview ? (
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Passport photo preview"
                className="w-32 h-40 object-cover rounded border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={removePhoto}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div>
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drop passport photo here or click to browse</p>
              <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
            </div>
          )}
        </div>
        
        {!preview && (
          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileChange(file);
              }}
              className="hidden"
              id={`passport-upload-${applicantName.replace(/\s+/g, '-')}`}
            />
            <label htmlFor={`passport-upload-${applicantName.replace(/\s+/g, '-')}`}>
              <Button type="button" asChild className="w-full bg-orange-500 hover:bg-orange-600">
                <span className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Passport Photo
                </span>
              </Button>
            </label>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PassportPhotoUpload;
