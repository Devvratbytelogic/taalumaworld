import { FileText, Download, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface AdminReportsTabProps {
  contentMode: 'chapters' | 'books';
}

const reportTypes = [
  {
    id: 'sales',
    title: 'Sales Report',
    description: 'Detailed breakdown of all sales and revenue',
    lastGenerated: '2024-01-20',
    frequency: 'Weekly',
  },
  {
    id: 'users',
    title: 'User Activity Report',
    description: 'User engagement and activity metrics',
    lastGenerated: '2024-01-20',
    frequency: 'Daily',
  },
  {
    id: 'content',
    title: 'Content Performance',
    description: 'Most popular books and focus areas',
    lastGenerated: '2024-01-19',
    frequency: 'Monthly',
  },
  {
    id: 'revenue',
    title: 'Revenue Analysis',
    description: 'Financial performance and trends',
    lastGenerated: '2024-01-15',
    frequency: 'Monthly',
  },
];

export function AdminReportsTab({ contentMode }: AdminReportsTabProps) {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground">
              Generate and download detailed reports
            </p>
          </div>
          <Badge variant="outline" className="h-fit">
            {contentMode === 'chapters' ? 'Chapter Mode' : 'Book Mode'}
          </Badge>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report) => (
          <Card key={report.id} className="rounded-3xl shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{report.title}</CardTitle>
                    <CardDescription className="mt-1">{report.description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Last generated: {report.lastGenerated}</span>
                </div>
                <Badge variant="outline">{report.frequency}</Badge>
              </div>
              <div className="flex gap-2">
                <Button className="global_btn rounded_full outline_primary">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button className="global_btn rounded_full bg_primary">
                  <Download className="h-4 w-4" />
                  Download CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Report Generator */}
      <Card className="rounded-3xl shadow-sm">
        <CardHeader>
          <CardTitle>Custom Report Generator</CardTitle>
          <CardDescription>
            Create custom reports with specific date ranges and filters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 bg-muted rounded-2xl">
            <div className="text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2" />
              <p>Custom report builder coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
