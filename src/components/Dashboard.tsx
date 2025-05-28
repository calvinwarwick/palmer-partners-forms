
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Users, FileText, Download, Plus, Settings, LogOut } from "lucide-react";

interface DashboardProps {
  user: { username: string; role: string };
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [applications] = useState([
    {
      id: 1,
      property: "123 Oak Street, London",
      applicants: 2,
      status: "Pending Review",
      submittedDate: "2024-01-15",
      agent: "John Smith"
    },
    {
      id: 2,
      property: "456 Pine Avenue, Manchester",
      applicants: 1,
      status: "Approved",
      submittedDate: "2024-01-10",
      agent: "Sarah Johnson"
    },
    {
      id: 3,
      property: "789 Elm Close, Birmingham",
      applicants: 3,
      status: "Under Review",
      submittedDate: "2024-01-12",
      agent: "Mike Davis"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500";
      case "Pending Review":
        return "bg-yellow-500";
      case "Under Review":
        return "bg-blue-500";
      case "Rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRoleSpecificContent = () => {
    switch (user.role) {
      case "Admin":
        return {
          title: "Admin Dashboard",
          description: "Manage all properties, applications, and users",
          stats: [
            { label: "Total Properties", value: "156", icon: Home },
            { label: "Total Applications", value: "89", icon: FileText },
            { label: "Active Users", value: "23", icon: Users },
            { label: "Pending Reviews", value: "12", icon: Settings }
          ]
        };
      case "Agent":
        return {
          title: "Agent Dashboard",
          description: "Manage your assigned properties and applications",
          stats: [
            { label: "My Properties", value: "23", icon: Home },
            { label: "My Applications", value: "15", icon: FileText },
            { label: "Pending Reviews", value: "3", icon: Settings },
            { label: "This Month", value: "8", icon: Plus }
          ]
        };
      case "Tenant":
        return {
          title: "Tenant Portal",
          description: "View your applications and property listings",
          stats: [
            { label: "My Applications", value: "2", icon: FileText },
            { label: "Approved", value: "1", icon: Home },
            { label: "Pending", value: "1", icon: Settings },
            { label: "Available Properties", value: "45", icon: Plus }
          ]
        };
      default:
        return {
          title: "Dashboard",
          description: "Welcome to the portal",
          stats: []
        };
    }
  };

  const content = getRoleSpecificContent();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Home className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EstateAgent</h1>
                <p className="text-sm text-gray-600">{content.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{user.role}</Badge>
              <span className="text-sm text-gray-600">Welcome, {user.username}</span>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{content.title}</h2>
          <p className="text-gray-600">{content.description}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {content.stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            {user.role === "Admin" && <TabsTrigger value="users">Users</TabsTrigger>}
          </TabsList>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Tenancy Applications</CardTitle>
                    <CardDescription>
                      {user.role === "Admin" ? "All applications" : "Your applications"}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    {user.role !== "Tenant" && (
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Application
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{app.property}</h3>
                          <p className="text-gray-600 text-sm">
                            {app.applicants} applicant(s) • Submitted {app.submittedDate}
                          </p>
                          {user.role === "Admin" && (
                            <p className="text-gray-600 text-sm">Agent: {app.agent}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-white ${getStatusColor(app.status)}`}>
                            {app.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle>Property Management</CardTitle>
                <CardDescription>Manage property listings and details</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Property management interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {user.role === "Admin" && (
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage system users and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">User management interface will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
