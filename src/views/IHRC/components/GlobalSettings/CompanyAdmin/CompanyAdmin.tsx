
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard';
import { Button, Dialog, toast, Notification } from '@/components/ui';
import Checkbox from '@/components/ui/Checkbox';
import { HiPlusCircle } from 'react-icons/hi';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import OutlinedInput from '@/components/ui/OutlinedInput';
import { useDispatch } from 'react-redux';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import { createCompanyAdmin, fetchCompanyAdmins } from '@/store/slices/companyAdmin/companyAdminSlice';
import AdminTable from './components/AdminTable';
import * as yup from 'yup';
import { createCompanyGroup } from '@/store/slices/companyAdmin/companyGroupSlice';
import OutlinedPasswordInput from '@/components/ui/OutlinedInput/OutlinedPasswordInput';
const validationSchema = yup.object().shape({
  entityName: yup
  .string()
  .required('Entity name is required')
  .min(3, 'Entity name must be at least 3 characters')
  .matches(/^\S.*\S$|^\S$/, 'The input must not have leading or trailing spaces'),
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .matches(/^\S.*\S$|^\S$/, 'The input must not have leading or trailing spaces'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Must include A-Z, a-z, 0-9, @$!%*?& (Weak Password)'
    ),
  moduleAccess: yup
    .array()
    .of(yup.number())
    .min(1, 'At least one module must be selected'),
});

interface ValidationErrors {
  [key: string]: string;
}

interface Module {
  id: number;
  name: string;
}

const CompanyAdmin = () => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
  // const [entityName, setEntityName] = useState('');
  // const [entityNameError, setEntityNameError] = useState('');
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
    moduleAccess: [] as number[],
    entityName: '' 
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  });

  const handleEntityNameChange = (value: string) => {
    handleInputChange('entityName', value);
  };

  const validatePasswords = () => {
    if (formData.password !== confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords must match'
      }));
      return false;
    }
    return true;
  };

  const refreshData = () => {
    setKey(prev => prev + 1);
  };

  const fetchModules = async () => {
    try {
      const { data } = await httpClient.get(endpoints.module.list());
      setModules(data.data);
    } catch (error) {
      console.error('Error fetching modules:', error);
      showErrorNotification('Failed to fetch modules');
    }
  };

  const fetchAdminData = useCallback(
    async (page = 1, pageSize = 10) => {
      setIsLoading(true);
      try {
        const response = await httpClient.get(endpoints.companyAdmin.list(), {
          params: { page, page_size: pageSize },
        });
        setAdminData(response.data.data);
        setPagination((prev) => ({
          ...prev,
          total: response.data.paginate_data.totalResults,
        }));
        await fetchModules();
      } catch (error) {
        console.error('Error fetching admin data:', error);
        showErrorNotification('Failed to fetch admin data');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );
  // useEffect(()=>{
  //   validateForm();
  // },[formData])

  useEffect(() => {
    fetchAdminData(pagination.pageIndex, pagination.pageSize);
  }, [fetchAdminData, pagination.pageIndex, pagination.pageSize]);

  const validateField = async (field: string, value: any) => {
    try {
      await validationSchema.validateAt(field, { ...formData, [field]: value });
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setErrors(prev => ({
          ...prev,
          [field]: error.message
        }));
      }
    }
  };
  

  const handlePaginationChange = (page: number) => {
    setPagination((prev) => ({ ...prev, pageIndex: page }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: newPageSize,
      pageIndex: 1,
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for the field being changed
    setTouchedFields(prev => ({
    ...prev,
    [field]: true
  }));

  if (touchedFields[field]) {
    validateField(field, value);
  }

  if (field === 'password' && touchedFields.confirmPassword) {
    if (confirmPassword !== value) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords must match'
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        confirmPassword: ''
      }));
    }
  }
  };

  const handleModuleChange = (options: (string | number)[]) => {
    setSelectedModules(options);
    const moduleAccess = options.map(option => Number(option));
    setFormData(prev => ({
      ...prev,
      moduleAccess
    }));
    
    setTouchedFields(prev => ({
      ...prev,
      moduleAccess: true
    }));
  
    if (touchedFields.moduleAccess) {
      validateField('moduleAccess', moduleAccess);
    }
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      moduleAccess: [],
      entityName: ''
    });
    setErrors({});
    setSelectedModules([]);
    setTouchedFields({});
    setConfirmPassword('');
  };

  const sortedModules = useMemo(() => {
    const moduleOrder = ['Audit Checklist', 'Remittance Tracker', 'Register & Return'];
    return [...modules].sort((a, b) => {
      const indexA = moduleOrder.indexOf(a.name);
      const indexB = moduleOrder.indexOf(b.name);
      return indexA - indexB;
    });
  }, [modules]);

  const validateForm = async () => {
    try {
      const validationObject = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        moduleAccess: formData.moduleAccess,
        entityName: formData.entityName
      };

      await validationSchema.validate(validationObject, { abortEarly: false });
      if (!validatePasswords()) {
        return false;
      }
      setErrors({});
      return true;
    } catch (yupError) {
      if (yupError instanceof yup.ValidationError) {
        const newErrors: ValidationErrors = {};
        yupError.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleError = (error: any) => {
    if (error.response?.data?.message) {
      showErrorNotification(error.response.data.message);
    } else if (error.message) {
      showErrorNotification(error.message);
    } else if (Array.isArray(error)) {
      showErrorNotification(error);
    } else {
      showErrorNotification('An unexpected error occurred. Please try again.');
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const isFormValid = await validateForm();
      if (!isFormValid) {
        toast.push(
          <Notification title="Danger" type="danger">
            Please fix the validation errors
          </Notification>
        );
        return;
      }
  console.log(formData)
      try {
        const response = await dispatch(createCompanyAdmin(formData)).unwrap()
        .catch((error: any) => {
          if (error.response?.data?.message) {
            showErrorNotification(error.response.data.message);
          } else if (error.message) {
            showErrorNotification(error.message);
          } else if (Array.isArray(error)) {
            showErrorNotification(error);
          } else {
            showErrorNotification(error);
          }
          throw error;
        });
        handleDialogClose();
        refreshData();
        if(response){
        toast.push(
          <Notification title="Success" type="success">
            Company admin created successfully
          </Notification>
        );
      }
      } catch (error: any) {
        handleError(error);
      }
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
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        onPageSizeChange={handlePageSizeChange}
      />

<Dialog
    isOpen={isDialogOpen}
    onClose={handleDialogClose}
    onRequestClose={handleDialogClose}
    width={600}
  >
    <h5 className="mb-3">Add Company Admin</h5>
    <div className="flex flex-col gap-3">
      {/* Company Group Section */}
      <div className="border-b pb-2">
        <h6 className="text-gray-800 font-medium mb-2">Company Group</h6>
        <div className="w-full">
          <label className="text-gray-600 mb-2 block">Entity Name <span className="text-red-500">*</span></label>
          <OutlinedInput
            label="Entity Name"
            value={formData.entityName}
            onChange={handleEntityNameChange}
          />
          {errors.entityName && (
            <p className="text-red-500 text-xs mt-1">{errors.entityName}</p>
          )}
        </div>
      </div>

      {/* User Details Section */}
      <div className="border-b pb-2">
        <h6 className="text-gray-800 font-medium mb-2">User Details</h6>
        <div className="space-y-4">
          {/* Name and Email row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-gray-600 mb-2 block">Name </label>
              <OutlinedInput
                label="Full Name"
                value={formData.name}
                onChange={(value: string) => handleInputChange('name', value)}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="text-gray-600 mb-2 block">Email <span className="text-red-500">*</span></label>
              <OutlinedInput
                label="Email"
                value={formData.email}
                onChange={(value: string) => handleInputChange('email', value)}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Password and Confirm Password row */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-gray-600 mb-2 block">Password <span className="text-red-500">*</span></label>
              <OutlinedPasswordInput
                label="Password"
                value={formData.password}
                onChange={(value: string) => handleInputChange('password', value)}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="text-gray-600 mb-2 block">Confirm Password <span className="text-red-500">*</span></label>
              <OutlinedPasswordInput
                label="Confirm Password"
                value={confirmPassword}
                onChange={(value: string) => {
                  setConfirmPassword(value);
                  setErrors(prev => ({
                    ...prev,
                    confirmPassword: ''
                  }));
                }}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Module List Section */}
      <div>
        <h6 className="text-gray-800 font-medium mb-2">Module List</h6>
        <div className="border rounded p-2">
          <Checkbox.Group
            value={selectedModules}
            onChange={handleModuleChange}
            className="flex flex-row flex-wrap gap-3"
          >
            {sortedModules
              .filter(module => module.name === 'Remittance Tracker')
              .map(module => (
                <div key={module.id} className="flex-1 min-w-[180px]">
                  <Checkbox value={module.id} className="inline-flex items-center">
                    <span className="ml-2 whitespace-nowrap">{module.name}</span>
                  </Checkbox>
                </div>
              ))}
          </Checkbox.Group>
          {errors.moduleAccess && (
            <p className="text-red-500 text-xs mt-1">{errors.moduleAccess}</p>
          )}
        </div>
      </div>
    </div>

    <div className="flex justify-end gap-2 mt-3">
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