import React, { useState } from 'react';
import { Button, Dialog, Input, Notification, toast } from '@/components/ui';
import { HiDownload, HiUpload } from 'react-icons/hi';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';

const BulkUpload = ({ refreshTable }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [remark, setRemark] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirm = async () => {
    try {
      setIsUploading(true);
      
      if (!file) {
        toast.push(
          <Notification title="Error" type="danger">
            Please select a file to upload
          </Notification>
        );
        return;
      }
  
      const formData = new FormData();
      formData.append('document', file);
      formData.append('remark', remark);
      
      const res = await httpClient.post(
        endpoints.compliances.bulkCreate(),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (res) {
        toast.push(
          <Notification title="Success" type="success">
            Upload successful!
          </Notification>
        );
        
        // Close dialog and reset state
        handleCancel();
        
        // Refresh the table data
        await refreshTable();
      }
    } catch (error) {
      toast.push(
        <Notification title="Error" type="danger">
          Upload failed. Please try again.
        </Notification>
      );
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setRemark('');
    setFile(null);
    setIsUploading(false);
  };

  const handleDownload = async () => {
    try {
      const res = await httpClient.get(endpoints.compliances.downloadFormat(), {
        responseType: "blob",
      });
      
      const blob = new Blob([res.data], { type: "text/xlsx" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "MasterCompliance.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
        <h5 className="mb-4">Add Compliances</h5>
        <div className="my-4 flex gap-2 items-center">
          <p>Download Bulk Upload Format</p>
          <a onClick={handleDownload} className="text-blue-600 hover:underline">
            <Button size="xs" icon={<HiDownload />}>Download</Button>
          </a>
        </div>
        <div className="flex flex-col gap-2">
          <p>Upload Compliance File:</p>
          <Input
            type="file"
            onChange={handleFileChange}
            className="mb-4"
          />
        </div>
        <p>Enter the Remark:</p>
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
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            size="sm"
            onClick={handleConfirm}
            loading={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Confirm'}
          </Button>
        </div>
      </Dialog>
    </>
  );
};

export default BulkUpload;