/**
 * Admin Dashboard Tab
 * Overview with stats, charts, and quick actions
 */

import {
  TrendingUp,
  TrendingDown,
  Users,
  Book,
  FileText,
  DollarSign,
  ShoppingCart,
  MessageSquare,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import { Progress } from '@heroui/react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import Button from '../ui/Button';
import type { AdminUser, ContentMode } from '../../types/admin';
import { cn } from '../ui/utils';

interface AdminDashboardTabProps {
  contentMode: ContentMode;
  adminUser: AdminUser;
}

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

export function AdminDashboardTab({ contentMode, adminUser }: AdminDashboardTabProps) {
  // Mock stats - In production, fetch from API
  const stats: StatCard[] = [
    {
      title: 'Total Users',
      value: '2,847',
      change: 12.5,
      icon: Users,
      color: 'blue',
    },
    {
      title: contentMode === 'chapters' ? 'Total Focus Areas' : 'Total Books',
      value: contentMode === 'chapters' ? '156' : '42',
      change: 8.3,
      icon: contentMode === 'chapters' ? FileText : Book,
      color: 'purple',
    },
    {
      title: 'Revenue (30d)',
      value: '$18,492',
      change: 23.1,
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'Active Sales',
      value: '94',
      change: -4.2,
      icon: ShoppingCart,
      color: 'orange',
    },
  ];

  const recentActivity = [
    { id: 1, user: 'Sarah Johnson', action: 'purchased', item: 'Leadership Fundamentals', time: '2 minutes ago' },
    { id: 2, user: 'Michael Chen', action: 'left a review on', item: 'Strategic Thinking', time: '15 minutes ago' },
    { id: 3, user: 'Emily Rodriguez', action: 'registered', item: '', time: '1 hour ago' },
    { id: 4, user: 'David Kim', action: 'purchased', item: 'Career Growth Strategies', time: '2 hours ago' },
    { id: 5, user: 'Jessica Lee', action: 'started reading', item: 'Professional Communication', time: '3 hours ago' },
  ];

  const topContent = [
    { id: 1, title: 'Leadership Fundamentals', sales: 234, revenue: 4680, trend: 15 },
    { id: 2, title: 'Strategic Thinking', sales: 189, revenue: 3780, trend: 8 },
    { id: 3, title: 'Career Growth Strategies', sales: 167, revenue: 3340, trend: -3 },
    { id: 4, title: 'Professional Communication', sales: 145, revenue: 2900, trend: 12 },
    { id: 5, title: 'Time Management Mastery', sales: 132, revenue: 2640, trend: 5 },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-linear-to-r from-primary to-primary-light rounded-3xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {adminUser.name}!
        </h1>
        <p className="text-white/90">
          Here's what's happening with your platform today.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {contentMode === 'chapters' ? 'Chapter Mode' : 'Book Mode'}
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;

          return (
            <Card key={stat.title} className="p-6 hover-lift cursor-pointer border-2">
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "p-3 rounded-2xl",
                  colorClasses[stat.color]
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>{Math.abs(stat.change)}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <Button className="global_btn rounded_full outline_primary">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                <div className="p-2 bg-primary/10 rounded-full mt-1">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    {' '}
                    <span className="text-muted-foreground">{activity.action}</span>
                    {activity.item && (
                      <>
                        {' '}
                        <span className="font-medium">{activity.item}</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Performing Content */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              Top {contentMode === 'chapters' ? 'Focus Areas' : 'Books'}
            </h3>
            <Button className="global_btn rounded_full outline_primary">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            {topContent.map((item, index) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.sales} sales · ${item.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={item.trend >= 0 ? "default" : "destructive"} className="ml-2">
                    {item.trend >= 0 ? '+' : ''}{item.trend}%
                  </Badge>
                </div>
                <Progress value={(item.sales / 250) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Pending Items & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Reviews */}
        <Card className="p-6 border-l-4 border-l-orange-500">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-full">
                <MessageSquare className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold">Pending Reviews</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Reviews waiting for moderation
          </p>
            <Button className="global_btn rounded_full outline_primary">
            Review Now
          </Button>
        </Card>

        {/* Flagged Content */}
        <Card className="p-6 border-l-4 border-l-red-500">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-full">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-semibold">Flagged Content</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Items requiring immediate attention
          </p>
          <Button className="global_btn rounded_full outline_primary">
            View Queue
          </Button>
        </Card>

        {/* System Health */}
        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-full">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">System Health</p>
                <p className="text-2xl font-bold">98%</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            All systems operational
          </p>
          <Button className="global_btn rounded_full outline_primary">
            View Details
          </Button>
        </Card>
      </div>
    </div>
  );
}
