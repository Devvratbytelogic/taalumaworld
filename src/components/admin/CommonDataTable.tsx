import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import React from 'react'

function isSerialColumn(column: GridColDef) {
    return column.field === 'index' || column.headerName === '#';
}

function isActionsColumn(column: GridColDef) {
    return column.field === 'actions';
}

/** Keep action buttons immediately after the serial (#) column on every admin table. */
function placeActionsAfterSerial(columns: GridColDef[]): GridColDef[] {
    const actionColumns = columns.filter(isActionsColumn);
    if (actionColumns.length === 0) return columns;

    const rest = columns.filter((column) => !isActionsColumn(column));
    const serialIndex = rest.findIndex(isSerialColumn);
    const insertAt = serialIndex === -1 ? 0 : serialIndex + 1;

    return [...rest.slice(0, insertAt), ...actionColumns, ...rest.slice(insertAt)];
}

type CommonDataTableProps = {
    rows: any[];
    columns: GridColDef[];
    getRowId: (row: any) => string;
    loading: boolean;
    paginationModel: GridPaginationModel;
    onPaginationModelChange: (model: GridPaginationModel) => void;
    hideFooter?: boolean;
    pageSizeOptions?: number[];
    compact?: boolean;
} & (
    | { paginationMode: 'client'; rowCount?: never }
    | { paginationMode: 'server'; rowCount: number }
);

export default function CommonDataTable({
    rows,
    columns,
    getRowId,
    loading,
    paginationMode,
    rowCount,
    paginationModel,
    onPaginationModelChange,
    hideFooter = false,
    pageSizeOptions = [2, 25, 50],
    compact = false,
}: CommonDataTableProps) {
    return (
        <DataGrid
            rows={rows}
            columns={placeActionsAfterSerial(columns)}
            getRowId={getRowId}
            loading={loading}
            paginationMode={paginationMode}
            {...(paginationMode === 'server' ? { rowCount } : {})}
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
            pageSizeOptions={pageSizeOptions}
            hideFooter={hideFooter}
            density={compact ? 'compact' : 'standard'}
            disableRowSelectionOnClick
            autoHeight
            getRowHeight={() => 'auto'}
            sx={{
                border: 'none',
                '& .MuiDataGrid-cell:not(.MuiDataGrid-cellEmpty)': {
                    py: compact ? 0.75 : 1.5,
                    px: compact ? 1 : 1.5,
                    display: 'flex',
                    alignItems: 'center',
                },
                '& .MuiDataGrid-cellEmpty, & .MuiDataGrid-scrollbarFiller': {
                    p: 0,
                    minWidth: 0,
                },
            }}
        />
    )
}
