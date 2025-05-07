import React, { useState } from 'react';
import { Button, Dialog, Input, Notification, toast } from '@/components/ui';
import { HiDownload, HiUpload } from 'react-icons/hi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';


interface PoshBulkUploadProps {
  onSuccess?: () => void;
}


const PoshBulkUpload = ({ onSuccess }: PoshBulkUploadProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [remark, setRemark] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    if (!file) {
      toast.push(
        <Notification title="Error" type="error">
          Please select a file to upload
        </Notification>
      );
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (remark) {
        formData.append('remark', remark);
      }

      await httpClient.post(endpoints.posh.bulkUpload(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.push(
        <Notification title="Success" type="success">
          Bulk upload successful!
        </Notification>
      );
      setIsDialogOpen(false);
      setRemark('');
      setFile(null);
      if (onSuccess) {
        onSuccess();
    }
    } catch (error: any) {
      toast.push(
        <Notification title="Error" type="error">
          {error.response?.data?.message || 'Upload failed'}
        </Notification>
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setRemark('');
    setFile(null);
  };

  const handleDownloadTemplate = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await httpClient.get(endpoints.posh.downloadTemplate(), {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'POSH_Template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
   } catch (error) {
      toast.push(
        <Notification title="Error" type="error">
          Failed to download template
        </Notification>
      );
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <>
      <Button 
        variant="solid" 
        size="sm" 
        icon={<HiUpload />} 
        onClick={handleUploadClick}
      >
        Bulk Upload
      </Button>

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleCancel}
        width={450}
      >
        <h5 className="mb-4">Bulk Upload POSH Authorities</h5>
        <div className="my-4 flex gap-2 items-center">
          <p>Download Bulk Upload Format</p>
          <Button 
            size="xs" 
            icon={<HiDownload />} 
            onClick={handleDownloadTemplate}
          >
            Download Template
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <p>Upload POSH File:</p>
          <Input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
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
            loading={isLoading}
          >
            Confirm
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default PoshBulkUpload;