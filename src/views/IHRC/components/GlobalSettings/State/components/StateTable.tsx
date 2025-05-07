import React, { useMemo } from 'react'
import DataTable from '@/components/shared/DataTable'
import { Button, Tooltip } from '@/components/ui'
import { MdEdit } from 'react-icons/md'

interface StateDistrictPair {
    state_id: number;
    state_name: string;
    district_id: number;
    district_name: string;
}

interface PaginationData {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
}

interface StateTableProps {
    tableLoading: boolean;
    setStateTableLoading: (loading: boolean) => void;
    loading: boolean;
    onEdit: (stateId: number, districtId: number) => void;
    stateDistricts: StateDistrictPair[];
    paginationData: PaginationData;
    onPaginationChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

const StateTable = ({ 
    tableLoading, 
    loading, 
    onEdit,
    stateDistricts,
    paginationData,
    onPaginationChange,
    onPageSizeChange
}: StateTableProps) => {

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
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <Tooltip title="Edit" placement="top">
                        <Button
                            size="sm"
                            icon={<MdEdit />}
                            onClick={() => onEdit(row.original.state_id, row.original.district_id)}
                        />
                    </Tooltip>
                ),
            },
        ],
        [onEdit]
    )

    return (
        <div className="relative">
            <DataTable
                columns={columns}
                data={stateDistricts}
                loading={loading || tableLoading}
                stickyHeader={true}
                pagingData={{
                    total: paginationData.totalResults,
                    pageIndex: paginationData.page,
                    pageSize: paginationData.limit,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onPageSizeChange}
            />
        </div>
    )
}

export default StateTable