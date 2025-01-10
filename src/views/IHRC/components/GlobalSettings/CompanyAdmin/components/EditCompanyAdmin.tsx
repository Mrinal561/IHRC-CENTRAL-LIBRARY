import React, { useState, useEffect } from 'react';
import { Button, Dialog, Notification, toast } from '@/components/ui';
import Checkbox from '@/components/ui/Checkbox';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedPasswordInput from '@/components/ui/OutlinedInput/OutlinedPasswordInput';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  entityName: yup
    .string()
    .required('Entity name is required')
    .min(3, 'Entity name must be at least 3 characters')
    .matches(/^\S.*\S$|^\S$/, 'The input must not have leading or trailing spaces'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
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

interface EditCompanyAdminProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => Promise<void>;
  adminData: {
    id: number;
    name: string;
    email: string;
    entityName: string;
    moduleAccessNames: string[];
  };
  modules: Module[];
  isLoading: boolean;
}

const EditCompanyAdmin: React.FC<EditCompanyAdminProps> = ({
  isOpen,
  onClose,
  onConfirm,
  adminData,
  modules,
  isLoading,
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
  const [selectedModules, setSelectedModules] = useState<(string | number)[]>([]);
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    email: '',
    moduleAccess: [] as number[],
    entityName: ''
  });

  useEffect(() => {
    if (adminData) {
      setFormData({
        id: adminData.id,
        name: adminData.name || '',
        email: adminData.email || '',
        moduleAccess: modules
          .filter(module => adminData.moduleAccessNames.includes(module.name))
          .map(module => module.id),
        entityName: adminData.entityName || ''
      });
      setSelectedModules(adminData.moduleAccessNames);
    }
  }, [adminData, modules]);

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setTouchedFields(prev => ({
      ...prev,
      [field]: true
    }));

    if (touchedFields[field]) {
      validateField(field, value);
    }
  };

  const handleModuleChange = (options: (string | number)[]) => {
    setSelectedModules(options);
    const moduleAccess = modules
      .filter(module => options.includes(module.name))
      .map(module => module.id);
    
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
    onClose();
    setErrors({});
    setTouchedFields({});
  };

  const validateForm = async () => {
    try {
      const validationObject = {
        entityName: formData.entityName,
        email: formData.email,
        moduleAccess: formData.moduleAccess,
      };

      await validationSchema.validate(validationObject, { abortEarly: false });
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

  const handleConfirm = async () => {
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

      await onConfirm(formData);
      handleDialogClose();
    } catch (error) {
      console.error('Error updating admin:', error);
    }
  };

  const sortedModules = React.useMemo(() => {
    const moduleOrder = ['Audit Checklist', 'Remittance Tracker', 'Register & Return'];
    return [...modules].sort((a, b) => {
      const indexA = moduleOrder.indexOf(a.name);
      const indexB = moduleOrder.indexOf(b.name);
      return indexA - indexB;
    });
  }, [modules]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleDialogClose}
      onRequestClose={handleDialogClose}
      width={600}
    >
      <h5 className="mb-3">Edit Company Admin</h5>
      <div className="flex flex-col gap-3">
        {/* Company Group Section */}
        <div className="border-b pb-2">
          <h6 className="text-gray-800 font-medium mb-2">Company Group</h6>
          <div className="w-full">
            <label className="text-gray-600 mb-2 block">Entity Name <span className="text-red-500">*</span></label>
            <OutlinedInput
              label="Entity Name"
              value={formData.entityName}
              onChange={(value: string) => handleInputChange('entityName', value)}
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
                <label className="text-gray-600 mb-2 block">Name</label>
                <OutlinedInput
                  label="Full Name"
                  value={formData.name}
                  onChange={(value: string) => handleInputChange('name', value)}
                />
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
                    <Checkbox value={module.name} className="inline-flex items-center">
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
          Save Changes
        </Button>
      </div>
    </Dialog>
  );
};

export default EditCompanyAdmin;