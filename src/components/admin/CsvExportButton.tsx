'use client';

import { Download } from 'lucide-react';
import Button from '@/components/ui/Button';
import { exportRowsAsCsv, type CsvColumn } from '@/utils/csvExport';

type CsvExportButtonProps<T> = {
  filename: string;
  columns: CsvColumn<T>[];
  rows: T[];
  disabled?: boolean;
  label?: string;
  ariaLabel?: string;
};

export function CsvExportButton<T>({
  filename,
  columns,
  rows,
  disabled,
  label = 'Export CSV',
  ariaLabel,
}: CsvExportButtonProps<T>) {
  const isDisabled = disabled || rows.length === 0;

  return (
    <Button
      size="sm"
      className="csv-export-download global_btn rounded_full outline_primary"
      onPress={() => {
        if (isDisabled) return;
        exportRowsAsCsv(filename, columns, rows);
      }}
      isDisabled={isDisabled}
      startContent={<Download className="h-4 w-4" />}
      aria-label={ariaLabel ?? label}
      title={ariaLabel ?? label}
    >
      {label}
    </Button>
  );
}
