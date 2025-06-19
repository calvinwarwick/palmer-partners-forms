
import FileUploadTab from "@/components/admin/FileUploadTab";
import ApplicationHeader from "@/components/shared/ApplicationHeader";
import AdminTools from "@/components/admin/AdminTools";

const AdminFiles = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 font-lexend">
      <ApplicationHeader title="Admin Files & Tools" />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Admin Tools Section */}
        <AdminTools />

        {/* File Management Section */}
        <FileUploadTab />
      </div>
    </div>
  );
};

export default AdminFiles;
