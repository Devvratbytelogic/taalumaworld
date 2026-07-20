import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import React from 'react'

interface CommonDataTableProps {
    rows: any[];
    columns: GridColDef[];
    getRowId: (row: any) => string;
    loading: boolean;
    paginationMode: 'client' | 'server';
    rowCount: number;
    paginationModel: GridPaginationModel;
    onPaginationModelChange: (model: GridPaginationModel) => void;
    }
export default function CommonDataTable({ rows, columns, getRowId, loading, paginationMode, rowCount, paginationModel, onPaginationModelChange }: CommonDataTableProps) {
    return (
        <>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={getRowId}
                loading={loading}
                paginationMode="server"
                rowCount={rowCount}
                paginationModel={paginationModel}
                onPaginationModelChange={onPaginationModelChange}
                pageSizeOptions={[2, 25, 50]}
                // disableRowSelectionOnClick
                // autoHeight
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
        </>
    )
}
