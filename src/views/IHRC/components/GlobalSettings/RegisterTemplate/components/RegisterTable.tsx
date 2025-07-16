import React, { useState, useEffect } from 'react';
import DataTable from '@/components/shared/DataTable';
import { Button, Dialog, Input, toast, Notification, Tooltip } from '@/components/ui';
import { RiUploadLine, RiDownloadLine, RiFileTextLine } from 'react-icons/ri';
import { HiDownload, HiTrash } from 'react-icons/hi';
import { FiFile, FiTrash } from 'react-icons/fi';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import { BiTrash } from 'react-icons/bi';

interface RegisterData {
    id: number;
    register_type: string;
    document?: string;
    is_active: boolean;
}

interface RegisterTableProps {
    refreshTable?: boolean;
}

const RegisterTable = ({ refreshTable }: RegisterTableProps) => {
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedRegister, setSelectedRegister] = useState<RegisterData | null>(null);
    const [loading, setLoading] = useState({
        upload: false,
        download: false,
        table: false
    });
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
    });
    const [registers, setRegisters] = useState<RegisterData[]>([]);

    // Fetch registers
    const fetchRegisters = async () => {
        setLoading(prev => ({ ...prev, table: true }));
        try {
            const response = await httpClient.get(endpoints.register.listRegister(), {
                params: {
                    page: tableData.pageIndex,
                    page_size: tableData.pageSize
                }
            });
            
            setRegisters(response.data.data);
            setTableData(prev => ({
                ...prev,
                total: response.data.paginate_data.totalResults
            }));
        } catch (error) {
            toast.push(
                <Notification title="Error" type="error">
                    Failed to load registers
                </Notification>
            );
        } finally {
            setLoading(prev => ({ ...prev, table: false }));
        }
    };

    useEffect(() => {
        fetchRegisters();
    }, [tableData.pageIndex, tableData.pageSize, refreshTable]);

    const handleUploadClick = (register: RegisterData) => {
        setSelectedRegister(register);
        setIsUploadDialogOpen(true);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !selectedRegister) return;

        setLoading(prev => ({ ...prev, upload: true }));
        
        try {
            const formData = new FormData();
            formData.append('document', selectedFile);
            formData.append('register_type', selectedRegister.register_type);

            await httpClient.put(
                endpoints.register.updateRegister(selectedRegister.id),
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast.push(
                <Notification title="Success" type="success">
                    Document uploaded successfully
                </Notification>
            );
            
            // Refresh the list
            await fetchRegisters();
            setIsUploadDialogOpen(false);
            setSelectedFile(null);
            setSelectedRegister(null);
        } catch (error) {
            throw error
        } finally {
            setLoading(prev => ({ ...prev, upload: false }));
        }
    };

    const handleDownload = async (register: RegisterData) => {
        if (!register.document) return;

        setLoading(prev => ({ ...prev, download: true }));
        
        try {
            const response = await httpClient.get(
                endpoints.register.downloadDocumentRegister(register.id),
                { responseType: 'blob' }
            );
            
            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${register.register_type.replace(/\s+/g, '_')}_document.xlsx`);
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            
            toast.push(
                <Notification title="Success" type="success">
                    {register.register_type} template downloaded successfully
                </Notification>
            );
        } catch (error) {
            toast.push(
                <Notification title="Error" type="error">
                    Failed to download document
                </Notification>
            );
        } finally {
            setLoading(prev => ({ ...prev, download: false }));
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await httpClient.delete(endpoints.register.deleteRegister(id));
            
            toast.push(
                <Notification title="Success" type="success">
                    Register deleted successfully
                </Notification>
            );
            
            // Refresh the list
            await fetchRegisters();
        } catch (error) {
            throw error
        }
    };

    const columns = [
        {
            header: 'Registers',
            enableSorting: false,
            accessorKey: 'register_type',
            cell: ({ row }) => (
                <div className="font-medium">
                    {row.original.register_type}
                </div>
            ),
        },
        {
            header: 'Uploaded Document',
            enableSorting: false,
            accessorKey: 'document',
            cell: ({ row }) => {
                return (
                    <div className="w-40 flex items-center justify-center">
                        {row.original.document ? (
                            <a 
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDownload(row.original);
                                }}
                                className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                <FiFile className="w-5 h-5" />
                            </a>
                        ) : (
                            <div className="text-gray-400">--</div>
                        )}
                    </div>
                )
            }
        },
        {
            header: 'Status',
            enableSorting: false,
            accessorKey: 'is_active',
            cell: ({ row }) => (
                <div className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        row.original.is_active ? 'bg-emerald-500' : 'bg-red-500'
                    }`} />
                    {row.original.is_active ? 'Active' : 'Inactive'}
                </div>
            ),
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Tooltip title="Upload Input Template">
                        <Button
                            size="sm"
                            onClick={() => handleUploadClick(row.original)}
                            icon={<RiUploadLine />}
                            disabled={loading.upload}
                        />
                    </Tooltip>
                    <Tooltip title="Download Input Template">
                        <Button
                            size="sm"
                            onClick={() => handleDownload(row.original)}
                            icon={<HiDownload />}
                            disabled={loading.download || !row.original.document}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Register">
                        <Button
                            size="sm"
                            icon={<FiTrash />}
                            className='hover:bg-transparent text-red-500'
                            onClick={() => handleDelete(row.original.id)}
                            disabled={loading.table}
                        >
                        </Button>
                    </Tooltip>
                </div>
            ),
        },
    ];
    
    const handlePaginationChange = (pageIndex: number, pageSize: number) => {
        setTableData(prev => ({
            ...prev,
            pageIndex,
            pageSize
        }));
    };

    return (
        <div className="relative">
            <DataTable
                columns={columns}
                data={registers}
                loading={loading.table}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ className: 'rounded-md' }}
                pagingData={{
                    total: tableData.total,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                stickyHeader={true}
                stickyFirstColumn={true}
                stickyLastColumn={true}
            />

            <Dialog
                isOpen={isUploadDialogOpen}
                onClose={() => setIsUploadDialogOpen(false)}
                onRequestClose={() => setIsUploadDialogOpen(false)}
            >
                <h5 className="mb-4">Upload {selectedRegister?.register_type}</h5>
                <p className="mb-4 text-sm text-gray-600">
                    Please upload the template for {selectedRegister?.register_type}
                </p>
                <div>
                    <Input
                        type="file"
                        onChange={handleFileChange}
                        className="mb-4"
                    />
                </div>
                <div className="text-right">
                    <Button
                        variant="solid"
                        onClick={handleUpload}
                        disabled={!selectedFile || loading.upload}
                        loading={loading.upload}
                    >
                        Upload
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default RegisterTable;