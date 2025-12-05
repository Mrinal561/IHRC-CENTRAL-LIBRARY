import React, { useState, useRef } from 'react';
import { Dialog, Button, Notification, toast } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface UploadProcessedModalProps {
  isOpen: boolean;
  onClose: () => void;
  registerId: number;
  onSuccess: () => void;
}

const UploadProcessedModal: React.FC<UploadProcessedModalProps> = ({
  isOpen,
  onClose,
  registerId,
  onSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
        toast.push(
          <Notification title="Error" type="error">
            Only ZIP files are allowed
          </Notification>
        );
        return;
      }
      
      if (selectedFile.size > 20 * 1024 * 1024 * 1024) { // 20GB
        toast.push(
          <Notification title="Error" type="error">
            File size exceeds 20GB limit
          </Notification>
        );
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.push(
        <Notification title="Error" type="error">
          Please select a ZIP file
        </Notification>
      );
      return;
    }

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      if (description) {
        formData.append('description', description);
      }

      await httpClient.post(
        endpoints.register.uploadProcessed(registerId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.push(
        <Notification title="Success" type="success">
          Processed ZIP uploaded successfully
        </Notification>
      );

      onSuccess();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.push(
        <Notification title="Error" type="error">
          {error.response?.data?.message || 'Failed to upload processed ZIP'}
        </Notification>
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setDescription('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      onRequestClose={handleClose}
      width={600}
    >
      <h5 className="mb-6">Upload Processed ZIP File</h5>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ZIP File <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".zip"
              className="hidden"
              id="zip-file"
            />
            <label
              htmlFor="zip-file"
              className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Choose File
            </label>
            <span className="ml-3 text-sm text-gray-500">
              {file ? file.name : 'No file chosen'}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Maximum file size: 20GB. Only .zip files are allowed.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <OutlinedInput
            textarea
            value={description}
            onChange={setDescription}
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-8">
        <Button variant="plain" onClick={handleClose} disabled={isUploading}>
          Cancel
        </Button>
        <Button
          variant="solid"
          onClick={handleUpload}
          loading={isUploading}
          disabled={!file}
        >
          Upload
        </Button>
      </div>
    </Dialog>
  );
};

export default UploadProcessedModal;