'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { type GridColDef } from '@mui/x-data-grid';
import { Eye, Edit2, Trash2, RotateCcw, ChevronDown, Loader2 } from 'lucide-react';
import { useGetAllAdminChaptersQuery, useGetAllBooksQuery } from '@/store/rtkQueries/adminGetApi';
import {
    useDeleteChapterMutation,
    useUpdateChapterMutation,
    useRestoreChapterMutation,
} from '@/store/rtkQueries/adminPostApi';
import type { IChapter } from '@/types/chapter';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { useDebounce } from '@/hooks/useDebounce';
import CommonDataTable from '../CommonDataTable';
import { AdminChaptersHeader } from './AdminChaptersHeader';
import { AdminChaptersSearch } from './AdminChaptersSearch';
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
import { getEditChapterRoutePath, getViewChapterRoutePath, getMentorRoutePath } from '@/routes/routes';
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
    const pathname = usePathname();
    const isMentor = pathname.startsWith(getMentorRoutePath());
    const [search, setSearch] = useState('');
    const [filterByBook, setFilterByBook] = useState('');
    const [filterByStatus, setFilterByStatus] = useState('');
    const [isTrashView, setIsTrashView] = useState(false);
    const [filterByIsMine, setFilterByIsMine] = useState(false);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const debouncedSearch = useDebounce(search, 500);

    const { data: chaptersResponse, isLoading } = useGetAllAdminChaptersQuery({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: debouncedSearch,
        ...(filterByBook ? { book_id: filterByBook } : {}),
        ...(filterByStatus ? { status: filterByStatus } : {}),
        ...(isTrashView ? { isDeleted: true } : {}),
        ...(filterByIsMine ? { isMine: true } : {}),
    });

    const { data: booksResponse } = useGetAllBooksQuery();
    const bookOptions = (booksResponse?.data?.data ?? []).map((b) => ({ id: b._id ?? b.id, title: b.title }));

    const chaptersData = chaptersResponse?.data;
    
    const chapters = chaptersData?.data ?? [];
    console.log('chapters', chapters);
    const totalChapters = chaptersData?.total ?? 0;

    const [deleteChapter] = useDeleteChapterMutation();
    const [updateChapter] = useUpdateChapterMutation();
    const [restoreChapter] = useRestoreChapterMutation();

    useEffect(() => {
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, [debouncedSearch, filterByBook, filterByStatus, isTrashView, filterByIsMine]);

    const onDeleteChapter = async (id: string) => {
        try {
            const res = await deleteChapter({ id }).unwrap();
            if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                toast.success(res.message ?? 'Blueprint deleted successfully');
                dispatch(closeModal());
            }
        } catch (error) {
            console.error('Error deleting chapter:', error);
        }
    };

    const onRestoreChapter = async (id: string) => {
        try {
            const res = await restoreChapter({ id }).unwrap();
            if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                toast.success(res.message ?? 'Blueprint restored successfully');
                dispatch(closeModal());
            }
        } catch (error) {
            console.error('Error restoring chapter:', error);
        }
    };

    const handleStatusChange = async (chapter: IChapter, status: string) => {
        if (status === chapter.status || updatingId) return;

        const formData = new FormData();
        formData.append('status', status);
        setUpdatingId(chapter.id);

        try {
            const res = await updateChapter({ id: chapter.id, values: formData }).unwrap();
            if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                toast.success(res.message ?? `Blueprint marked as ${status}`);
            }
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
                    <div className="h-10 w-10 rounded-md bg-muted shrink-0 overflow-hidden">
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
                    </div>
                </div>
            ),
        },
        {
            field: 'book',
            headerName: 'Series',
            minWidth: 160,
            sortable: false,
            valueGetter: (_value, row) => row.series?.title ?? 'N/A',
            renderCell: (params) => (
                <span className="text-sm whitespace-nowrap">{params.value}</span>
            ),
        },
        {
            field: 'mentor',
            headerName: 'Mentor',
            minWidth: 160,
            sortable: false,
            valueGetter: (_value, row) => row.createdBy?.name ?? 'Unknown',
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
                const chapter = params.row ;
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
                        className="active_button"
                        title="View blueprint"
                        onClick={() => router.push(getViewChapterRoutePath(params.row.id, isMentor))}
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    {isTrashView ? (
                        <button
                            type="button"
                            className="active_button"
                            title="Restore blueprint"
                            onClick={() => dispatch(openModal({
                                componentName: 'RestoreConfirmation',
                                data: {
                                    itemName: params.row.title,
                                    onRestore: () => onRestoreChapter(params.row.id),
                                },
                            }))}
                        >
                            <RotateCcw className="h-4 w-4" />
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="edit_button"
                                onClick={() => router.push(getEditChapterRoutePath(params.row.id, isMentor))}
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
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <AdminChaptersHeader
                isTrashView={isTrashView}
                onToggleTrash={() => setIsTrashView((prev) => !prev)}
            />

            <AdminChaptersSearch
                searchQuery={search}
                onSearchChange={setSearch}
                books={bookOptions}
                selectedBook={filterByBook}
                onBookChange={setFilterByBook}
                selectedStatus={filterByStatus}
                onStatusChange={setFilterByStatus}
                isMine={filterByIsMine}
                onIsMineChange={setFilterByIsMine}
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
        </div>
    );
}
