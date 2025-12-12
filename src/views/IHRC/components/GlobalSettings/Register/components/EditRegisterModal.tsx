import React, { useState, useEffect, useRef } from 'react';
import { Dialog, Button, Notification, toast } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';

interface EditRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  registerId: number;
  onSuccess: () => void;
  
}

interface RegisterDetails {
  company: {
    name: string;
  };
  company_admin: {
    name: string;
    email: string;
  };
  year: number;
  description?: string;
  status: 'pending' | 'processed' | 'completed';
  file_info: {
    original_zip_path: string;
    processed_zip_path?: string;
  };
}

const EditRegisterModal: React.FC<EditRegisterModalProps> = ({
  isOpen,
  onClose,
  registerId,
  onSuccess
}) => {
  const [registerData, setRegisterData] = useState<RegisterDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'pending' | 'processed' | 'completed'>('pending');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && registerId) {
      fetchRegisterDetails();
    }
  }, [isOpen, registerId]);

  const fetchRegisterDetails = async () => {
    try {
      setIsLoading(true);
      const response = await httpClient.get(endpoints.registers.detail(registerId));
      const data = response.data.data;
      setRegisterData(data);
      setDescription(data.description || '');
      setStatus(data.status);
    } catch (error) {
      console.error('Error fetching register details:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to fetch register details
        </Notification>
      );
    } finally {
      setIsLoading(false);
    }
  };

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
      
      if (selectedFile.size > 20 * 1024 * 1024 * 1024) {
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

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);

      // If there's a new file, upload it first
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        if (description) {
          formData.append('description', description);
        }

        await httpClient.put(
          endpoints.registers.uploadProcessed(registerId),
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      // Update status if changed
      if (status !== registerData?.status) {
        await httpClient.put(endpoints.registers.updateStatus(registerId), {
          status,
          remarks: description
        });
      }

      toast.push(
        <Notification title="Success" type="success">
          Register updated successfully
        </Notification>
      );

      onSuccess();
    } catch (error: any) {
      console.error('Update error:', error);
      toast.push(
        <Notification title="Error" type="error">
          {error.response?.data?.message || 'Failed to update register'}
        </Notification>
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = () => {
    if (registerData) {
      setDescription(registerData.description || '');
      setStatus(registerData.status);
    }
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (isLoading) {
    return (
      <Dialog isOpen={isOpen} onClose={handleClose} width={600}>
        <div className="py-8 text-center">Loading...</div>
      </Dialog>
    );
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      onRequestClose={handleClose}
      width={700}
    >
      {registerData?.file_info.processed_zip_path ? (
        <h5 className="mb-2">Update Output Register ZIP File</h5>
      ) : (
        <h5 className="mb-2">Upload Output Register ZIP File</h5>
      )}
      
      {registerData && (
        <div className="space-y-2">
        

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {registerData?.file_info.processed_zip_path ? (
        "Update Output ZIP File (Optional)"
      ) : (
        ""
      )}
            
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".zip"
                className="hidden"
                id="update-zip-file"
              />
              <label
                htmlFor="update-zip-file"
                className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Choose New File
              </label>
              <span className="ml-3 text-sm text-gray-500">
                {file ? file.name : 'No file chosen'}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {registerData?.file_info.processed_zip_path ? (
        "Leave empty to keep existing processed file"
      ) : (
        ""
      )}
            </p>
          </div>

          {registerData.file_info.processed_zip_path && (
            <div className="p-3 bg-gray-50 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Processed File
              </label>
              <p className="text-sm text-gray-600">
                A processed file already exists. Uploading a new file will replace it.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end gap-2 mt-8">
        <Button variant="plain" onClick={handleClose} disabled={isUpdating}>
          Cancel
        </Button>
        <Button
          variant="solid"
          onClick={handleUpdate}
          loading={isUpdating}
        >
          Upload
        </Button>
      </div>
    </Dialog>
  );
};

export default EditRegisterModal;