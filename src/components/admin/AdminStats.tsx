
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, XCircle, Users, Calendar } from "lucide-react";

interface TenancyApplication {
  id: string;
  status: string;
  submitted_at: string;
  applicants: any[];
}

interface AdminStatsProps {
  applications: TenancyApplication[];
}

const AdminStats = ({ applications }: AdminStatsProps) => {
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'pending').length;
  const approvedApplications = applications.filter(app => app.status === 'approved').length;
  const rejectedApplications = applications.filter(app => app.status === 'rejected').length;
  const underReviewApplications = applications.filter(app => app.status === 'under_review').length;
  
  // Applications this month
  const thisMonth = applications.filter(app => {
    const submitDate = new Date(app.submitted_at);
    const now = new Date();
    return submitDate.getMonth() === now.getMonth() && submitDate.getFullYear() === now.getFullYear();
  }).length;

  // Applications this week
  const thisWeek = applications.filter(app => {
    const submitDate = new Date(app.submitted_at);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return submitDate >= weekAgo;
  }).length;

  const stats = [
    {
      title: "Total Applications",
      value: totalApplications,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Review",
      value: pendingApplications,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Approved",
      value: approvedApplications,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Under Review",
      value: underReviewApplications,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Rejected",
      value: rejectedApplications,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "This Month",
      value: thisMonth,
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
