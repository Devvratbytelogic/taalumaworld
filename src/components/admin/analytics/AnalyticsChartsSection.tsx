import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';

export function AnalyticsChartsSection() {
  return (
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
  );
}
