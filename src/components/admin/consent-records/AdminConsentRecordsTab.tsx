'use client';

import { useMemo, useState } from 'react';
import moment from 'moment';
import { type GridColDef } from '@mui/x-data-grid';
import { Download, FileSignature, UserRound, Users } from 'lucide-react';
import { AdminPage, AdminPageHeader, AdminStatCard } from '@/components/admin/layout/AdminContent';
import CommonDataTable from '@/components/admin/CommonDataTable';
import Button from '@/components/ui/Button';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetAllAgreementTypesQuery, useGetConsentRecordsQuery } from '@/store/rtkQueries/agreementAPIs';
import type { IConsentRecord } from '@/types/consentRecords';
import { API_BASE_URL } from '@/utils/config';
import { authFetch } from '@/utils/refreshSession';
import toast from '@/utils/toast';
import { AdminConsentRecordsSearch } from './AdminConsentRecordsSearch';

export function AdminConsentRecordsTab() {
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [agreementTypeId, setAgreementTypeId] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [isExporting, setIsExporting] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const { data: typesResponse } = useGetAllAgreementTypesQuery({ limit: 10, status: 'active' });
  const agreementTypeOptions = useMemo(
    () => (typesResponse?.data?.data ?? []).map((type) => ({ value: type._id, label: type.name })),
    [typesResponse],
  );

  const listParams = {
    ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
    ...(fromDate ? { fromDate } : {}),
    ...(toDate ? { toDate } : {}),
    ...(agreementTypeId ? { agreement_type: agreementTypeId } : {}),
  };

  const { data, isLoading, isFetching } = useGetConsentRecordsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    ...listParams,
  });

  const summary = data?.data?.summary;
  const records = data?.data?.data?.data ?? [];
  const total = data?.data?.data?.total ?? 0;

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const handleExportCsv = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      Object.entries(listParams).forEach(([key, value]) => params.set(key, value));
      params.set('export', 'csv');

      const res = await authFetch(`${API_BASE_URL}/admin/consent-records?${params.toString()}`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'consent-records.csv';
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Consent records exported');
    } catch {
      toast.error('Failed to export consent records');
    } finally {
      setIsExporting(false);
    }
  };

  const columns: GridColDef<IConsentRecord>[] = [
    {
      field: 'user',
      headerName: 'Person',
      minWidth: 220,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">
            {params.row.user?.name || params.row.guest_email || '—'}
          </p>
          <p className="truncate text-xs text-slate-500">
            {params.row.user?.email || params.row.guest_email || '—'}
            {params.row.user?.role ? ` · ${params.row.user.role}` : ''}
          </p>
        </div>
      ),
    },
    {
      field: 'title',
      headerName: 'Agreement',
      minWidth: 220,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{params.row.title || '—'}</p>
          <p className="truncate text-xs text-slate-500">{params.row.agreement_type?.name || '—'}</p>
        </div>
      ),
    },
    {
      field: 'version',
      headerName: 'Version',
      width: 100,
      sortable: false,
    },
    {
      field: 'accepted_at',
      headerName: 'Accepted',
      minWidth: 180,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm whitespace-nowrap text-slate-600">
          {params.row.accepted_at ? moment(params.row.accepted_at).format('MMM D, YYYY h:mm A') : '—'}
        </span>
      ),
    },
  ];

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Legal"
        title="Consent records"
        description="Which agreement version each person accepted, and when."
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard label="Total records" value={summary?.total ?? 0} icon={FileSignature} />
        <AdminStatCard label="Users" value={summary?.users ?? 0} icon={Users} tone="green" />
        <AdminStatCard label="Guests" value={summary?.guests ?? 0} icon={UserRound} tone="orange" />
      </div>

      <AdminConsentRecordsSearch
        searchQuery={search}
        onSearchChange={(value) => {
          setSearch(value);
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
        agreementTypeId={agreementTypeId}
        onAgreementTypeChange={(value) => {
          setAgreementTypeId(value);
          resetToFirstPage();
        }}
        agreementTypeOptions={agreementTypeOptions}
      />

      <div className="overflow-hidden rounded-md border border-gray-200">
        <CommonDataTable
          rows={records}
          columns={columns}
          getRowId={(row) => row.id}
          loading={isLoading || isFetching}
          paginationMode="server"
          rowCount={total}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>
    </AdminPage>
  );
}
