'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { type GridColDef } from '@mui/x-data-grid';
import { BarChart3, Edit2, Percent, RotateCcw, ShoppingBag, Tag, TicketPercent, Trash2, Wallet } from 'lucide-react';
import {
  useGetAdminAllCouponsQuery,
  useGetCouponPerformanceQuery,
  useDeleteCouponMutation,
  useRestoreCouponMutation,
} from '@/store/rtkQueries/couponApis';
import { COUPON_SCOPE_LABELS, COUPON_TYPE_LABELS } from '@/constants/coupon';
import { formatKes } from '@/constants/common';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { Badge } from '@/components/ui/badge';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { adminPanelClass, AdminStatCard } from '@/components/admin/layout/AdminContent';
import { cn } from '@/components/ui/utils';
import { AdminCouponsHeader } from './AdminCouponsHeader';
import { AdminCouponsSearch } from './AdminCouponsSearch';
import { MentorCouponPerformanceTab } from '@/components/admin/mentor/performance/MentorCouponPerformanceTab';
import toast from '@/utils/toast';
import { IAdminCouponEntity } from '@/types/coupon';
import { CouponModal } from './CouponModal';
import { AdminCouponsSkeleton, useAdminPageSkeleton } from '@/components/skeleton-loader/admin';

const COUPON_MODEL = 'Coupon';

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200!',
};

const SCOPE_BADGE_CLASS: Record<string, string> = {
  university: 'bg-sky-50 text-sky-700 border-sky-200!',
  event: 'bg-violet-50 text-violet-700 border-violet-200!',
  campaign: 'bg-amber-50 text-amber-700 border-amber-200!',
  normal: 'bg-slate-100 text-slate-600 border-slate-200!',
};

function formatCouponValue(coupon: IAdminCouponEntity): string {
  if (coupon.coupon_type === 'Free') return 'Free';
  if (coupon.coupon_type === 'Percentage') return `${coupon.value}%`;
  return `KES ${coupon.value?.toLocaleString?.() ?? coupon.value}`;
}

export function AdminCouponsTab() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [scopeFilter, setScopeFilter] = useState('');
  const [isTrashView, setIsTrashView] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [tab, setTab] = useState<'manage' | 'performance'>('manage');
  const { hasPermission } = useAdminPermissions();
  const showPerformance = !isTrashView && tab === 'performance';

  const canAdd = hasPermission(COUPON_MODEL, 'add');
  const canEdit = hasPermission(COUPON_MODEL, 'edit');
  const canDelete = hasPermission(COUPON_MODEL, 'delete');

  const debouncedSearch = useDebounce(search, 500);

  const { data: couponsResponse, isLoading } = useGetAdminAllCouponsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: debouncedSearch,
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(scopeFilter ? { type: scopeFilter } : {}),
    ...(isTrashView ? { isDeleted: true } : {}),
  });
  const { data: performanceResponse } = useGetCouponPerformanceQuery();
  const summary = performanceResponse?.data?.summary;

  const couponsData = couponsResponse?.data;
  const coupons = couponsData?.data ?? [];
  const totalCoupons = couponsData?.total ?? 0;

  const [deleteCoupon] = useDeleteCouponMutation();
  const [restoreCoupon] = useRestoreCouponMutation();

  const resetToFirstPage = () => setPaginationModel((prev) => ({ ...prev, page: 0 }));

  const handleSearchChange = (value: string) => {
    setSearch(value);
    resetToFirstPage();
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    resetToFirstPage();
  };

  const handleScopeChange = (value: string) => {
    setScopeFilter(value);
    resetToFirstPage();
  };

  const handleToggleTrash = () => {
    setIsTrashView((prev) => !prev);
    resetToFirstPage();
  };

  const onDeleteCoupon = async (id: string) => {
    try {
      const res = await deleteCoupon({ id }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? 'Coupon deleted successfully');
        dispatch(closeModal());
      }
    } catch (error) {
      console.error('Error deleting coupon', error);
    }
  };

  const onRestoreCoupon = async (id: string) => {
    try {
      const res = await restoreCoupon({ id }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? 'Coupon restored successfully');
        dispatch(closeModal());
      }
    } catch (error) {
      console.error('Error restoring coupon', error);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'index',
      headerName: '#',
      width: 60,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return (
          <span className="text-sm text-muted-foreground">
            {paginationModel.page * paginationModel.pageSize + rowIndex + 1}
          </span>
        );
      },
    },
    {
      field: 'coupon_code',
      headerName: 'Coupon',
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Tag className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm text-slate-900">{params.row.coupon_code}</p>
            <p className="text-xs text-slate-500">{COUPON_TYPE_LABELS[params.row.coupon_type as keyof typeof COUPON_TYPE_LABELS] ?? params.row.coupon_type}</p>
          </div>
        </div>
      ),
    },
    {
      field: 'coupon_for',
      headerName: 'Scope',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline" className={SCOPE_BADGE_CLASS[params.row.coupon_for] ?? 'border-slate-200 text-slate-600'}>
          {COUPON_SCOPE_LABELS[params.row.coupon_for as keyof typeof COUPON_SCOPE_LABELS] ?? params.row.coupon_for}
        </Badge>
      ),
    },
    {
      field: 'value',
      headerName: 'Value',
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm font-medium text-slate-900">{formatCouponValue(params.row)}</span>
      ),
    },
    {
      field: 'usage',
      headerName: 'Usage',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-600">
          {params.row.coupon_for === 'university'
            ? 'Unlimited'
            : `${params.row.used_count ?? 0}${params.row.usage_limit ? ` / ${params.row.usage_limit}` : ''}`}
        </span>
      ),
    },
    {
      field: 'expiry_date',
      headerName: 'Expires',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-500">
          {params.row.expiry_date
            ? new Date(params.row.expiry_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
            : '—'}
        </span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline" className={STATUS_BADGE_CLASS[params.row.status] ?? 'border-slate-200 text-slate-600'}>
          {params.row.status}
        </Badge>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => {
        if (isTrashView) {
          if (!canDelete) return null;
          return (
            <div className="action_buttons">
              <button
                type="button"
                className="active_button"
                title="Restore coupon"
                onClick={() =>
                  dispatch(
                    openModal({
                      componentName: 'RestoreConfirmation',
                      data: {
                        itemName: params.row.coupon_code,
                        onRestore: () => onRestoreCoupon(params.row._id),
                      },
                    }),
                  )
                }
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          );
        }
        if (!canEdit && !canDelete) return null;
        return (
          <div className="action_buttons">
            {canEdit ? (
              <button
                type="button"
                className="edit_button"
                title="Edit coupon"
                onClick={() => {
                  setEditingCoupon(params.row);
                  setIsModalOpen(true);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </button>
            ) : null}
            {canDelete ? (
              <button
                type="button"
                className="delete_button"
                title="Delete coupon"
                onClick={() =>
                  dispatch(
                    openModal({
                      componentName: 'DeleteConfirmation',
                      data: {
                        itemName: params.row.coupon_code,
                        onDelete: () => onDeleteCoupon(params.row._id),
                      },
                    }),
                  )
                }
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        );
      },
    },
  ];

  const showPageSkeleton = useAdminPageSkeleton(isLoading, Boolean(couponsResponse));
  if (showPageSkeleton) return <AdminCouponsSkeleton />;

  return (
    <div className="space-y-6">
      <AdminCouponsHeader
        isTrashView={isTrashView}
        onToggleTrash={handleToggleTrash}
        canAdd={canAdd}
        onCreateCoupon={() => {
          setEditingCoupon(null);
          setIsModalOpen(true);
        }}
      />

      {!isTrashView && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <AdminStatCard label="Total coupons" value={(summary?.total_coupons ?? 0).toLocaleString()} icon={TicketPercent} tone="blue" />
            <AdminStatCard label="Total redemptions" value={(summary?.total_redemptions ?? 0).toLocaleString()} icon={ShoppingBag} tone="green" />
            <AdminStatCard label="Discount given" value={formatKes(summary?.total_discount_given ?? 0)} icon={Percent} tone="purple" />
            <AdminStatCard label="Total revenue" value={formatKes(summary?.total_revenue ?? 0)} icon={Wallet} tone="orange" />
          </div>

          <div className={cn(adminPanelClass, 'flex flex-wrap gap-1 p-1.5')}>
            <button
              type="button"
              onClick={() => setTab('manage')}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all sm:flex-none',
                tab === 'manage' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )}
            >
              <Tag className="h-4 w-4 shrink-0" />
              Manage
            </button>
            <button
              type="button"
              onClick={() => setTab('performance')}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all sm:flex-none',
                tab === 'performance' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )}
            >
              <BarChart3 className="h-4 w-4 shrink-0" />
              Performance
            </button>
          </div>
        </>
      )}

      {showPerformance ? (
        <MentorCouponPerformanceTab hideHeader />
      ) : (
        <>
      <AdminCouponsSearch
        searchQuery={search}
        onSearchChange={handleSearchChange}
        selectedStatus={statusFilter}
        onStatusChange={handleStatusChange}
        selectedScope={scopeFilter}
        onScopeChange={handleScopeChange}
      />

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={coupons}
          columns={columns}
          getRowId={(row) => row._id}
          loading={isLoading}
          paginationMode="server"
          rowCount={totalCoupons}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>
        </>
      )}

      {canAdd || canEdit ? (
        <CouponModal
          open={isModalOpen}
          coupon={editingCoupon}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingCoupon(null);
          }}
        />
      ) : null}
    </div>
  );
}
