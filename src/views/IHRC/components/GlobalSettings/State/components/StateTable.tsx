import React, { useEffect, useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { format } from 'date-fns';
import { Button, Tooltip } from '@/components/ui';
import { MdEdit } from 'react-icons/md';
import { AppDispatch } from '@/store'
import { useDispatch } from 'react-redux';
import { fetchStates } from '@/store/slices/state/stateSlice';

const StateTable = ({ tableLoading, setStateTableLoading, loading, onEdit }: any) => {
    const dispatch = useDispatch<AppDispatch>()
    const [stateTableData, setStateTableData] = useState([
        {
            id: '1',
            name: 'Maharashtra',
            district: 'Mumbai',
            location: 'Andheri',
          
        },
        {
            id: '2',
            name: 'Delhi',
            district: 'New Delhi',
            location: 'Connaught Place',
           
        }
    ])

    const formatDate = (date) => {
        if (!date) return '-';
        return format(new Date(date), 'MMM dd, yyyy');
    };

    const getFrequencyLabel = (value) => {
        const labels = {
            'yearly': 'Yearly',
            'half_yearly': 'Half Yearly',
            'monthly': 'Monthly'
        };
        return labels[value] || value;
    };

    const getPaymentModeLabel = (value) => {
        return value === 'online' ? 'Online' : 'Offline';
    };

    const columns = useMemo(
        () => [
            {
                header: 'State',
                enableSorting: false,

                accessorKey: 'name',
                cell: ({ row }) => (
                    <div className="w-40 truncate">
                        {row.original.name}
                    </div>
                ),
            },
            {
                header: 'District',
                enableSorting: false,

                accessorKey: 'district',
                cell: ({ row }) => (
                    <div className="w-40 truncate">
                        {row.original.district}
                    </div>
                ),
            },
            // {
            //     header: 'Location',
            //     enableSorting: false,

            //     accessorKey: 'location',
            //     cell: ({ row }) => (
            //         <div className="w-40 truncate">
            //             {row.original.location}
            //         </div>
            //     ),
            // },
          
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

    const [tableData, setTableData] = useState({
        total: 2,
        pageIndex: 1,
        pageSize: 10,
    });

    const onPaginationChange = (page: number) => {
        setTableData(prev => ({ ...prev, pageIndex: page }));
    };

    const onSelectChange = (value: number) => {
        setTableData(prev => ({
            ...prev,
            pageSize: Number(value),
            pageIndex: 1,
        }))
    };

    return (
        <div className="relative">
            <DataTable
                columns={columns}
                data={stateTableData}
                loading={loading}
                stickyHeader={true}
                pagingData={{
                    total: tableData.total,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                selectable={true}
            />
        </div>
    );
};

export default StateTable;