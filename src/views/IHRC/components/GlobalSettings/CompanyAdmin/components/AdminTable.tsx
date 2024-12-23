
import React, { useState, useMemo, useEffect } from 'react';
import DataTable from '@/components/shared/DataTable';
import { Button, Dialog, Tooltip, Notification, toast } from '@/components/ui';
import { MdEdit } from 'react-icons/md';
import { FiCheck, FiX } from 'react-icons/fi';
import { useAppDispatch } from '@/store';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
import Lottie from 'lottie-react';
import { HiOutlineViewGrid } from 'react-icons/hi';
import Checkbox from '@/components/ui/Checkbox';
import { updateCompanyAdmin } from '@/store/slices/companyAdmin/companyAdminSlice';

interface Module {
    id: number;
    name: string;
}

interface AdminData {
    id: number;
    name: string;
    email: string;
    role: string;
    moduleAccessNames: string[];
}

interface AdminTableProps {
    adminData: AdminData[];
    modules: Module[];
    isLoading: boolean;
    onDataChange: (page?: number, pageSize?: number) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({
    adminData,
    modules,
    isLoading,
    onDataChange
}) => {
    const dispatch = useAppDispatch();
    const [adminTableData, setAdminTableData] = useState<AdminData[]>([]);
    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<AdminData | null>(null);
    const [editedAdminData, setEditedAdminData] = useState({
        moduleAccess: [] as number[]
    });
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: { order: '', key: '' },
    });

    useEffect(() => {
        setAdminTableData(adminData);
    }, [adminData]);

    const AccessIndicator = ({ hasAccess }: { hasAccess: boolean }) => (
        <div className="flex justify-center">
            {hasAccess ? (
                <FiCheck className="text-green-500 w-5 h-5" />
            ) : (
                <FiX className="text-red-500 w-5 h-5" />
            )}
        </div>
    );

    const columns = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => (
                    <div className="truncate">{props.getValue() as string}</div>
                ),
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: (props) => (
                    <div className="truncate">{props.getValue() as string}</div>
                ),
            },
            {
                header: 'Role',
                accessorKey: 'role',
                cell: (props) => (
                    <div className="truncate">{props.getValue() as string}</div>
                ),
            },
            {
                header: 'Audit Checklist',
                id: 'auditChecklist',
                cell: ({ row }) => (
                    <AccessIndicator 
                        hasAccess={row.original.moduleAccessNames.includes('Audit Checklist')} 
                    />
                ),
            },
            {
                header: 'Remittance Tracker',
                id: 'remittanceTracker',
                cell: ({ row }) => (
                    <AccessIndicator 
                        hasAccess={row.original.moduleAccessNames.includes('Remittance Tracker')} 
                    />
                ),
            },
            {
                header: 'Register & Return',
                id: 'registerReturn',
                cell: ({ row }) => (
                    <AccessIndicator 
                        hasAccess={row.original.moduleAccessNames.includes('Register & Return')} 
                    />
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
                                onClick={() => openEditDialog(row.original)}
                                icon={<MdEdit />}
                                className="text-blue-500"
                            />
                        </Tooltip>
                    </div>
                ),
            },
        ],
        []
    );

    // const sortedModules = useMemo(() => {
    //     const moduleOrder = ['Audit Checklist', 'Remittance Tracker', 'Register & Return'];
    //     return [...modules].sort((a, b) => {
    //         const indexA = moduleOrder.indexOf(a.name);
    //         const indexB = moduleOrder.indexOf(b.name);
    //         return indexA - indexB;
    //     });
    // }, [modules]);

    const handleEditConfirm = async () => {
        if (itemToEdit?.id) {
            try {
                await dispatch(updateCompanyAdmin({ 
                    id: itemToEdit.id, 
                    moduleAccess: editedAdminData.moduleAccess 
                })).unwrap();
                
                onDataChange();
                showSuccessNotification('Admin updated successfully');
                handleDialogClose();
            } catch (error) {
                console.error('Error updating admin:', error);
                showErrorNotification('Failed to update admin');
            }
        }
    };
    

    const openEditDialog = (admin: AdminData) => {
        // Convert module names to their corresponding IDs
        const selectedModuleIds = modules
            .filter(module => admin.moduleAccessNames.includes(module.name))
            .map(module => module.id);
        
        console.log('Initial Selected Module IDs:', selectedModuleIds); // Console log initial module IDs
        
        setItemToEdit(admin);
        setEditedAdminData({
            moduleAccess: selectedModuleIds
        });
        setEditDialogIsOpen(true);
    };


    const handleModuleChange = (values: number[]) => {
        console.log('Selected Module IDs:', values); // Console log the selected module IDs
        setEditedAdminData(prev => ({ 
            ...prev, 
            moduleAccess: values 
        }));
    };

    const handleDialogClose = () => {
        setEditDialogIsOpen(false);
        setItemToEdit(null);
        setEditedAdminData({
            moduleAccess: []
        });
    };

    const showSuccessNotification = (message: string) => {
        toast.push(
            <Notification title="Success" type="success">
                {message}
            </Notification>
        );
    };

    const onPaginationChange = (page: number) => {
        setTableData(prev => ({ ...prev, pageIndex: page }));
    };

    const onSelectChange = (value: number) => {
        setTableData(prev => ({
            ...prev,
            pageSize: Number(value),
            pageIndex: 1,
        }));
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
                <div className="w-28 h-28">
                    <Lottie 
                        animationData={loadingAnimation} 
                        loop 
                        className="w-24 h-24"
                    />
                </div>
                <p className="text-lg font-semibold">
                    Loading Data...
                </p>
            </div>
        );
    }

    return (
        <div className="relative">
            {adminTableData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
                    <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-center">No Data Available</p>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={adminTableData}
                    skeletonAvatarColumns={[0]}
                    skeletonAvatarProps={{ className: 'rounded-md' }}
                    loading={isLoading}
                    pagingData={{
                        total: tableData.total,
                        pageIndex: tableData.pageIndex,
                        pageSize: tableData.pageSize,
                    }}
                    onPaginationChange={onPaginationChange}
                    onSelectChange={onSelectChange}
                    stickyHeader={true}
                />
            )}

            <Dialog
                isOpen={editDialogIsOpen}
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
            >
                <h5 className="mb-4">Edit Module Access</h5>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-gray-600 mb-2 block">Modules</label>
                        <div className="border rounded p-4">
                            <Checkbox.Group 
                                value={editedAdminData.moduleAccess} 
                                onChange={handleModuleChange}
                                   className="flex flex-row flex-wrap gap-6"
                            >
                                {modules.map(module => (
                                    <div key={module.id}  className="flex-1 min-w-[180px]">
                                        <Checkbox 
                                            value={module.id}
                                            className="inline-flex items-center"
                                        >
                                            <span className="ml-2 whitespace-nowrap">{module.name}</span>
                                        </Checkbox>
                                    </div>
                                ))}
                            </Checkbox.Group>
                        </div>
                    </div>
                </div>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={handleDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="solid" 
                        onClick={handleEditConfirm}
                    >
                        Save Changes
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default AdminTable;