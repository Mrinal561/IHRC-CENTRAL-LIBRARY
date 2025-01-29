import React, { useState } from 'react';
import { Button, Dialog, Input, Notification, toast } from '@/components/ui';
import { HiDownload, HiUpload } from 'react-icons/hi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import { useDispatch } from 'react-redux';
import { createExternalUser } from '@/store/slices/externaluser/externalUserSlice';
import { HiPlusCircle } from 'react-icons/hi';

interface ExternalUserUploadProps {
    onUploadConfirm: () => void;
}

const ExternalUserUpload: React.FC<ExternalUserUploadProps> = ({ onUploadConfirm }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    
    const dispatch = useDispatch();

    const handleUploadClick = () => {
        setIsDialogOpen(true);
    };

    const handleConfirm = async () => {
        try {      
            if (!file) {
                toast.push(
                    <Notification title="Error" type="danger">
                        Please select a file to upload
                    </Notification>
                );
                return;
            }
            
            setLoading(true);
            const formData = new FormData();
            formData.append('document', file);

            const res = await dispatch(createExternalUser(formData))
                .unwrap()
                .catch((error: any) => {
                    if (error.response?.data?.message) {
                        showErrorNotification(error.response.data.message);
                    } else if (error.message) {
                        showErrorNotification(error.message);
                    } else if (Array.isArray(error)) {
                        showErrorNotification(error);
                    } else {
                        showErrorNotification('An unexpected error occurred. Please try again.');
                    }
                    throw error;
                });

            if (res) {
                toast.push(
                    <Notification title="Success" type="success">
                        Upload successful!
                    </Notification>
                );
                handleCancel();
                onUploadConfirm();
            }
        } catch (error) {
            console.error('Upload error:', error);
            setIsDialogOpen(false)
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsDialogOpen(false);
        setFile(null);
    };

    const handleDownloadFormat = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        try {
            const response = await httpClient.get(endpoints.externaluser.template(), {
                responseType: "blob"
            });
            
            const blob = new Blob([response.data], { 
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "ExternalUserTemplate.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to download template. Please try again.
                </Notification>
            );
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    return (
        <>
            <Button 
                variant="solid" 
                size="sm" 
                icon={<HiPlusCircle />} 
                onClick={handleUploadClick}
            >
               Bulk Upload External User
            </Button>

            <Dialog
                isOpen={isDialogOpen}
                onClose={handleCancel}
                width={500}
                shouldCloseOnOverlayClick={false} 
            >
                <h5 className="mb-4">Upload External Users</h5>
                
                <div className="flex flex-col gap-2">
                    <p>Upload External Users File:</p>
                    <Input
                        type="file"
                        onChange={handleFileChange}
                        className="mb-4"
                        accept=".xlsx,.xls"
                    />
                </div>
                <div className="my-4 flex gap-2 items-center">
                    <a onClick={handleDownloadFormat} className="text-blue-600 hover:underline">
                        <Button size="sm" icon={<HiDownload />}>
                            Download Format
                        </Button>
                    </a>
                </div>
                <div className="mt-6 text-right">
                    <Button
                        size="sm"
                        className="mr-2"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        onClick={handleConfirm}
                        loading={loading}
                    >
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </>
    );
};

export default ExternalUserUpload;