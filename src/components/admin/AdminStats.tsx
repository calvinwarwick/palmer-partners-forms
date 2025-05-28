
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, TrendingUp, Clock, Users, CalendarDays } from "lucide-react";

interface TenancyApplication {
  id: string;
  submitted_at: string;
  applicants: any[];
}

interface AdminStatsProps {
  applications: TenancyApplication[];
}

const AdminStats = ({ applications }: AdminStatsProps) => {
  const totalApplications = applications.length;
  
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

  // Applications today
  const today = applications.filter(app => {
    const submitDate = new Date(app.submitted_at);
    const now = new Date();
    return submitDate.toDateString() === now.toDateString();
  }).length;

  // Applications last month
  const lastMonth = applications.filter(app => {
    const submitDate = new Date(app.submitted_at);
    const now = new Date();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return submitDate >= lastMonthStart && submitDate < thisMonthStart;
  }).length;

  // Total applicants (sum of all applicants across all applications)
  const totalApplicants = applications.reduce((sum, app) => sum + (app.applicants?.length || 0), 0);

  // Average applicants per application
  const avgApplicantsPerApp = totalApplications > 0 ? (totalApplicants / totalApplications).toFixed(1) : '0';

  const stats = [
    {
      title: "Total Applications",
      value: totalApplications,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "This Month",
      value: thisMonth,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "This Week",
      value: thisWeek,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Today",
      value: today,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Last Month",
      value: lastMonth,
      icon: CalendarDays,
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    },
    {
      title: "Total Applicants",
      value: totalApplicants,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
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
                {stat.title === "Total Applicants" && (
                  <p className="text-xs text-gray-500 mt-1">Avg: {avgApplicantsPerApp} per app</p>
                )}
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
