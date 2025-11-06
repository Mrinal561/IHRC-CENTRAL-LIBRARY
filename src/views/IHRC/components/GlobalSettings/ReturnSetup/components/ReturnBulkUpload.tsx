import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';
import { Button, Dialog, Input, toast, Notification } from '@/components/ui'
import React, { useState } from 'react'
import { HiDownload, HiUpload } from 'react-icons/hi'

interface ReturnBulkUploadProps {
    onSuccess: () => void;
}

const ReturnBulkUpload = ({ onSuccess }: ReturnBulkUploadProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [remark, setRemark] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.push(
                <Notification title="Error" type="error">
                    Please select a file to upload
                </Notification>
            );
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('remark', remark);

        try {
            setLoading(true);
            await httpClient.post(endpoints.return.bulkUpload(), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.push(
                <Notification title="Success" type="success">
                    Bulk upload successful
                </Notification>
            );
            setIsDialogOpen(false);
            setSelectedFile(null);
            setRemark('');
            onSuccess(); // Refresh the table data
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.push(
                <Notification title="Error" type="error">
                    {error.response?.data?.message || 'Upload failed'}
                </Notification>
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const response = await httpClient.get(endpoints.return.downloadTemplate(), {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'ReturnSetupTemplate.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Template download error:', error);
            toast.push(
                <Notification title="Error" type="error">
                    Failed to download template
                </Notification>
            );
        }
    };

    return (
        <div>
            <Button 
                variant="solid"
                size='sm'
                icon={<HiUpload />}
                onClick={() => setIsDialogOpen(true)}
            >
                Bulk Upload
            </Button>

            <Dialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                width={450}
                shouldCloseOnOverlayClick={false}
            >
                <h5 className="mb-4">Bulk Upload</h5>
                <div className="my-4 flex gap-2 items-center">
                    <p>Download Format</p>
                    <Button 
                        size="xs" 
                        icon={<HiDownload />}                             
                        onClick={handleDownloadTemplate}
                    >
                        Download
                    </Button>
                </div>
                <div className="flex flex-col gap-2">
                    <p>Upload Return Setup File:</p>
                    <Input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileSelect}
                        className="mb-4"
                    />
                </div>
                <p>Please Enter the Remark:</p>
                <textarea
                    className="w-full p-2 border rounded mb-2"
                    rows={3}
                    placeholder="Enter remark"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                />
                <div className="mt-6 text-right flex gap-2 justify-end items-center">
                    <Button
                        size="sm"
                        className="mr-2"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        onClick={handleUpload}
                        loading={loading}
                    >
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default ReturnBulkUpload