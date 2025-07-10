// ReturnSetupTable.tsx
import React, { useMemo, useState } from 'react';
import { Button, Dialog, toast, Tooltip, Notification } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { MdEdit } from 'react-icons/md';
import { DataTable } from '@/components/shared';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { FiXCircle } from 'react-icons/fi';

interface ReturnSetupData {
    id: string | number;
    act_name: string;
    return_name: string;
    state_name: string;
    return_applicable: boolean;
    return_applicable_at: string;
    applicable: string;
    frequency: string;
    first_due_date: string;
    second_due_date: string;
    third_due_date: string;
    last_due_date: string;
    bi_annual_date: string;
    is_active: boolean;
}

interface ReturnSetupTableProps {
    data: ReturnSetupData[];
    loading: boolean;
    onStatusToggle: (id: string | number, is_active: boolean) => void;
    pageIndex: number;
    pageSize: number;
    total: number;
    onPaginationChange: (page: number) => void;
    onSelectChange: (pageSize: number) => void;
}

const capitalize = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const formatApplicable = (applicable: string) => {
    switch (applicable) {
        case 'CENTRAL':
            return 'Central';
        case 'STATE':
            return 'State';
        case 'ALL_STATES':
            return 'All States';
        default:
            return applicable;
    }
};

const ReturnSetupTable = ({
    data,
    loading,
    onStatusToggle,
    pageIndex,
    pageSize,
    total,
    onPaginationChange,
    onSelectChange,
}: ReturnSetupTableProps) => {
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedReturnId, setSelectedReturnId] = useState<string | number | null>(null);
    const [actionType, setActionType] = useState<'enable' | 'disable' | null>(null);

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '-') return '-';
    
    try {
        // First check if it's in YYYY-MM-DD format (ISO)
        const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (isoRegex.test(dateString)) {
            const [year, month, day] = dateString.split('-');
            return `${day}-${month}-${year}`;
        }
        
        // Handle cases where date might already be in DD-MM-YY or DD-MM-YYYY format
        const parts = dateString.split('-');
        
        // If it's already in DD-MM-YY or DD-MM-YYYY format, just reformat the year if needed
        if (parts.length === 3) {
            const [day, month, year] = parts;
            
            // Validate day and month
            if (day.length !== 2 || month.length !== 2) {
                throw new Error('Invalid day or month format');
            }
            
            // Handle 2-digit year (assuming 2000s)
            const fullYear = year.length === 2 ? `20${year}` : year;
            
            // Validate the full date
            const date = new Date(`${month}/${day}/${fullYear}`);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }
            
            return `${day}-${month}-${fullYear}`;
        }
        
        // Handle other date formats by parsing as Date object
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}-${month}-${year}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString; // Return original if we can't format it
    }
};


   


    const columns = useMemo(
        () => [
            {
                header: 'Act Name',
                enableSorting: false,
                accessorKey: 'act_name',
                cell: ({ row }) => (
                    <Tooltip title={row.original.act_name}>
                        <div className="w-52 truncate">{row.original.act_name}</div>
                    </Tooltip>
                )
            },
            {
                header: 'Return Name',
                enableSorting: false,
                accessorKey: 'return_name',
                cell: ({ row }) => (
                    <Tooltip title={row.original.return_name}>
                        <div className="w-52 truncate">{row.original.return_name}</div>
                    </Tooltip>
                )
            },
            {
                header: 'Applicable',
                enableSorting: false,
                accessorKey: 'applicable',
                cell: ({ row }) => (
                    <div className="w-40 truncate">
                        {formatApplicable(row.original.applicable)}
                    </div>
                ),
            },
            {
                header: 'Applicability',
                enableSorting: false,
                accessorKey: 'return_applicable',
                cell: ({ row }) => (
                    <div className="w-20 text-center">
                        {row.original.return_applicable ? 'Yes' : 'No'}
                    </div>
                ),
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
                cell: ({ row }) => <div className="w-40 truncate">{capitalize(row.original.return_applicable_at)}</div>,
            },
            {
                header: 'Frequency',
                enableSorting: false,
                accessorKey: 'frequency',
                cell: ({ row }) => <div className="w-40 truncate">{capitalize(row.original.frequency)}</div>,
            },
            {
                header: 'First Due Date',
                enableSorting: false,
                accessorKey: 'first_due_date',
                cell: ({ row }) => <div className="w-40 truncate">{formatDate(row.original.first_due_date)}</div>,
            },
            {
                header: 'Second Due Date',
                enableSorting: false,
                accessorKey: 'second_due_date',
                cell: ({ row }) => <div className="w-40 truncate">{formatDate(row.original.second_due_date)}</div>,
            },
            {
                header: 'Third Due Date',
                enableSorting: false,
                accessorKey: 'third_due_date',
                cell: ({ row }) => <div className="w-40 truncate">{formatDate(row.original.third_due_date)}</div>,
            },
            {
                header: 'Last Due Date',
                enableSorting: false,
                accessorKey: 'last_due_date',
                cell: ({ row }) => <div className="w-40 truncate">{formatDate(row.original.last_due_date)}</div>,
            },
            {
                header: 'Biennial Due Date',
                enableSorting: false,
                accessorKey: 'bi_annual_date',
                cell: ({ row }) => <div className="w-40 truncate">{formatDate(row.original.bi_annual_date)}</div>,
            },
            {
                header: 'Status',
                enableSorting: false,
                accessorKey: 'is_active',
                cell: ({ row }) => (
                    <div className="flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${row.original.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                        {row.original.is_active ? 'Active' : 'Inactive'}
                    </div>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Tooltip title="Edit">
                            <Button
                                size="sm"
                                onClick={() => navigate('/edit-return-setup', {
                                    state: { 
                                        id: row.original.id,
                                    }
                                })}
                                icon={<MdEdit />}
                                className="text-blue-500"
                            />
                        </Tooltip>

                        <Tooltip title={row.original.is_active ? "Disable" : "Enable"}>
                            <Button
                                size="sm"
                                icon={row.original.is_active ? <FiXCircle /> : <IoMdCheckmarkCircleOutline />}
                                className={row.original.is_active ? "text-red-500" : "text-green-500"}
                                onClick={() => {
                                    setSelectedReturnId(row.original.id);
                                    setActionType(row.original.is_active ? 'disable' : 'enable');
                                    setDeleteDialogOpen(true);
                                }}
                            />
                        </Tooltip>
                    </div>
                ),
            }
        ],
        [navigate]
    );

    const handleStatusToggleConfirm = async () => {
        if (!selectedReturnId || !actionType) return;
        
        try {
            await onStatusToggle(selectedReturnId, actionType === 'enable');
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error('Error toggling status:', error);
            toast.push(
                <Notification title="Error" type="error">
                    Failed to update status. Please try again.
                </Notification>
            );
        } finally {
            setSelectedReturnId(null);
            setActionType(null);
        }
    };

    return (
        <div className='relative'>
            {data.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                    <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-center">
                        No Data Available
                    </p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={data}
                    loading={loading}
                    skeletonAvatarColumns={[0]}
                    skeletonAvatarProps={{ className: 'rounded-md' }}
                    pagingData={{
                        total: total,
                        pageIndex: pageIndex,
                        pageSize: pageSize,
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
                <h5 className="mb-4">Confirm {actionType === 'enable' ? 'Enable' : 'Disable'}</h5>
                <p>Are you sure you want to {actionType === 'enable' ? 'enable' : 'disable'} this Return Setup?</p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={() => setDeleteDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="solid" 
                        onClick={handleStatusToggleConfirm}
                        loading={loading}
                    >
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default ReturnSetupTable;