
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Upload, File, Image, Trash2, Copy, ExternalLink } from "lucide-react";

interface UploadedFile {
  name: string;
  publicUrl: string;
  size: number;
  type: string;
  created_at: string;
}

const FileUploadTab = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const getFileUrl = (fileName: string) => {
    // Use our own domain for file URLs
    const currentDomain = window.location.origin;
    return `${currentDomain}/api/files/${fileName}`;
  };

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('admin-files')
        .list('', {
          limit: 100,
          offset: 0,
        });

      if (error) throw error;

      const filesWithUrls = (data || []).map((file) => ({
        name: file.name,
        publicUrl: getFileUrl(file.name),
        size: file.metadata?.size || 0,
        type: file.metadata?.mimetype || '',
        created_at: file.created_at || '',
      }));

      setFiles(filesWithUrls);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploading(true);

    try {
      for (const file of fileList) {
        const fileName = `${Date.now()}-${file.name}`;
        
        const { error } = await supabase.storage
          .from('admin-files')
          .upload(fileName, file);

        if (error) throw error;
      }

      toast.success(`${fileList.length} file(s) uploaded successfully`);
      fetchFiles();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDeleteFile = async (fileName: string) => {
    try {
      const { error } = await supabase.storage
        .from('admin-files')
        .remove([fileName]);

      if (error) throw error;

      toast.success('File deleted successfully');
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const getFileTypeColor = (type: string) => {
    if (type.startsWith('image/')) {
      return 'bg-blue-100 text-blue-800';
    }
    if (type === 'application/pdf') {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="border-0 bg-white/95 backdrop-blur-sm" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-dark-grey flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Files
          </CardTitle>
          <CardDescription>
            Upload PDFs and images to use in forms. Files will be accessible via your domain. Supported formats: PDF, JPEG, PNG, GIF, WebP (Max 10MB each)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
              onChange={handleFileUpload}
              disabled={uploading}
              className="flex-1"
            />
            <Button
              disabled={uploading}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              {uploading ? 'Uploading...' : 'Select Files'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      <Card className="border-0 bg-white/95 backdrop-blur-sm" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-dark-grey">Uploaded Files</CardTitle>
          <CardDescription>
            Manage your uploaded files and get their URLs for use in forms. All files are served from your domain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-8">
              <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No files uploaded yet</p>
              <p className="text-sm text-gray-400">Upload some files to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-dark-grey truncate">{file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getFileTypeColor(file.type)}`}>
                          {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                        </Badge>
                        <span className="text-sm text-gray-500">{formatFileSize(file.size)}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 break-all">{file.publicUrl}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(file.publicUrl)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.publicUrl, '_blank')}
                      className="text-green-600 hover:text-green-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFile(file.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUploadTab;
