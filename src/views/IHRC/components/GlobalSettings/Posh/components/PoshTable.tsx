
import React, { useMemo } from 'react';
import DataTable from '@/components/shared/DataTable';
import { Button, Tooltip } from '@/components/ui';
import { MdEdit } from 'react-icons/md';

interface PoshData {
    id: string;
    state_name: string;
    district_name: string;
    authority_name: string;
    authority_address: string;
}

interface PoshTableProps {
    data: PoshData[];
    loading: boolean;
    onEdit: (id: string) => void;
    pageIndex: number;
    pageSize: number;
    total: number;
    onPaginationChange: (page: number) => void;
    onSelectChange: (pageSize: number) => void;
}

const PoshTable = ({ 
    data,
    loading,
    onEdit, 
    pageIndex,
    pageSize,
    total,
    onPaginationChange,
    onSelectChange
}: PoshTableProps) => {
    const columns = useMemo(
        () => [
            {
                header: 'State',
                enableSorting: false,
                accessorKey: 'state_name',
                cell: ({ row }) => (
                    <div className="w-40 truncate">
                        {row.original.state_name}
                    </div>
                ),
            },
            {
                header: 'District',
                enableSorting: false,
                accessorKey: 'district_name',
                cell: ({ row }) => (
                    <div className="w-40 truncate">
                        {row.original.district_name}
                    </div>
                ),
            },
            {
                header: 'Authority Name',
                enableSorting: false,
                accessorKey: 'authority_name',
                cell: ({ row }) => (
                    <div className="w-40 truncate">
                        {row.original.authority_name}
                    </div>
                ),
            },
            {
                header: 'Authority Address',
                enableSorting: false,
                accessorKey: 'authority_address',
                cell: ({ row }) => (
                    <div className="w-60 truncate">
                        {row.original.authority_address}
                    </div>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <Tooltip title="Edit" placement="top">
                        <Button
                            size="sm"
                            icon={<MdEdit />}
                            onClick={() => onEdit(row.original.id)}
                        />
                    </Tooltip>
                ),
            },
        ],
        [onEdit]
    );

    return (
        <div className="relative">
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                stickyHeader={true}
                stickyFirstColumn={true}
                stickyLastColumn={true}                
                pagingData={{
                    total: total,
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                selectable={true}
            />
        </div>
    );
};

export default PoshTable;