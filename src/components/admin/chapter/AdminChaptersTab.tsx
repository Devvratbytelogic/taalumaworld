'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { type GridColDef } from '@mui/x-data-grid';
import { Eye, Edit2, Trash2, RotateCcw, ChevronDown, Loader2, Flag } from 'lucide-react';
import { useGetAllAdminChaptersQuery, useGetAllBooksQuery } from '@/store/rtkQueries/adminGetApi';
import { useDeleteChapterMutation, useUpdateChapterMutation, useRestoreChapterMutation, } from '@/store/rtkQueries/adminPostApi';
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
import { BLUEPRINT_STATUSES, BLUEPRINT_STATUS_CONFIG, type BlueprintStatus } from '@/constants/blueprint';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';

const STATUS_CONFIG = BLUEPRINT_STATUS_CONFIG;
const STATUSES = BLUEPRINT_STATUSES;

export function AdminChaptersTab() {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isMentor = pathname.startsWith(getMentorRoutePath());
    const { isSuperAdmin } = useAdminPermissions();
    const [search, setSearch] = useState('');
    const [filterByBook, setFilterByBook] = useState('');
    const [filterByStatus, setFilterByStatus] = useState('');
    const [isTrashView, setIsTrashView] = useState(false);
    const [filterByIsMine, setFilterByIsMine] = useState(false);
    const [filterByContentFlagged, setFilterByContentFlagged] = useState(
        () => searchParams.get('isContentFlagged') === 'true',
    );
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        setFilterByContentFlagged(searchParams.get('isContentFlagged') === 'true');
    }, [searchParams]);

    const handleContentFlaggedChange = (value: boolean) => {
        setFilterByContentFlagged(value);
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('isContentFlagged', 'true');
        } else {
            params.delete('isContentFlagged');
        }
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    };

    const { data: chaptersResponse, isLoading } = useGetAllAdminChaptersQuery({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: debouncedSearch,
        ...(filterByBook ? { book_id: filterByBook } : {}),
        ...(filterByStatus ? { status: filterByStatus } : {}),
        ...(isTrashView ? { isDeleted: true } : {}),
        ...(isSuperAdmin && filterByIsMine ? { isMine: true } : {}),
        ...(filterByContentFlagged ? { isContentFlagged: true } : {}),
    });

    const { data: booksResponse } = useGetAllBooksQuery();
    const bookOptions = (booksResponse?.data?.data ?? []).map((b) => ({ id: b._id ?? b.id, title: b.title }));

    const chaptersData = chaptersResponse?.data;
    const chapters = chaptersData?.data ?? [];
    const totalChapters = chaptersData?.total ?? 0;

    const [deleteChapter] = useDeleteChapterMutation();
    const [updateChapter] = useUpdateChapterMutation();
    const [restoreChapter] = useRestoreChapterMutation();

    useEffect(() => {
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
    }, [debouncedSearch, filterByBook, filterByStatus, isTrashView, filterByIsMine, filterByContentFlagged]);

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

    const handleStatusChange = async (chapter: IChapter, status: BlueprintStatus) => {
        if (status === chapter.status || updatingId) return;
        if (status === 'Published' && !chapter.isPublishAllowed) {
            toast.error('This blueprint cannot be published yet');
            return;
        }
        if (chapter.isPublishAllowed && (status === 'Pending' || status === 'Review')) {
            toast.error('Pending and Review are unavailable once publishing is allowed');
            return;
        }

        const formData = new FormData();
        formData.append('status', status);
        setUpdatingId(chapter.id);

        try {
            const res = await updateChapter({ id: chapter.id, values: formData }).unwrap();
            if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                toast.success(res.message ?? `Blueprint marked as ${status}`);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    const columns: GridColDef<IChapter>[] = [
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
                        <p className="font-medium text-sm whitespace-nowrap flex items-center gap-1.5">
                            {params.row.title}
                            {params.row.isContentFlagged ? (
                                <span title={params.row.contentFlagDetails ?? 'Content flagged'}>
                                    <Flag className="h-3.5 w-3.5 text-red-500 shrink-0" />
                                </span>
                            ) : null}
                        </p>
                        {params.row.short_code ? (
                            <p className="text-xs text-muted-foreground font-mono">{params.row.slug}</p>
                        ) : null}
                    </div>
                </div>
            ),
        },
        {
            field: 'series',
            headerName: 'Series',
            minWidth: 160,
            sortable: false,
            valueGetter: (_value, row) => row.series?.title ?? 'N/A',
            renderCell: (params) => (
                <span className="text-sm whitespace-nowrap">{params.value}</span>
            ),
        },
        {
            field: 'createdBy',
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
                    {params.row.isFree ? 'Free' : `KSH ${Number(params.row.price ?? 0).toFixed(2)}`}
                </span>
            ),
        },
        {
            field: 'aiScore',
            headerName: 'AI Score',
            width: 110,
            sortable: false,
            renderCell: (params) => {
                const score = params.row.aiScore;
                const scoringStatus = params.row.aiScoringStatus;
                if (score == null) {
                    return (
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {scoringStatus && scoringStatus !== 'completed' ? scoringStatus : '—'}
                        </span>
                    );
                }
                return (
                    <span className="text-sm font-medium whitespace-nowrap" title={params.row.aiClassification ?? undefined}>
                        {score}
                        {params.row.aiClassification ? (
                            <span className="block text-xs text-muted-foreground font-normal truncate max-w-24">
                                {params.row.aiClassification}
                            </span>
                        ) : null}
                    </span>
                );
            },
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            sortable: false,
            renderCell: (params) => {
                const chapter = params.row;
                const config = STATUS_CONFIG[chapter.status as BlueprintStatus] ?? STATUS_CONFIG.Draft;
                const canPublish = chapter.isPublishAllowed;

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
                        <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                                Change status
                            </DropdownMenuLabel>
                            {!canPublish ? (
                                <p className="px-2 pb-1 text-[11px] text-amber-600">
                                    Publishing not allowed yet
                                </p>
                            ) : (
                                <p className="px-2 pb-1 text-[11px] text-muted-foreground">
                                    Pending and Review unavailable
                                </p>
                            )}
                            <DropdownMenuSeparator />
                            {STATUSES.map((s) => {
                                const publishBlocked = s === 'Published' && !canPublish;
                                const reviewBlocked = canPublish && (s === 'Pending' || s === 'Review');
                                return (
                                    <DropdownMenuItem
                                        key={s}
                                        onSelect={() => handleStatusChange(chapter, s)}
                                        className="flex items-center gap-2"
                                        disabled={chapter.status === s || publishBlocked || reviewBlocked}
                                    >
                                        <span className={`h-2 w-2 rounded-full ${STATUS_CONFIG[s].dot}`} />
                                        {STATUS_CONFIG[s].label}
                                        {chapter.status === s ? (
                                            <span className="ml-auto text-xs text-muted-foreground">current</span>
                                        ) : null}
                                    </DropdownMenuItem>
                                );
                            })}
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
                    {params.row.isMine &&
                        <>
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
                        </>}
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
                isContentFlagged={filterByContentFlagged}
                onContentFlaggedChange={handleContentFlaggedChange}
                showMineFilter={isSuperAdmin}
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
