import { useState } from 'react';
import { Search, Upload } from 'lucide-react';
import Button from '../../ui/Button';
import { Input } from '../../ui/input';

interface AdminBooksSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function AdminBooksSearch({ searchQuery, onSearchChange }: AdminBooksSearchProps) {
  const [isUploadingPPT, setIsUploadingPPT] = useState(false);

  const handlePowerPointUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (
        file.type === 'application/vnd.ms-powerpoint' ||
        file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ) {
        setIsUploadingPPT(true);
        setTimeout(() => {
          setIsUploadingPPT(false);
          alert(
            `PowerPoint "${file.name}" uploaded successfully! This would be processed on the server.`
          );
        }, 2000);
      } else {
        alert('Please upload a valid PowerPoint file (.ppt or .pptx)');
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search books by title, thought leader, or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <input
            type="file"
            accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
            onChange={handlePowerPointUpload}
            className="hidden"
            id="ppt-upload"
          />
          <label htmlFor="ppt-upload">
            <Button
              className="global_btn rounded_full outline_primary"
              disabled={isUploadingPPT}
              startContent={<Upload className="h-4 w-4" />}
            >
              {isUploadingPPT ? 'Uploading...' : 'Upload PowerPoint'}
            </Button>
          </label>
        </div>
      </div>
    </div>
  );
}
