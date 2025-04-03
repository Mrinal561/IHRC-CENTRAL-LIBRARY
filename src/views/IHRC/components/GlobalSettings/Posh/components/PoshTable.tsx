import React, { useMemo, useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { Button, Tooltip } from '@/components/ui';
import { MdEdit } from 'react-icons/md';

interface PoshData {
    id: string;
    state: string;
    district: string;
    authorityName: string;
    authorityAddress: string;
}

interface PoshTableProps {
    loading?: boolean;
    onEdit: (id: string) => void;
}

const PoshTable = ({ loading, onEdit }: PoshTableProps) => {
    // Dummy data based on the provided example
    const [poshTableData, setPoshTableData] = useState<PoshData[]>([
        {
            id: '1',
            state: 'UTTARAKHAND',
            district: 'DEHRADUN',
            authorityName: 'Collector & District Magistrate Office',
            authorityAddress: '15-17, Nardev Shastri Marg, Race Course, Dehradun, Uttarakhand 248001'
        },
        {
            id: '2',
            state: 'MAHARASHTRA',
            district: 'MUMBAI',
            authorityName: 'Collector Office Mumbai',
            authorityAddress: 'Mantralaya, Mumbai, Maharashtra 400032'
        },
        {
            id: '3',
            state: 'DELHI',
            district: 'NEW DELHI',
            authorityName: 'District Magistrate Office',
            authorityAddress: '5, Sham Nath Marg, Civil Lines, Delhi 110054'
        },
        {
            id: '4',
            state: 'KARNATAKA',
            district: 'BANGALORE',
            authorityName: 'Bangalore Urban DC Office',
            authorityAddress: 'Dr. Ambedkar Veedhi, Bengaluru, Karnataka 560001'
        }
    ]);

    const columns = useMemo(
        () => [
            {
                header: 'State',
                enableSorting: false,
                accessorKey: 'state',
                cell: ({ row }) => (
                    <div className="w-40 truncate">
                        {row.original.state}
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
            {
                header: 'Authority Name',
                enableSorting: false,
                accessorKey: 'authorityName',
                cell: ({ row }) => (
                    <div className="w-40 truncate">
                        {row.original.authorityName}
                    </div>
                ),
            },
            {
                header: 'Authority Address',
                enableSorting: false,
                accessorKey: 'authorityAddress',
                cell: ({ row }) => (
                    <div className="w-60 truncate">
                        {row.original.authorityAddress}
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

    const [tableData, setTableData] = useState({
        total: 4,
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
                data={poshTableData}
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

export default PoshTable;