
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Users, FileText, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import ApplicationsTable from "@/components/admin/ApplicationsTable";
import AdminStats from "@/components/admin/AdminStats";
import ApplicantsTab from "@/components/admin/ApplicantsTab";
import ApplicationHeader from "@/components/shared/ApplicationHeader";

const Admin = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 font-lexend">
      <ApplicationHeader title="Admin Dashboard" />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Card */}
        <Card className="mb-8 border-0 bg-white/90 backdrop-blur-sm" style={{ boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-dark-grey mb-2">Welcome back!</h1>
                <p className="text-light-grey">
                  Logged in as: <span className="font-medium text-dark-grey">{user?.email}</span>
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Admin Tabs */}
        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/90 backdrop-blur-sm">
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="applicants" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Applicants
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <AdminStats />
          </TabsContent>

          <TabsContent value="applications">
            <ApplicationsTable />
          </TabsContent>

          <TabsContent value="applicants">
            <ApplicantsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
