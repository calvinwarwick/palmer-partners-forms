
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CheckCircle2 } from "lucide-react";

interface TenancyApplication {
  id: string;
  applicants: any[];
  submitted_at: string;
  status?: string;
}

interface AdminStatsProps {
  applications: TenancyApplication[];
}

const AdminStats = ({ applications }: AdminStatsProps) => {
  const totalApplications = applications.length;
  const totalApplicants = applications.reduce((sum, app) => sum + (app.applicants?.length || 0), 0);
  
  // Calculate applications from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayApplications = applications.filter(app => {
    const submitDate = new Date(app.submitted_at);
    submitDate.setHours(0, 0, 0, 0);
    return submitDate.getTime() === today.getTime();
  }).length;

  const stats = [
    {
      title: "Total Applications",
      value: totalApplications,
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Total Applicants", 
      value: totalApplicants,
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Today's Applications",
      value: todayApplications,
      icon: CheckCircle2,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="shadow-sm border border-gray-200">
          <CardHeader variant="gradient" className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg bg-orange-50 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
