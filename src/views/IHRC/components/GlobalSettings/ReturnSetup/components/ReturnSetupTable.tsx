import React, { useMemo, useState, useEffect } from 'react';
import { Button, Dialog, toast, Tooltip, Notification } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { MdEdit } from 'react-icons/md';
import { DataTable } from '@/components/shared';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { FiXCircle } from 'react-icons/fi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

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
    searchTerm: string;
    searchBy: string;
    pageIndex: number;
    pageSize: number;
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
    searchTerm,
    searchBy,
    pageIndex,
    pageSize,
    onPaginationChange,
    onSelectChange,
}: ReturnSetupTableProps) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedReturnId, setSelectedReturnId] = useState<string | number | null>(null);
    const [actionType, setActionType] = useState<'enable' | 'disable' | null>(null);
    const [returnSetupData, setReturnSetupData] = useState<ReturnSetupData[]>([]);
    const [totalResults, setTotalResults] = useState(0);
    const [timestamp, setTimestamp] = useState(Date.now());

    useEffect(() => {
        const fetchReturnSetupData = async () => {
            try {
                setLoading(true);
                const response = await httpClient.get(endpoints.return.list(), {
                    params: {
                        page: pageIndex,
                        page_size: pageSize,
                        search: searchTerm,
                        search_by: searchBy
                    }
                });
                
                const transformedData = response.data.data.map((item: any) => ({
                    ...item,
                    state: item.state_name || '--',
                    return_applicability: item.return_applicable ? 'Yes' : 'No',
                    first_due_date: item.due_dates?.first_due_date || '-',
                    second_due_date: item.due_dates?.second_due_date || '-',
                    third_due_date: item.due_dates?.third_due_date || '-',
                    last_due_date: item.due_dates?.last_due_date || '-',
                    bi_annual_date: item.due_dates?.bi_annual_due_date || '-'
                }));
                
                setReturnSetupData(transformedData || []);
                setTotalResults(response.data.paginate_data?.totalResults || 0);
            } catch (error) {
                console.error('Error fetching return setup data:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchReturnSetupData();
    }, [pageIndex, pageSize, searchTerm, searchBy, timestamp]);

    const handleStatusToggle = async () => {
        if (!selectedReturnId || !actionType) return;
        
        try {
            setLoading(true);
            const is_active = actionType === 'enable';
            
            await httpClient.put(
                endpoints.return.statusToggle(selectedReturnId, is_active),
                { is_active }
            );
            
            // Refresh data by updating timestamp
            setTimestamp(Date.now());
            
        } catch (error) {
            console.error('Error toggling return status:', error);
            toast.push(
                <Notification title="Error" type="error">
                    Failed to update status. Please try again.
                </Notification>
            );
        } finally {
            setLoading(false);
            setDeleteDialogOpen(false);
            setSelectedReturnId(null);
            setActionType(null);
        }
    };

    const formatDate = (dateString: string) => {
    if (!dateString || dateString === '-') return '-';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return original if invalid date
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}-${month}-${year}`;
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
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

    return (
        <div className='relative'>
            {returnSetupData.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                    <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-center">
                        No Data Available
                    </p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={returnSetupData}
                    loading={loading}
                    skeletonAvatarColumns={[0]}
                    skeletonAvatarProps={{ className: 'rounded-md' }}
                    pagingData={{
                        total: totalResults,
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
                        onClick={handleStatusToggle} 
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