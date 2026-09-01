'use client';

import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { type GridColDef } from '@mui/x-data-grid';
import { Edit2, Quote, Trash2 } from 'lucide-react';
import {
  useGetAllAgreementSentencesQuery,
  useAddAgreementSentenceMutation,
  useUpdateAgreementSentenceMutation,
  useDeleteAgreementSentenceMutation,
  useGetAllAgreementTypesQuery,
} from '@/store/rtkQueries/agreementAPIs';
import type { IAgreementSentenceEntity, IAgreementSentenceLink, IAgreementsByTouchpointData } from '@/types/agreements';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { Badge } from '@/components/ui/badge';
import CommonDataTable from '@/components/admin/CommonDataTable';
import { AdminSentencesHeader } from './AdminSentencesHeader';
import { AdminSentencesSearch } from './AdminSentencesSearch';
import { SentenceModal, type SentenceFormValues } from './SentenceModal';
import toast from '@/utils/toast';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import { AGREEMENT_TOUCHPOINT_OPTIONS } from '@/constants/agreements';

const SENTENCES_MODEL = 'Agreements';

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200!',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200!',
};

function normalizeSentences(data: IAgreementSentenceEntity[] | IAgreementsByTouchpointData | undefined): IAgreementSentenceEntity[] {
  if (!data) return [];
  return Array.isArray(data) ? data : (data.sentences ?? []);
}

function getLinkTypeName(link: IAgreementSentenceLink): string {
  if (typeof link.agreementType === 'object' && link.agreementType?.name) return link.agreementType.name;
  return link.agreement?.agreement_type?.name ?? link.agreement?.title ?? '';
}

export function AdminSentencesTab() {
  const dispatch = useDispatch();
  const [touchpointFilter, setTouchpointFilter] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSentence, setEditingSentence] = useState<IAgreementSentenceEntity | null>(null);
  const { hasPermission } = useAdminPermissions();

  const canAdd = hasPermission(SENTENCES_MODEL, 'add');
  const canEdit = hasPermission(SENTENCES_MODEL, 'edit');
  const canDelete = hasPermission(SENTENCES_MODEL, 'delete');

  const { data: agreementTypesResponse } = useGetAllAgreementTypesQuery({ limit: 100, status: 'active' });
  const agreementTypeOptions = useMemo(
    () => (agreementTypesResponse?.data?.data ?? []).map((type) => ({ value: type._id, label: type.name })),
    [agreementTypesResponse],
  );

  const { data: sentencesResponse, isLoading } = useGetAllAgreementSentencesQuery(
    touchpointFilter ? { touchpoint: touchpointFilter } : undefined,
  );
  const sentences = normalizeSentences(sentencesResponse?.data);
  const totalSentences = sentences.length;
  const pagedSentences = sentences.slice(
    paginationModel.page * paginationModel.pageSize,
    paginationModel.page * paginationModel.pageSize + paginationModel.pageSize,
  );

  const [addSentence] = useAddAgreementSentenceMutation();
  const [updateSentence] = useUpdateAgreementSentenceMutation();
  const [deleteSentence] = useDeleteAgreementSentenceMutation();

  const handleTouchpointChange = (value: string) => {
    setTouchpointFilter(value);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  };

  const handleSave = async (values: SentenceFormValues, id?: string) => {
    try {
      const payload = {
        text: values.text,
        touchpoint: values.touchpoint,
        is_required: values.is_required,
        sort_order: Number(values.sort_order) || 0,
        links: values.links.map((link) => ({
          phrase: link.phrase,
          agreementType: link.agreementType,
        })),
        ...(id ? { status: values.status } : {}),
      };
      const res = id
        ? await updateSentence({ id, values: payload }).unwrap()
        : await addSentence(payload).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? (id ? 'Sentence updated successfully' : 'Sentence created successfully'));
        setIsModalOpen(false);
        setEditingSentence(null);
      }
    } catch (error) {
      console.error('Error saving sentence', error);
    }
  };

  const onDeleteSentence = async (id: string) => {
    try {
      const res = await deleteSentence({ id }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? 'Sentence deleted successfully');
        dispatch(closeModal());
      }
    } catch (error) {
      console.error('Error deleting sentence', error);
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
      field: 'text',
      headerName: 'Sentence text',
      minWidth: 260,
      flex: 1.4,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Quote className="h-4 w-4 text-primary" />
          </div>
          <p className="truncate text-sm font-medium text-slate-900" title={params.row.text}>
            {params.row.text}
          </p>
        </div>
      ),
    },
    {
      field: 'touchpoint',
      headerName: 'Touchpoint',
      minWidth: 180,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => (
        <span className="text-sm text-slate-700">
          {AGREEMENT_TOUCHPOINT_OPTIONS.find((opt) => opt.value === params.row.touchpoint)?.label ?? params.row.touchpoint}
        </span>
      ),
    },
    {
      field: 'is_required',
      headerName: 'Required',
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline" className={params.row.is_required ? STATUS_BADGE_CLASS.active : STATUS_BADGE_CLASS.inactive}>
          {params.row.is_required ? 'Required' : 'Optional'}
        </Badge>
      ),
    },
    {
      field: 'links',
      headerName: 'Linked phrases',
      minWidth: 240,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="flex flex-wrap gap-1 py-1">
          {(params.row.links ?? []).length ? (
            (params.row.links ?? []).map((link: IAgreementSentenceLink, index: number) => (
              <Badge key={`${link.phrase}-${index}`} variant="outline" className="border-slate-200 text-slate-600">
                {link.phrase}
                {getLinkTypeName(link) ? ` → ${getLinkTypeName(link)}` : ''}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-slate-400">None</span>
          )}
        </div>
      ),
    },
    {
      field: 'sort_order',
      headerName: 'Sort',
      width: 80,
      sortable: false,
      renderCell: (params) => <span className="text-sm text-slate-700">{params.row.sort_order ?? 0}</span>,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Badge variant="outline" className={STATUS_BADGE_CLASS[params.row.status] ?? 'border-slate-200 text-slate-600'}>
          {params.row.status ?? 'active'}
        </Badge>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => {
        if (!canEdit && !canDelete) return null;
        return (
          <div className="action_buttons">
            {canEdit ? (
              <button
                type="button"
                className="edit_button"
                title="Edit sentence"
                onClick={() => {
                  setEditingSentence(params.row);
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
                title="Delete sentence"
                onClick={() =>
                  dispatch(
                    openModal({
                      componentName: 'DeleteConfirmation',
                      data: {
                        itemName: params.row.text,
                        onDelete: () => onDeleteSentence(params.row._id),
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

  return (
    <div className="space-y-6">
      <AdminSentencesHeader
        canAdd={canAdd}
        onCreateSentence={() => {
          setEditingSentence(null);
          setIsModalOpen(true);
        }}
      />

      <AdminSentencesSearch selectedTouchpoint={touchpointFilter} onTouchpointChange={handleTouchpointChange} />

      <div className="border border-gray-200 rounded-md overflow-hidden">
        <CommonDataTable
          rows={pagedSentences}
          columns={columns}
          getRowId={(row) => row._id}
          loading={isLoading}
          paginationMode="server"
          rowCount={totalSentences}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </div>

      {(canAdd || canEdit) ? (
        <SentenceModal
          open={isModalOpen}
          sentence={editingSentence}
          agreementTypeOptions={agreementTypeOptions}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingSentence(null);
          }}
          onSubmit={handleSave}
        />
      ) : null}
    </div>
  );
}
