import React from 'react'
import ReturnBulkUpload from './ReturnBulkUpload'
import { Button, Notification, toast } from '@/components/ui'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'

interface ReturnSetupToolProps {
  onSuccess: () => void;
}

const ReturnSetupTool = ({ onSuccess }: ReturnSetupToolProps) => {
    const navigate = useNavigate();

    const handleAddReturnSetup = () => {
        navigate('/add-return-setup')
    }

    const handleDownload = async () => {
        try {
            const response = await httpClient.get(endpoints.return.downloadData(), {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'ReturnSetupData.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.push(
                <Notification title="Success" type="success">
                    Download successful
                </Notification>
            );
        } catch (error) {
            console.error('Download error:', error);
            toast.push(
                <Notification title="Error" type="error">
                    Failed to download data
                </Notification>
            );
        }
    }

    return (
        <div className='flex gap-2 items-center w-full'>
            <Button 
                variant='solid' 
                icon={<HiDownload />} 
                size='sm'
                onClick={handleDownload}
            >
                Download
            </Button>

            <div>
                <ReturnBulkUpload onSuccess={onSuccess} />
            </div>
            
            <Button 
                variant='solid' 
                icon={<HiPlusCircle />} 
                size='sm' 
                onClick={handleAddReturnSetup}
            >
                Add Return Setup
            </Button>
        </div>
    )
}

export default ReturnSetupTool