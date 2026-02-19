import { BarChart3, TrendingUp, Users, DollarSign, BookOpen, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface AdminAnalyticsTabProps {
  contentMode: 'chapters' | 'books';
}

export function AdminAnalyticsTab({ contentMode }: AdminAnalyticsTabProps) {
  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      title: `Total ${contentMode === 'chapters' ? 'Focus Areas' : 'Books'}`,
      value: contentMode === 'chapters' ? '156' : '42',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: BookOpen,
    },
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+23.1%',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      title: 'Page Views',
      value: '128,543',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: Eye,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track performance and engagement metrics
            </p>
          </div>
          <Badge variant="outline" className="h-fit">
            {contentMode === 'chapters' ? 'Chapter Mode' : 'Book Mode'}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="rounded-3xl shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
            <CardDescription>Revenue trends for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-2xl">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Chart visualization will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New users registered over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-muted rounded-2xl">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                <p>Chart visualization will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
