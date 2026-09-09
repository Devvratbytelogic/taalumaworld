import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import React from 'react'

type CommonDataTableProps = {
    rows: any[];
    columns: GridColDef[];
    getRowId: (row: any) => string;
    loading: boolean;
    paginationModel: GridPaginationModel;
    onPaginationModelChange: (model: GridPaginationModel) => void;
    hideFooter?: boolean;
    pageSizeOptions?: number[];
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
}: CommonDataTableProps) {
    return (
        <DataGrid
            rows={rows}
            columns={columns}
            getRowId={getRowId}
            loading={loading}
            paginationMode={paginationMode}
            {...(paginationMode === 'server' ? { rowCount } : {})}
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
            pageSizeOptions={pageSizeOptions}
            hideFooter={hideFooter}
            disableRowSelectionOnClick
            getRowHeight={() => 'auto'}
            sx={{
                border: 'none',
                '& .MuiDataGrid-cell:not(.MuiDataGrid-cellEmpty)': {
                    p: 1.5,
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
