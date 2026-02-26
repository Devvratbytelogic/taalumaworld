import { FileText, Download, Calendar } from 'lucide-react';
import Button from '../../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';

export interface ReportType {
  id: string;
  title: string;
  description: string;
  lastGenerated: string;
  frequency: string;
}

interface ReportsGridProps {
  reports: ReportType[];
}

export function ReportsGrid({ reports }: ReportsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reports.map((report) => (
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
  );
}
