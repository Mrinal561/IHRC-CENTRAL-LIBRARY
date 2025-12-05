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
import OutlinedInput from '@/components/ui/OutlinedInput/OutlinedInput';
import * as yup from 'yup';
import AuditTrackerDialog from './AuditTrackerDialog';

const validationSchema = yup.object().shape({
  entityName: yup
    .string()
    .required('Entity name is required')
    .min(3, 'Entity name must be at least 3 characters')
    .matches(/^\S.*\S$|^\S$/, 'The input must not have leading or trailing spaces'),
    email: yup
    .string()
    .matches(
       /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov)$/,
       'Invalid email address. Please use a valid email with a.com,.in,.org,.net,.edu, or.gov domain.'
     )
    .required('Email is required'),
});

interface ValidationErrors {
  [key: string]: string;
}
interface Module {
    id: number;
    name: string;
}

interface AdminData {
    id: number;
    name: string;
    email: string;
    role: string;
    entityName: string;
    moduleAccessNames: string[];
    compliance_checklist?: boolean;
    both_checklist?: boolean;
    custom_checklist?: boolean;
}

interface AdminTableProps {
    adminData: AdminData[];
    modules: Module[];
    isLoading: boolean;
    onDataChange: (page?: number, pageSize?: number) => void;
    pagination: {
        total: number;
        pageIndex: number;
        pageSize: number;
      };
    onPaginationChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({
    adminData,
    modules,
    isLoading,
    onDataChange,
    onPaginationChange,
    onPageSizeChange,
    pagination,
}) => {
    const dispatch = useAppDispatch();
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [adminTableData, setAdminTableData] = useState<AdminData[]>([]);
    const [editDialogIsOpen, setEditDialogIsOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<AdminData | null>(null);
    const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
    const [showAuditTrackerDialog, setShowAuditTrackerDialog] = useState(false);
    const [editedAdminData, setEditedAdminData] = useState({
        name: '',
        email: '',
        entityName: '',
        moduleAccess: [] as string[],
        compliance_checklist: false,
        both_checklist: false,
        custom_checklist: false
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

    const validateField = async (field: string, value: any) => {
        try {
            const validationObject = {
                entityName: editedAdminData.entityName,
                email: editedAdminData.email,
                moduleAccess: modules
                    .filter(module => editedAdminData.moduleAccess.includes(module.name))
                    .map(module => module.id),
            };
            
            await validationSchema.validateAt(field, { ...validationObject, [field]: value });
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                setErrors(prev => ({
                    ...prev,
                    [field]: error.message
                }));
            }
        }
    };

    const validateForm = async () => {
        try {
            const moduleIds = modules
                .filter(module => editedAdminData.moduleAccess.includes(module.name))
                .map(module => module.id);

            const validationObject = {
                entityName: editedAdminData.entityName,
                email: editedAdminData.email,
                moduleAccess: moduleIds,
            };

            await validationSchema.validate(validationObject, { abortEarly: false });
            setErrors({});
            return true;
        } catch (yupError) {
            if (yupError instanceof yup.ValidationError) {
                const newErrors: ValidationErrors = {};
                yupError.inner.forEach((error) => {
                    if (error.path) {
                        newErrors[error.path] = error.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const AccessIndicator = ({ hasAccess }: { hasAccess: boolean }) => (
        <div className="flex justify-center items-center w-32">
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
                header: 'Company Group',
                accessorKey: 'entityName',
                enableSorting: false,
                cell: (props) => (
                    <div className="truncate">{props.getValue() as string}</div>
                ),
            },
            {
                header: 'Full Name',
                accessorKey: 'name',
                enableSorting: false,
                cell: (props) => (
                    <div className="truncate">{props.getValue() as string}</div>
                ),
            },
            {
                header: 'Email',
                accessorKey: 'email',
                enableSorting: false,
                cell: (props) => (
                    <div className="truncate">{props.getValue() as string}</div>
                ),
            },
            {
                header: 'Remittance Tracker',
                id: 'remittanceTracker',
                enableSorting: false,
                cell: ({ row }) => (
                    <AccessIndicator 
                        hasAccess={row.original.moduleAccessNames.includes('Remittance Tracker')} 
                    />
                ),
            },
            {
                header: 'Notice',
                id: 'Notice',
                cell: ({ row }) => (
                    <AccessIndicator 
                        hasAccess={row.original.moduleAccessNames.includes('Notice')} 
                    />
                ),
            },
            {
                header: 'Agreement',
                id: 'Agreement',
                cell: ({ row }) => (
                    <AccessIndicator 
                        hasAccess={row.original.moduleAccessNames.includes('Agreement')} 
                    />
                ),
            },
            {
                header: 'POSH',
                id: 'POSH',
                cell: ({ row }) => (
                    <AccessIndicator 
                        hasAccess={row.original.moduleAccessNames.includes('POSH')} 
                    />
                ),
            },
            {
                header: 'Return Tracker',
                id: 'returnTracker',
                cell: ({ row }) => (
                    <AccessIndicator 
                        hasAccess={row.original.moduleAccessNames.includes('Return Tracker')} 
                    />
                ),
            },
            {
                header: 'Audit Tracker',
                id: 'auditTracker',
                cell: ({ row }) => (
                    <AccessIndicator 
                        hasAccess={row.original.moduleAccessNames.includes('Audit Tracker')} 
                    />
                ),
            },
            {
                header: 'Register',
                id: 'register',
                cell: ({ row }) => (
                    <AccessIndicator 
                        hasAccess={row.original.moduleAccessNames.includes('Register')} 
                    />
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                enableSorting: false,
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

    const handleEditConfirm = async () => {
    if(itemToEdit?.id){
        try {
            const moduleIds = modules
                .filter(module => editedAdminData.moduleAccess.includes(module.name))
                .map(module => module.id);
            
            // Create the payload with proper checklist fields
            const updatePayload = {
                id: itemToEdit.id,
                name: editedAdminData.name,
                email: editedAdminData.email,
                entityName: editedAdminData.entityName,
                moduleAccess: moduleIds,
                compliance_checklist: editedAdminData.compliance_checklist,
                both_checklist: editedAdminData.both_checklist,
                custom_checklist: editedAdminData.custom_checklist
            };

            console.log("Update Payload:", updatePayload); // Debug log
            
            await dispatch(updateCompanyAdmin(updatePayload)).unwrap();
                
            onDataChange();
            showSuccessNotification('Admin updated successfully');
            handleDialogClose();
        } catch (error) {
            console.error('Error updating admin:', error);
            throw error;
        }
    }
};

    const handleModuleChange = (moduleName: string, isChecked: boolean) => {
        if (moduleName === 'Audit Tracker') {
            if (isChecked) {
                setShowAuditTrackerDialog(true);
            } else {
                setEditedAdminData(prev => ({
                    ...prev,
                    moduleAccess: prev.moduleAccess.filter(name => name !== 'Audit Tracker'),
                    compliance_checklist: false,
                    both_checklist: false,
                    custom_checklist: false
                }));
            }
        } else {
            setEditedAdminData(prev => ({
                ...prev,
                moduleAccess: isChecked
                    ? [...prev.moduleAccess, moduleName]
                    : prev.moduleAccess.filter(name => name !== moduleName)
            }));
        }
    };

    // Fixed handleAuditTrackerConfirm function
    const handleAuditTrackerConfirm = (selection: 'custom' | 'compliance' | 'both') => {
        setEditedAdminData(prev => ({
            ...prev,
            // Ensure 'Audit Tracker' is added to moduleAccess if not already present
            moduleAccess: prev.moduleAccess.includes('Audit Tracker') 
                ? prev.moduleAccess 
                : [...prev.moduleAccess, 'Audit Tracker'],
            compliance_checklist: selection === 'compliance' || selection === 'both',
            both_checklist: selection === 'both',
            custom_checklist: selection === 'custom' || selection === 'both'
        }));
        setShowAuditTrackerDialog(false);
    };
      
    const openEditDialog = (admin: AdminData) => {
        setItemToEdit(admin);
        setEditedAdminData({
            name: admin.name,
            email: admin.email,
            entityName: admin.entityName || '',
            moduleAccess: admin.moduleAccessNames,
            compliance_checklist: admin.compliance_checklist || false,
            both_checklist: admin.both_checklist || false,
            custom_checklist: admin.custom_checklist || false
        });
        setEditDialogIsOpen(true);
        setErrors({});
        setTouchedFields({});
    };

    const handleInputChange = (field: string, value: string) => {
        setEditedAdminData(prev => ({
            ...prev,
            [field]: value
        }));
        setTouchedFields(prev => ({
            ...prev,
            [field]: true
        }));

        if (touchedFields[field]) {
            validateField(field, value);
        }
    };

    const handleDialogClose = () => {
        setEditDialogIsOpen(false);
        setItemToEdit(null);
        setEditedAdminData({
            name: '',
            email: '',
            entityName: '',
            moduleAccess: [],
            compliance_checklist: false,
            both_checklist: false,
            custom_checklist: false
        });
        setErrors({});
        setTouchedFields({});
    };

    const showSuccessNotification = (message: string) => {
        toast.push(
            <Notification title="Success" type="success">
                {message}
            </Notification>
        );
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
                <p className="text-lg font-semibold">Loading Data...</p>
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
                        total: pagination.total,
                        pageIndex: pagination.pageIndex,
                        pageSize: pagination.pageSize,
                      }}
                      onPaginationChange={onPaginationChange}
                      onSelectChange={onPageSizeChange}
                    stickyHeader={true}
                />
            )}

            <Dialog
                isOpen={editDialogIsOpen}
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
            >
                <h5 className="mb-4">Edit Company Admin</h5>

                <div className="flex flex-col gap-4">
                    <div className='border-b pb-2'>
                        <h6 className="text-gray-800 font-medium mb-2">Company Group</h6>
                        <div className="w-full">
                            <label className="text-gray-600 mb-2 block">Entity Name</label>
                            <OutlinedInput
                                label="Entity Name"
                                value={editedAdminData.entityName}
                                onChange={(value: string) => handleInputChange('entityName', value)}
                            />
                            {errors.entityName && (
                                <p className="text-red-500 text-xs mt-1">{errors.entityName}</p>
                            )}
                        </div>
                    </div>

                    {/* User Details Section */}
                    <div className="border-b pb-2">
                        <h6 className="text-gray-800 font-medium mb-2">User Details</h6>
                        <div className="space-y-4">
                            {/* Name and Email row */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-gray-600 mb-2 block">Full Name</label>
                                    <OutlinedInput
                                        label="Full Name"
                                        value={editedAdminData.name}
                                        onChange={(value: string) => handleInputChange('name', value)}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-gray-600 mb-2 block">Email</label>
                                    <OutlinedInput
                                        label="Email"
                                        value={editedAdminData.email}
                                        onChange={(value: string) => handleInputChange('email', value)}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-gray-600 mb-2 block">Modules List</label>
                        <div className="border rounded p-4">
                            <div className="flex flex-row flex-wrap gap-6">
                                {modules
                                    .filter(module => 
                                        ['Remittance Tracker', 'Notice', 'Agreement', 'POSH', 'Return Tracker', 'Audit Tracker', 'Register']
                                        .includes(module.name))
                                    .map(module => (
                                        <div key={module.id} className="flex-1 min-w-[180px]">
                                            <Checkbox
                                                checked={editedAdminData.moduleAccess.includes(module.name)}
                                                onChange={(checked) => handleModuleChange(module.name, checked)}
                                                className="inline-flex items-center"
                                            >
                                                <span className="ml-2 whitespace-nowrap">{module.name}</span>
                                            </Checkbox>
                                        </div>
                                    ))}
                            </div>
                            {errors.moduleAccess && (
                                <p className="text-red-500 text-xs mt-1">{errors.moduleAccess}</p>
                            )}
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
                       Confirm
                    </Button>
                </div>
            </Dialog>
            
            <AuditTrackerDialog
                isOpen={showAuditTrackerDialog}
                onClose={() => {
                    setShowAuditTrackerDialog(false);
                    // Don't remove from moduleAccess here - let the user decide
                }}
                onConfirm={handleAuditTrackerConfirm}
            />
        </div>
    );
};

export default AdminTable;













