
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, TrendingUp, Clock } from "lucide-react";

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

  const stats = [
    {
      title: "Total Applications",
      value: totalApplications,
      icon: FileText,
      description: "All time",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      title: "This Month",
      value: thisMonth,
      icon: Calendar,
      description: "Current month",
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "This Week",
      value: thisWeek,
      icon: TrendingUp,
      description: "Last 7 days",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Today",
      value: today,
      icon: Clock,
      description: "Today's submissions",
      gradient: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{stat.title}</p>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900 tabular-nums">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
