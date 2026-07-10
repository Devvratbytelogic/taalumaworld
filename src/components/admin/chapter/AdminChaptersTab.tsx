'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { type GridColDef } from '@mui/x-data-grid';
import { Eye, Edit2, Trash2, ChevronDown, Loader2 } from 'lucide-react';
import { useGetAllAdminChaptersQuery } from '@/store/rtkQueries/adminGetApi';
import { useDeleteChapterMutation, useUpdateChapterMutation } from '@/store/rtkQueries/adminPostApi';
import type { IAllChaptersAPIResponseData } from '@/types/chapter';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { AdminSearchInput } from '@/components/admin/layout/AdminContent';
import { useDebounce } from '@/hooks/useDebounce';
import CommonDataTable from '../CommonDataTable';
import { AdminChaptersHeader } from './AdminChaptersHeader';
import { ChapterPreviewModal } from './ChapterPreviewModal';
import ImageComponent from '@/components/ui/ImageComponent';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getEditChapterRoutePath } from '@/routes/routes';
import toast from '@/utils/toast';

const STATUS_CONFIG: Record<string, { badge: string; dot: string; label: string }> = {
    Published: {
        badge: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
        dot: 'bg-green-500',
        label: 'Published',
    },
    Draft: {
        badge: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
        dot: 'bg-yellow-500',
        label: 'Draft',
    },
};

const STATUSES = ['Published', 'Draft'] as const;

export function AdminChaptersTab() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [filterByBook, setFilterByBook] = useState<string | null>(null);
    const [filterByStatus, setFilterByStatus] = useState<string | null>(null);
    const [filterByIsDeleted, setFilterByIsDeleted] = useState<boolean | null>(null);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [previewChapter, setPreviewChapter] = useState<IAllChaptersAPIResponseData | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const debouncedSearch = useDebounce(search, 500);

    const { data: chaptersResponse, isLoading } = useGetAllAdminChaptersQuery({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: debouncedSearch,
        book_id: filterByBook,
        status: filterByStatus,
        isDeleted: filterByIsDeleted,
    });

    const chapters = chaptersResponse?.data ?? [];
    const totalChapters =
        chapters.length < paginationModel.pageSize
            ? paginationModel.page * paginationModel.pageSize + chapters.length
            : (paginationModel.page + 1) * paginationModel.pageSize + 1;

    const [deleteChapter] = useDeleteChapterMutation();
    const [updateChapter] = useUpdateChapterMutation();

    useEffect(() => {
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, [debouncedSearch]);

    const onDeleteChapter = async (id: string) => {
        try {
            await deleteChapter({ id }).unwrap();
            toast.success('Blueprint deleted successfully');
            dispatch(closeModal());
        } catch (error) {
            console.error('Error deleting chapter:', error);
        }
    };

    const handleStatusChange = async (chapter: IAllChaptersAPIResponseData, status: string) => {
        if (status === chapter.status || updatingId) return;

        const formData = new FormData();
        formData.append('status', status);
        setUpdatingId(chapter.id);

        try {
            await updateChapter({ id: chapter.id, values: formData }).unwrap();
            toast.success(`Blueprint marked as ${status}`);
        } catch {
            toast.error('Failed to update status');
        } finally {
            setUpdatingId(null);
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
            field: 'title',
            headerName: 'Blueprint Title',
            minWidth: 240,
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted shrink-0 overflow-hidden">
                        {params.row.coverImage ? (
                            <ImageComponent
                                src={params.row.coverImage}
                                alt={params.row.title}
                                object_cover={true}
                            />
                        ) : null}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-sm whitespace-nowrap">{params.row.title}</p>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                            Blueprint {params.row.number}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            field: 'book',
            headerName: 'Series',
            minWidth: 160,
            sortable: false,
            valueGetter: (_value, row) => row.book?.title ?? 'N/A',
            renderCell: (params) => (
                <span className="text-sm whitespace-nowrap">{params.value}</span>
            ),
        },
        {
            field: 'mentor',
            headerName: 'Mentor',
            minWidth: 160,
            sortable: false,
            valueGetter: (_value, row) => row.book?.thoughtLeader?.fullName ?? 'Unknown',
            renderCell: (params) => (
                <span className="text-sm whitespace-nowrap">{params.value}</span>
            ),
        },
        {
            field: 'price',
            headerName: 'Price',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <span className="text-sm font-semibold text-primary whitespace-nowrap">
                    KSH {Number(params.value).toFixed(2)}
                </span>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            sortable: false,
            renderCell: (params) => {
                const chapter = params.row as IAllChaptersAPIResponseData;
                const config = STATUS_CONFIG[chapter.status] ?? STATUS_CONFIG.Draft;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild disabled={!!updatingId}>
                            <button type="button" className="focus:outline-none">
                                <Badge
                                    variant="outline"
                                    className={`cursor-pointer select-none transition-colors flex items-center gap-1.5 ${config.badge}`}
                                >
                                    {updatingId === chapter.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                                    )}
                                    {chapter.status}
                                    <ChevronDown className="h-3 w-3 opacity-60" />
                                </Badge>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40">
                            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                                Change status
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {STATUSES.map((s) => (
                                <DropdownMenuItem
                                    key={s}
                                    onSelect={() => handleStatusChange(chapter, s)}
                                    className="flex items-center gap-2"
                                    disabled={chapter.status === s}
                                >
                                    <span className={`h-2 w-2 rounded-full ${STATUS_CONFIG[s].dot}`} />
                                    {STATUS_CONFIG[s].label}
                                    {chapter.status === s ? (
                                        <span className="ml-auto text-xs text-muted-foreground">current</span>
                                    ) : null}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <div className="action_buttons">
                    <button
                        type="button"
                        className="edit_button"
                        onClick={() => setPreviewChapter(params.row)}
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        className="edit_button"
                        onClick={() => router.push(getEditChapterRoutePath(params.row.id))}
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        className="delete_button"
                        onClick={() => dispatch(openModal({
                            componentName: 'DeleteConfirmation',
                            data: {
                                itemName: params.row.title,
                                onDelete: () => onDeleteChapter(params.row.id),
                            },
                        }))}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <AdminChaptersHeader />

            <AdminSearchInput
                placeholder="Search blueprints..."
                value={search}
                onChange={setSearch}
            />

            <div className="border border-gray-200 rounded-md overflow-hidden">
                <CommonDataTable
                    rows={chapters}
                    columns={columns}
                    getRowId={(row) => row.id ?? row._id}
                    loading={isLoading}
                    paginationMode="server"
                    rowCount={totalChapters}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                />
            </div>

            <ChapterPreviewModal
                chapter={previewChapter}
                open={!!previewChapter}
                onOpenChange={(open) => !open && setPreviewChapter(null)}
            />
        </div>
    );
}
