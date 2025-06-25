import React, { useState } from 'react';
import { Button, Dialog, Input, Notification, toast } from '@/components/ui';
import { HiDownload, HiUpload } from 'react-icons/hi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface LWFBulkUploadProps {
  onUploadSuccess?: () => void;
  companyId?: any;
  onClose?: () => void;
}

const BulkUploadCompliance: React.FC<LWFBulkUploadProps> = ({
  onUploadSuccess,
  companyId,
  onClose
}) => {
  const [remark, setRemark] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.push(
        <Notification title="Error" type="error">
          Please select a file to upload
        </Notification>
      );
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (remark) formData.append('remark', remark);
      if (companyId) formData.append('company_id', companyId);

      await httpClient.post(endpoints.compliances.bulkUpload(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.push(
        <Notification title="Success" type="success">
          File uploaded successfully
        </Notification>
      );

      onUploadSuccess?.();
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload file';
      toast.push(
        <Notification title="Error" type="error">
          {errorMessage}
        </Notification>
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await httpClient.get(endpoints.compliances.downloadTemplate(), {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Compliance_Template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to download template
        </Notification>
      );
    }
  };

  return (
    <Dialog
      isOpen={true}
      onClose={onClose || (() => {})}
      width={450}
      shouldCloseOnOverlayClick={!isUploading}
    >
      <h5 className="mb-4">Bulk Upload Compliance</h5>
      <div className="my-4 flex gap-2 items-center">
        <p>Download Template:</p>
        <Button 
          size="xs" 
          icon={<HiDownload />}
          onClick={handleDownloadTemplate}
          disabled={isUploading}
        >
          Download
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <p>Upload Compliance File (Excel):</p>
        <Input
          type="file"
          onChange={handleFileChange}
          accept=".xlsx,.xls"
          className="mb-4"
          disabled={isUploading}
        />
      </div>
      <p>Remarks (Optional):</p>
      <textarea
        className="w-full p-2 border rounded mb-2"
        rows={3}
        placeholder="Enter remark"
        value={remark}
        onChange={(e) => setRemark(e.target.value)}
        disabled={isUploading}
      />
      <div className="mt-6 text-right flex gap-2 justify-end items-center">
        <Button
          size="sm"
          className="mr-2"
          onClick={onClose || (() => {})}
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button
          variant="solid"
          size="sm"
          loading={isUploading}
          onClick={handleSubmit}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </Dialog>
  );
};

export default BulkUploadCompliance;