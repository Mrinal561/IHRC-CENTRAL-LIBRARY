
import React, { useState, useEffect, useMemo } from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard';
import { Button, Dialog } from '@/components/ui';
import Checkbox from '@/components/ui/Checkbox';
import { HiPlusCircle } from 'react-icons/hi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import OutlinedInput from '@/components/ui/OutlinedInput';
import { useDispatch } from 'react-redux';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import { createCompanyAdmin, fetchCompanyAdmins } from '@/store/slices/companyAdmin/companyAdminSlice';
import AdminTable from './components/AdminTable';

interface Module {
  id: number;
  name: string;
}

const CompanyAdmin = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModules, setSelectedModules] = useState<(string | number)[]>([]);
  const [key, setKey] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    moduleAccess: [] as number[]
  });

  const refreshData = () => {
    setKey(prev => prev + 1);
  };

  const fetchModules = async () => {
    try {
      const { data } = await httpClient.get(endpoints.module.list());
      setModules(data.data);
      console.log('Modules data:', data.data);
      console.log('modules', modules)
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const fetchAdminData = async (page = 1, pageSize = 10) => {
    setIsLoading(true);
    try {
      // Fetch admin data using the fetchCompanyAdmins endpoint
      const  data  = await dispatch(fetchCompanyAdmins())
      setAdminData(data.payload);
      console.log('Admin Data:', data.payload);
      await fetchModules();
    } catch (error) {
      console.error('Error fetching admin data:', error);
      showErrorNotification('Failed to fetch admin data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Initial Company Admin Rendering");
    fetchAdminData();
  }, [key]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleModuleChange = (options: (string | number)[]) => {
    setSelectedModules(options);
    // Update formData with the selected module IDs
    setFormData(prev => ({
      ...prev,
      moduleAccess: options.map(option => Number(option))
    }));
    console.log('Selected modules:', options);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      moduleAccess: []
    });
    setSelectedModules([]);
  };

  const sortedModules = useMemo(() => {
    const moduleOrder = ['Audit Checklist', 'Remittance Tracker', 'Register & Return'];
    return [...modules].sort((a, b) => {
        const indexA = moduleOrder.indexOf(a.name);
        const indexB = moduleOrder.indexOf(b.name);
        return indexA - indexB;
    });
}, [modules]);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const result = await dispatch(createCompanyAdmin(formData))
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

      // If successful, close dialog and refresh data
      handleDialogClose();
      refreshData();
    } catch (error) {
      console.error('Error creating company admin:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">Company Admin</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="solid"
            size="sm"
            icon={<HiPlusCircle />}
            onClick={() => setIsDialogOpen(true)}
          >
            Add
          </Button>
        </div>
      </div>

      <AdminTable 
      adminData={adminData}
      modules={modules}
      isLoading={isLoading}
      onDataChange={fetchAdminData}
    />

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
      >
        <h5 className="mb-6">Add Company Admin</h5>
        <div className="flex flex-col gap-6">
          <div className="w-full">
            <label className="text-gray-600 mb-2 block">Name <span className="text-red-500">*</span></label>
            <OutlinedInput
              label="Name"
              value={formData.name}
              onChange={(value: string) => handleInputChange('name', value)}
            />
          </div>
          <div className="w-full">
            <label className="text-gray-600 mb-2 block">Email <span className="text-red-500">*</span></label>
            <OutlinedInput
              label="Email"
              value={formData.email}
              onChange={(value: string) => handleInputChange('email', value)}
            />
          </div>
          <div className="w-full">
            <label className="text-gray-600 mb-2 block">Password <span className="text-red-500">*</span></label>
            <OutlinedInput
              label="Password"
              value={formData.password}
              onChange={(value: string) => handleInputChange('password', value)}
            />
          </div>
          <div className="w-full">
            <label className="text-gray-600 mb-2 block">Modules</label>
            <div className="border rounded p-4">
              <Checkbox.Group value={selectedModules} onChange={handleModuleChange}  className="flex flex-row flex-wrap gap-6">
                {sortedModules.map(module => (
                   <div key={module.id}  className="flex-1 min-w-[180px]">
                   <Checkbox 
                       value={module.id}
                       className="inline-flex items-center"
                   >
                       <span className="ml-2 whitespace-nowrap">{module.name}</span>
                   </Checkbox>
               </div>
                ))}
              </Checkbox.Group>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="plain"
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button 
            variant="solid" 
            onClick={handleConfirm}
            loading={isLoading}
          >
            Confirm
          </Button>
        </div>
      </Dialog>
    </AdaptableCard>
  );
};

export default CompanyAdmin;