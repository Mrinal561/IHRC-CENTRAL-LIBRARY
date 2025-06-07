



import React, { useState } from 'react';
import DataTable from '@/components/shared/DataTable';
import { Button, Dialog, Input, toast, Notification, Tooltip } from '@/components/ui';
import { RiUploadLine, RiDownloadLine, RiFileTextLine } from 'react-icons/ri';
import { HiDownload } from 'react-icons/hi';
import { FiFile } from 'react-icons/fi';

interface RegisterData {
    id: number;
    name: string;
    hasDocument: boolean;
}

const RegisterTable = () => {
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedRegister, setSelectedRegister] = useState<RegisterData | null>(null);
    const [tableData, setTableData] = useState({
        total: 4,
        pageIndex: 1,
        pageSize: 10,
    });
    const [registers, setRegisters] = useState<RegisterData[]>([
        { id: 1, name: 'Salary Register', hasDocument: false },
        { id: 2, name: 'Attendance Register', hasDocument: true },
        { id: 3, name: 'Leave Register', hasDocument: false },
        { id: 4, name: 'Bonus Register', hasDocument: false },
        { id: 5, name: 'Maternity Register', hasDocument: false }
    ]);

    const handleUploadClick = (register: RegisterData) => {
        setSelectedRegister(register);
        setIsUploadDialogOpen(true);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (selectedFile && selectedRegister) {
            setTimeout(() => {
                // Update the register to show it has a document
                setRegisters(registers.map(reg => 
                    reg.id === selectedRegister.id ? { ...reg, hasDocument: true } : reg
                ));
                
                toast.push(
                    <Notification title="Success" type="success">
                        Document uploaded successfully
                    </Notification>,
                );
                setIsUploadDialogOpen(false);
                setSelectedFile(null);
                setSelectedRegister(null);
            }, 1000);
        }
    };

    const handleDownload = (register: RegisterData) => {
        toast.push(
            <Notification title="Success" type="success">
                {register.name} template downloaded successfully
            </Notification>,
        );
    };

    const columns = [
        {
            header: 'Registers',
            enableSorting: false,
            accessorKey: 'name',
            cell: ({ row }) => (
                <div className="font-medium">
                    {row.original.name}
                </div>
            ),
        },
        {
            header: 'Uploaded Document',
            enableSorting: false,
            accessorKey: 'hasDocument',
            cell: ({ row }) => {
              return (
 <div className="w-40 flex items-center justify-center">
                       {row.original.hasDocument ? (
                        <a 
                                href={row.original.hasDocument} 
                                target="_blank"
                                rel="noopener noreferrer"
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
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Tooltip title="Upload Input Template">

                    <Button
                        size="sm"
                        // variant="plain"
                        onClick={() => handleUploadClick(row.original)}
                        icon={<RiUploadLine />}
                        />
                        </Tooltip>
                    <Tooltip title="Download Input Template">
                    <Button
                        size="sm"
                        // variant="plain"
                        onClick={() => handleDownload(row.original)}
                        icon={<HiDownload />}
                    />
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
                loading={false}
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
                <h5 className="mb-4">Upload {selectedRegister?.name}</h5>
                <p className="mb-4 text-sm text-gray-600">
                    Please upload the template for {selectedRegister?.name}
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
                        disabled={!selectedFile}
                    >
                        Upload
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default RegisterTable;