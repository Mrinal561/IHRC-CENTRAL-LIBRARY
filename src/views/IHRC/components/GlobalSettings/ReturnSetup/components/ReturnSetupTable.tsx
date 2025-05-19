import React, { useMemo, useState } from 'react';
import { Button, Dialog, Tooltip } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { MdEdit } from 'react-icons/md';
import { FiTrash, FiXCircle } from 'react-icons/fi';
import { DataTable } from '@/components/shared';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

const ReturnSetupTable = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
    });

    // Dummy data for the table
    const dummyData = [
        {
            id: 1,
            act_name: 'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013',
            return_name: 'Annual Report',
            state: 'Central',
            return_applicability: 'Yes',
            return_applicable_at: 'Branch',
            frequency: 'Monthly',
            first_due_date: '15th',
            second_due_date: '-',
            third_due_date: '-',
            last_due_date: '-',
            bi_annual_date: '2029'
        },
        {
            id: 2,
            act_name: 'Payment of Bonus Act 1965',
            return_name: 'Bonus Payment Report',
            state: 'Maharashtra',
            return_applicability: 'Yes',
            return_applicable_at: 'Central',
            frequency: 'Yearly',
            first_due_date: 'Jan 31st',
            second_due_date: '-',
            third_due_date: '-',
            last_due_date: '-',
            bi_annual_date: '2027'
        },
        {
            id: 3,
            act_name: 'Maternity Benefit Act 1961',
            return_name: 'Maternity Benefit Report',
            state: 'Karnataka',
            return_applicability: 'Yes',
            return_applicable_at: 'Corporate',
            frequency: 'Quarterly',
            first_due_date: 'Jun 30th',
            second_due_date: 'Sep 30th',
            third_due_date: 'Dec 31st',
            last_due_date: 'Mar 31st',
            bi_annual_date: '-'
        },
        {
            id: 4,
            act_name: 'Minimum Wages Act, 1948',
            return_name: 'Wages Compliance Report',
            state: 'Tamil Nadu',
            return_applicability: 'No',
            return_applicable_at: 'Branch',
            frequency: 'Half Yearly',
            first_due_date: 'Sep 30th',
            second_due_date: '-',
            third_due_date: '-',
            last_due_date: 'Mar 31st',
            bi_annual_date: '2025'
        },
        {
            id: 5,
            act_name: 'Factories Act 1948',
            return_name: 'Factory Safety Report',
            state: 'Gujarat',
            return_applicability: 'Yes',
            return_applicable_at: 'State',
            frequency: 'Bi Annual',
            first_due_date: 'Mar 31st',
            second_due_date: '-',
            third_due_date: '-',
            last_due_date: '-',
            bi_annual_date: '2023'
        },
    ];

    const columns = useMemo(
        () => [
            {
                header: 'Act Name',
                enableSorting: false,
                accessorKey: 'act_name',
                cell: ({ row }) => <Tooltip title={row.original.act_name}>
                    <div className="w-52 truncate">{row.original.act_name}</div>
                    </Tooltip>
            },
            {
                header: 'Return Name',
                enableSorting: false,
                accessorKey: 'return_name',
                cell: ({ row }) =><Tooltip title={row.original.return_name}>
                <div className="w-52 truncate">{row.original.return_name}</div>
                </Tooltip>
            },
            {
                header: 'State',
                enableSorting: false,
                accessorKey: 'state',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.state}</div>,
            },
            {
                header: 'Return Applicability',
                enableSorting: false,
                accessorKey: 'return_applicability',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.return_applicability}</div>,
            },
            {
                header: 'Return Applicable At',
                enableSorting: false,
                accessorKey: 'return_applicable_at',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.return_applicable_at}</div>,
            },
            {
                header: 'Frequency',
                enableSorting: false,
                accessorKey: 'frequency',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.frequency}</div>,
            },
            {
                header: 'First Due Date',
                enableSorting: false,
                accessorKey: 'first_due_date',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.first_due_date}</div>,
            },
            {
                header: 'Second Due Date',
                enableSorting: false,
                accessorKey: 'second_due_date',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.second_due_date}</div>,
            },
            {
                header: 'Third Due Date',
                enableSorting: false,
                accessorKey: 'third_due_date',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.third_due_date}</div>,
            },
            {
                header: 'Last Due Date',
                enableSorting: false,
                accessorKey: 'last_due_date',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.last_due_date}</div>,
            },
            {
                header: 'Bi Annual Due Date',
                enableSorting: false,
                accessorKey: 'bi_annual_date',
                cell: ({ row }) => <div className="w-40 truncate">{row.original.bi_annual_date}</div>,
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Tooltip title="Edit">
                            <Button
                                size="sm"
                                onClick={() =>
                                    navigate('/edit-return-setup', {
                                        state: { returnSetupId: row.original.id },
                                    })
                                }
                                icon={<MdEdit />}
                                className="text-blue-500"
                            />
                        </Tooltip>

                        <Tooltip title="Enable">
                            <Button
                                size="sm"
                                icon={<IoMdCheckmarkCircleOutline />}
                                className="text-green-500"
                                onClick={() => {
                                    setDeleteDialogOpen(true);
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="Disable">
                            <Button
                                size="sm"
                                icon={<FiXCircle />}
                                className="text-red-500"
                                onClick={() => {
                                    setDeleteDialogOpen(true);
                                }}
                            />
                        </Tooltip>
                    </div>
                ),
            },
        ],
        []
    );

    const onPaginationChange = (page: number) => {
        console.log(tableData);
    };

    const onSelectChange = (value: number) => {
        console.log(tableData);
    };

    return (
        <div className='relative'>
              {dummyData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                            <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                            <p className="text-center">
                    No Data Available
                            </p>
                  </div>
                        ) : (
            <DataTable
                columns={columns}
                data={dummyData}
                loading={loading}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                pagingData={{
                    total: tableData.total,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                stickyHeader={true}
                stickyFirstColumn={true}
                stickyLastColumn={true}
            />
        )}

            <Dialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                shouldCloseOnOverlayClick={false}
            >
                <h5 className="mb-4">Confirm Deletion</h5>
                <p>Are you sure you want to delete this Return Setup?</p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={() => setDeleteDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={undefined} loading={loading}>
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default ReturnSetupTable;