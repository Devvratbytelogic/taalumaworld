import { FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';

export function CustomReportCard() {
  return (
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
  );
}
