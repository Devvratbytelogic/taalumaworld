'use client';

import { useState } from 'react';
import moment from 'moment';
import { type GridColDef } from '@mui/x-data-grid';
import { Download } from 'lucide-react';
import { AdminPage, AdminPageHeader } from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetInboxQuery } from '@/store/rtkQueries/adminGetApi';
import type { InboxEntry, InboxEntryType, InboxTypeFilter } from '@/types/inbox';
import { API_BASE_URL } from '@/utils/config';
import { authFetch } from '@/utils/refreshSession';
import { formatConsentType } from '@/utils/agreementConsent';
import { validateEmail } from '@/utils/formValidation';
import toast from '@/utils/toast';
import { AdminInboxSearch } from './AdminInboxSearch';
import { AdminInboxSkeleton } from '@/components/skeleton-loader/admin';

const INBOX_TYPE_LABELS: Record<InboxEntryType, string> = {
  newsletter: 'Newsletter',
  contact_us: 'Contact Us',
};

function filenameFromDisposition(header: string | null, fallback: string): string {
  if (!header) return fallback;
  const star = /filename\*=(?:UTF-8'')?([^;]+)/i.exec(header);
  if (star?.[1]) {
    try {
      return decodeURIComponent(star[1].trim().replace(/^"(.*)"$/, '$1'));
    } catch {
      return star[1].trim().replace(/^"(.*)"$/, '$1');
    }
  }
  const quoted = /filename="([^"]+)"/i.exec(header);
  if (quoted?.[1]) return quoted[1];
  const plain = /filename=([^;]+)/i.exec(header);
  if (plain?.[1]) return plain[1].trim();
  return fallback;
}

export function AdminInboxTab() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<InboxTypeFilter>('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [isExporting, setIsExporting] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const listParams = {
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(typeFilter !== 'all' ? { type: typeFilter } : {}),
    ...(fromDate ? { fromDate } : {}),
    ...(toDate ? { toDate } : {}),
  };

  const { data, isLoading, isFetching } = useGetInboxQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...listParams,
  });

  const rows = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
  const loading = isLoading || isFetching;

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const handleExportCsv = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      Object.entries(listParams).forEach(([key, value]) => {
        if (value === undefined || value === '') return;
        params.set(key, String(value));
      });
      params.set('export', 'csv');

      const res = await authFetch(`${API_BASE_URL}/admin/inbox?${params.toString()}`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filenameFromDisposition(
        res.headers.get('Content-Disposition'),
        `inbox-${Date.now()}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Inbox exported');
    } catch {
      toast.error('Failed to export inbox');
    } finally {
      setIsExporting(false);
    }
  };

  const columns: GridColDef<InboxEntry>[] = [
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 220,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const email = params.row.email ?? '';
        if (!validateEmail(email)) {
          return (
            <span className="truncate text-red-600" title="This stored value is not a valid email address">
              {email || '—'}
            </span>
          );
        }
        return (
          <a href={`mailto:${email}`} className="truncate text-primary hover:underline">
            {email}
          </a>
        );
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 160,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <p className="truncate text-sm font-medium">{params.row.name?.trim() || '—'}</p>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const type = params.row.type;
        const isNewsletter = type === 'newsletter';
        return (
          <Badge
            className={
              isNewsletter
                ? 'border-emerald-200! bg-emerald-100 text-emerald-700'
                : 'border-sky-200! bg-sky-100 text-sky-700'
            }
          >
            {INBOX_TYPE_LABELS[type] ?? type}
          </Badge>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      minWidth: 180,
      sortable: false,
      renderCell: (params) => (
        <p className="whitespace-nowrap text-sm text-muted-foreground">
          {params.row.createdAt ? moment(params.row.createdAt).format('MMM D, YYYY h:mm A') : '—'}
        </p>
      ),
    },
    {
      field: 'consent_type',
      headerName: 'Consent',
      minWidth: 260,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <p className="whitespace-normal text-sm text-muted-foreground">
          {formatConsentType(params.row.consent_type)}
        </p>
      ),
    },
  ];

  if (isLoading) {
    return (
      <AdminPage>
        <AdminPageHeader
          eyebrow="Community"
          title="Inbox"
          description="Newsletter subscribers and contact-us submissions in one list."
        >
          <Button
            className="global_btn rounded_full bg_primary"
            onPress={handleExportCsv}
            isDisabled={isExporting}
            isLoading={isExporting}
            startContent={!isExporting ? <Download className="h-4 w-4" /> : undefined}
          >
            Export CSV
          </Button>
        </AdminPageHeader>
        <AdminInboxSkeleton />
      </AdminPage>
    );
  }

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Community"
        title="Inbox"
        description="Newsletter subscribers and contact-us submissions in one list."
      >
        <Button
          className="global_btn rounded_full bg_primary"
          onPress={handleExportCsv}
          isDisabled={isExporting}
          isLoading={isExporting}
          startContent={!isExporting ? <Download className="h-4 w-4" /> : undefined}
        >
          Export CSV
        </Button>
      </AdminPageHeader>

      <AdminInboxSearch
        searchQuery={search}
        onSearchChange={(value) => {
          setSearch(value);
          resetToFirstPage();
        }}
        typeFilter={typeFilter}
        onTypeFilterChange={(value) => {
          setTypeFilter(value);
          resetToFirstPage();
        }}
        fromDate={fromDate}
        onFromDateChange={(value) => {
          setFromDate(value);
          resetToFirstPage();
        }}
        toDate={toDate}
        onToDateChange={(value) => {
          setToDate(value);
          resetToFirstPage();
        }}
      />

      <div className="overflow-hidden rounded-md border border-gray-200">
        <CommonDataTable
          rows={rows}
          columns={columns}
          getRowId={(row) => `${row.type}-${row._id}`}
          loading={loading}
          paginationMode="server"
          rowCount={total}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>
    </AdminPage>
  );
}
