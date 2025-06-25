// import React, { useState, useEffect } from 'react';
// import { Button, Dialog, Notification, toast } from '@/components/ui';
// import Checkbox from '@/components/ui/Checkbox';
// import OutlinedInput from '@/components/ui/OutlinedInput';
// import OutlinedPasswordInput from '@/components/ui/OutlinedInput/OutlinedPasswordInput';
// import * as yup from 'yup';

// const validationSchema = yup.object().shape({
//   entityName: yup
//     .string()
//     .required('Entity name is required')
//     .min(3, 'Entity name must be at least 3 characters')
//     .matches(/^\S.*\S$|^\S$/, 'The input must not have leading or trailing spaces'),
//   email: yup
//     .string()
//     .email('Invalid email address')
//     .required('Email is required'),
//   moduleAccess: yup
//     .array()
//     .of(yup.number())
//     .min(1, 'At least one module must be selected'),
// });

// interface ValidationErrors {
//   [key: string]: string;
// }

// interface Module {
//   id: number;
//   name: string;
// }

// interface EditCompanyAdminProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: (data: any) => Promise<void>;
//   adminData: {
//     id: number;
//     name: string;
//     email: string;
//     entityName: string;
//     moduleAccessNames: string[];
//   };
//   modules: Module[];
//   isLoading: boolean;
// }

// const EditCompanyAdmin: React.FC<EditCompanyAdminProps> = ({
//   isOpen,
//   onClose,
//   onConfirm,
//   adminData,
//   modules,
//   isLoading,
// }) => {
//   const [errors, setErrors] = useState<ValidationErrors>({});
//   const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
//   const [selectedModules, setSelectedModules] = useState<(string | number)[]>([]);
//   const [formData, setFormData] = useState({
//     id: 0,
//     name: '',
//     email: '',
//     moduleAccess: [] as number[],
//     entityName: ''
//   });

//   useEffect(() => {
//     if (adminData) {
//       setFormData({
//         id: adminData.id,
//         name: adminData.name || '',
//         email: adminData.email || '',
//         moduleAccess: modules
//           .filter(module => adminData.moduleAccessNames.includes(module.name))
//           .map(module => module.id),
//         entityName: adminData.entityName || ''
//       });
//       setSelectedModules(adminData.moduleAccessNames);
//     }
//   }, [adminData, modules]);

//   const validateField = async (field: string, value: any) => {
//     try {
//       await validationSchema.validateAt(field, { ...formData, [field]: value });
//       setErrors(prev => ({
//         ...prev,
//         [field]: ''
//       }));
//     } catch (error) {
//       if (error instanceof yup.ValidationError) {
//         setErrors(prev => ({
//           ...prev,
//           [field]: error.message
//         }));
//       }
//     }
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//     setTouchedFields(prev => ({
//       ...prev,
//       [field]: true
//     }));

//     if (touchedFields[field]) {
//       validateField(field, value);
//     }
//   };

//   const handleModuleChange = (options: (string | number)[]) => {
//     setSelectedModules(options);
//     const moduleAccess = modules
//       .filter(module => options.includes(module.name))
//       .map(module => module.id);
    
//     setFormData(prev => ({
//       ...prev,
//       moduleAccess
//     }));
    
//     setTouchedFields(prev => ({
//       ...prev,
//       moduleAccess: true
//     }));
  
//     if (touchedFields.moduleAccess) {
//       validateField('moduleAccess', moduleAccess);
//     }
//   };

//   const handleDialogClose = () => {
//     onClose();
//     setErrors({});
//     setTouchedFields({});
//   };

//   const validateForm = async () => {
//     try {
//       const validationObject = {
//         entityName: formData.entityName,
//         email: formData.email,
//         moduleAccess: formData.moduleAccess,
//       };

//       await validationSchema.validate(validationObject, { abortEarly: false });
//       setErrors({});
//       return true;
//     } catch (yupError) {
//       if (yupError instanceof yup.ValidationError) {
//         const newErrors: ValidationErrors = {};
//         yupError.inner.forEach((error) => {
//           if (error.path) {
//             newErrors[error.path] = error.message;
//           }
//         });
//         setErrors(newErrors);
//       }
//       return false;
//     }
//   };

//   const handleConfirm = async () => {
//     try {
//       const isFormValid = await validateForm();
//       if (!isFormValid) {
//         toast.push(
//           <Notification title="Danger" type="error">
//             Please fix the validation errors
//           </Notification>
//         );
//         return;
//       }

//       await onConfirm(formData);
//       handleDialogClose();
//     } catch (error) {
//       console.error('Error updating admin:', error);
//     }
//   };

//   const sortedModules = React.useMemo(() => {
//     const moduleOrder = ['Audit Tracker', 'Remittance Tracker', 'Register & Return'];
//     return [...modules].sort((a, b) => {
//       const indexA = moduleOrder.indexOf(a.name);
//       const indexB = moduleOrder.indexOf(b.name);
//       return indexA - indexB;
//     });
//   }, [modules]);

//   return (
//     <Dialog
//       isOpen={isOpen}
//       onClose={handleDialogClose}
//       onRequestClose={handleDialogClose}
//       width={600}
//     >
//       <h5 className="mb-3">Edit Company Admin</h5>
//       <div className="flex flex-col gap-3">
//         {/* Company Group Section */}
//         <div className="border-b pb-2">
//           <h6 className="text-gray-800 font-medium mb-2">Company Group</h6>
//           <div className="w-full">
//             <label className="text-gray-600 mb-2 block">Entity Name <span className="text-red-500">*</span></label>
//             <OutlinedInput
//               label="Entity Name"
//               value={formData.entityName}
//               onChange={(value: string) => handleInputChange('entityName', value)}
//             />
//             {errors.entityName && (
//               <p className="text-red-500 text-xs mt-1">{errors.entityName}</p>
//             )}
//           </div>
//         </div>

//         {/* User Details Section */}
//         <div className="border-b pb-2">
//           <h6 className="text-gray-800 font-medium mb-2">User Details</h6>
//           <div className="space-y-4">
//             {/* Name and Email row */}
//             <div className="flex gap-4">
//               <div className="flex-1">
//                 <label className="text-gray-600 mb-2 block">Name</label>
//                 <OutlinedInput
//                   label="Full Name"
//                   value={formData.name}
//                   onChange={(value: string) => handleInputChange('name', value)}
//                 />
//               </div>
//               <div className="flex-1">
//                 <label className="text-gray-600 mb-2 block">Email <span className="text-red-500">*</span></label>
//                 <OutlinedInput
//                   label="Email"
//                   value={formData.email}
//                   onChange={(value: string) => handleInputChange('email', value)}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Module List Section */}
//         <div>
//           <h6 className="text-gray-800 font-medium mb-2">Module List</h6>
//           <div className="border rounded p-2">
//             <Checkbox.Group
//               value={selectedModules}
//               onChange={handleModuleChange}
//               className="flex flex-row flex-wrap gap-3"
//             >
//               {sortedModules
//                 .filter(module => module.name === 'Remittance Tracker')
//                 .map(module => (
//                   <div key={module.id} className="flex-1 min-w-[180px]">
//                     <Checkbox value={module.name} className="inline-flex items-center">
//                       <span className="ml-2 whitespace-nowrap">{module.name}</span>
//                     </Checkbox>
//                   </div>
//                 ))}
//             </Checkbox.Group>
//             {errors.moduleAccess && (
//               <p className="text-red-500 text-xs mt-1">{errors.moduleAccess}</p>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end gap-2 mt-3">
//         <Button
//           variant="plain"
//           onClick={handleDialogClose}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="solid"
//           onClick={handleConfirm}
//           loading={isLoading}
//         >
//           Save Changes
//         </Button>
//       </div>
//     </Dialog>
//   );
// };

// export default EditCompanyAdmin;












// import React, { useState, useEffect } from 'react';
// import { Button, Dialog, Notification, toast } from '@/components/ui';
// import Checkbox from '@/components/ui/Checkbox';
// import OutlinedInput from '@/components/ui/OutlinedInput';
// import * as yup from 'yup';
// import AuditTrackerDialog from './AuditTrackerDialog';

// const validationSchema = yup.object().shape({
//   entityName: yup
//     .string()
//     .required('Entity name is required')
//     .min(3, 'Entity name must be at least 3 characters')
//     .matches(/^\S.*\S$|^\S$/, 'The input must not have leading or trailing spaces'),
//   email: yup
//     .string()
//     .email('Invalid email address')
//     .required('Email is required'),
//   moduleAccess: yup
//     .array()
//     .of(yup.number())
//     .min(1, 'At least one module must be selected'),
// });

// interface ValidationErrors {
//   [key: string]: string;
// }

// interface Module {
//   id: number;
//   name: string;
// }

// interface EditCompanyAdminProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: (data: any) => Promise<void>;
//   adminData: {
//     id: number;
//     name: string;
//     email: string;
//     entityName: string;
//     moduleAccessNames: string[];
//     compliance_checklist?: boolean;
//     both_checklist?: boolean;
//     custom_checklist?: boolean;
//   };
//   modules: Module[];
//   isLoading: boolean;
// }

// const EditCompanyAdmin: React.FC<EditCompanyAdminProps> = ({
//   isOpen,
//   onClose,
//   onConfirm,
//   adminData,
//   modules,
//   isLoading,
// }) => {
//   const [errors, setErrors] = useState<ValidationErrors>({});
//   const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
//   const [selectedModules, setSelectedModules] = useState<number[]>([]);
//    const [showAuditTrackerDialog, setShowAuditTrackerDialog] = useState(false);
//   const [tempSelectedModules, setTempSelectedModules] = useState<number[]>([]);
//   const [formData, setFormData] = useState({
//     id: 0,
//     name: '',
//     email: '',
//     moduleAccess: [] as number[],
//     entityName: '',
//     compliance_checklist: false,
//     both_checklist: false,
//     custom_checklist: false
//   });

//   useEffect(() => {
//     if (adminData && modules.length > 0) {
//       const initialModuleIds = modules
//         .filter(module => adminData.moduleAccessNames.includes(module.name))
//         .map(module => module.id);
      
//       setFormData({
//         id: adminData.id,
//         name: adminData.name || '',
//         email: adminData.email || '',
//         moduleAccess: initialModuleIds,
//         entityName: adminData.entityName || '',
//         compliance_checklist: adminData.compliance_checklist || false,
//         both_checklist: adminData.both_checklist || false,
//         custom_checklist: adminData.custom_checklist || false
//       });
//       setSelectedModules(initialModuleIds);
//     }
//   }, [adminData, modules]);

//   const validateField = async (field: string, value: any) => {
//     try {
//       await validationSchema.validateAt(field, { ...formData, [field]: value });
//       setErrors(prev => ({
//         ...prev,
//         [field]: ''
//       }));
//     } catch (error) {
//       if (error instanceof yup.ValidationError) {
//         setErrors(prev => ({
//           ...prev,
//           [field]: error.message
//         }));
//       }
//     }
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//     setTouchedFields(prev => ({
//       ...prev,
//       [field]: true
//     }));

//     if (touchedFields[field]) {
//       validateField(field, value);
//     }
//   };

//   // const handleModuleChange = (moduleId: number, isChecked: boolean) => {
//   //   setSelectedModules(prev => {
//   //     const newSelected = isChecked
//   //       ? [...prev, moduleId]
//   //       : prev.filter(id => id !== moduleId);
      
//   //     setFormData(prev => ({
//   //       ...prev,
//   //       moduleAccess: newSelected
//   //     }));
      
//   //     return newSelected;
//   //   });

//   //   setTouchedFields(prev => ({
//   //     ...prev,
//   //     moduleAccess: true
//   //   }));

//   //   if (touchedFields.moduleAccess) {
//   //     validateField('moduleAccess', formData.moduleAccess);
//   //   }
//   // };


// const handleModuleChange = (moduleId: number, isChecked: boolean) => {
//   const auditTrackerModule = modules.find(m => m.name === 'Audit Tracker');
//   const isAuditTracker = moduleId === auditTrackerModule?.id;
//   const wasPreviouslySelected = selectedModules.includes(moduleId);

//   if (isAuditTracker && isChecked && !wasPreviouslySelected) {
//     // For Audit Tracker selection, show dialog first
//     setTempSelectedModules([...selectedModules, moduleId]);
//     setShowAuditTrackerDialog(true);
//   } else {
//     // For other modules or deselection, update immediately
//     const newSelected = isChecked
//       ? [...selectedModules, moduleId]
//       : selectedModules.filter(id => id !== moduleId);
    
//     updateSelections(newSelected);
//   }
// };

// const updateSelections = (newSelected: number[]) => {
//   setSelectedModules(newSelected);
//   setFormData(prev => ({
//     ...prev,
//     moduleAccess: newSelected,
//     // Reset checklist flags if Audit Tracker was deselected
//     ...(!newSelected.includes(modules.find(m => m.name === 'Audit Tracker')?.id || -1) && {
//       compliance_checklist: false,
//       both_checklist: false,
//       custom_checklist: false
//     })
//   }));
// };

//   const handleAuditTrackerConfirm = (selection: 'custom' | 'compliance' | 'both') => {
//   // Use the tempSelectedModules that we stored when checkbox was clicked
//   updateSelections(tempSelectedModules);
  
//   // Update the checklist flags based on selection
//   setFormData(prev => ({
//     ...prev,
//     compliance_checklist: selection === 'compliance',
//     both_checklist: selection === 'both',
//     custom_checklist: selection === 'custom' || selection === 'both'
//   }));

//   setShowAuditTrackerDialog(false);
// };


//   const handleDialogClose = () => {
//     onClose();
//     setErrors({});
//     setTouchedFields({});
//   };

//   const validateForm = async () => {
//     try {
//       const validationObject = {
//         entityName: formData.entityName,
//         email: formData.email,
//         moduleAccess: formData.moduleAccess,
//       };

//       await validationSchema.validate(validationObject, { abortEarly: false });
//       setErrors({});
//       return true;
//     } catch (yupError) {
//       if (yupError instanceof yup.ValidationError) {
//         const newErrors: ValidationErrors = {};
//         yupError.inner.forEach((error) => {
//           if (error.path) {
//             newErrors[error.path] = error.message;
//           }
//         });
//         setErrors(newErrors);
//       }
//       return false;
//     }
//   };

//   const handleConfirm = async () => {
//     try {
//       const isFormValid = await validateForm();
//       if (!isFormValid) {
//         toast.push(
//           <Notification title="Danger" type="error">
//             Please fix the validation errors
//           </Notification>
//         );
//         return;
//       }

//       await onConfirm(formData);
//       handleDialogClose();
//     } catch (error) {
//       console.error('Error updating admin:', error);
//     }
//   };

//   const displayedModules = modules.filter(module => 
//     ['Remittance Tracker', 'Notice', 'Agreement', 'Audit Tracker', 'POSH', 'Return'].includes(module.name)
//   );

//   return (
//     <>
//     <Dialog
//       isOpen={isOpen}
//       onClose={handleDialogClose}
//       onRequestClose={handleDialogClose}
//       width={600}
//     >
//       <h5 className="mb-3">Edit Company Admin</h5>
//       <div className="flex flex-col gap-3">
//         {/* Company Group Section */}
//         <div className="border-b pb-2">
//           <h6 className="text-gray-800 font-medium mb-2">Company Group</h6>
//           <div className="w-full">
//             <label className="text-gray-600 mb-2 block">Entity Name <span className="text-red-500">*</span></label>
//             <OutlinedInput
//               label="Entity Name"
//               value={formData.entityName}
//               onChange={(value: string) => handleInputChange('entityName', value)}
//             />
//             {errors.entityName && (
//               <p className="text-red-500 text-xs mt-1">{errors.entityName}</p>
//             )}
//           </div>
//         </div>

//         {/* User Details Section */}
//         <div className="border-b pb-2">
//           <h6 className="text-gray-800 font-medium mb-2">User Details</h6>
//           <div className="space-y-4">
//             <div className="flex gap-4">
//               <div className="flex-1">
//                 <label className="text-gray-600 mb-2 block">Name</label>
//                 <OutlinedInput
//                   label="Full Name"
//                   value={formData.name}
//                   onChange={(value: string) => handleInputChange('name', value)}
//                 />
//               </div>
//               <div className="flex-1">
//                 <label className="text-gray-600 mb-2 block">Email <span className="text-red-500">*</span></label>
//                 <OutlinedInput
//                   label="Email"
//                   value={formData.email}
//                   onChange={(value: string) => handleInputChange('email', value)}
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-xs mt-1">{errors.email}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Module List Section */}
//         <div>
//           <h6 className="text-gray-800 font-medium mb-2">Module List</h6>
//           <div className="border rounded p-2">
//             <div className="flex flex-row flex-wrap gap-3">
//               {displayedModules.map(module => (
//                 <div key={module.id} className="flex-1 min-w-[180px]">
//                   <Checkbox
//                     checked={selectedModules.includes(module.id)}
//                     onChange={(checked) => handleModuleChange(module.id, checked)}
//                     className="inline-flex items-center"
//                   >
//                     <span className="ml-2 whitespace-nowrap">{module.name}</span>
//                   </Checkbox>
//                 </div>
//               ))}
//             </div>
//             {errors.moduleAccess && (
//               <p className="text-red-500 text-xs mt-1">{errors.moduleAccess}</p>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end gap-2 mt-3">
//         <Button variant="plain" onClick={handleDialogClose}>
//           Cancel
//         </Button>
//         <Button
//           variant="solid"
//           onClick={handleConfirm}
//           loading={isLoading}
//         >
//           Save Changes
//         </Button>
//       </div>
//     </Dialog>
//     <AuditTrackerDialog
//         isOpen={showAuditTrackerDialog}
//         onClose={() => {
//           setShowAuditTrackerDialog(false);
//           // Revert to previous selection if dialog is closed without confirmation
//           // setSelectedModules(selectedModules);
//         }}
//         onConfirm={handleAuditTrackerConfirm}
//       />
//     </>
//   );
// };

// export default EditCompanyAdmin;




import React, { useState, useEffect } from 'react';
import { Button, Dialog, Notification, toast } from '@/components/ui';
import Checkbox from '@/components/ui/Checkbox';
import OutlinedInput from '@/components/ui/OutlinedInput';
import * as yup from 'yup';
import AuditTrackerDialog from './AuditTrackerDialog';

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
    compliance_checklist?: boolean;
    both_checklist?: boolean;
    custom_checklist?: boolean;
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
const [selectedModules, setSelectedModules] = useState<(string | number)[]>([]);  const [showAuditTrackerDialog, setShowAuditTrackerDialog] = useState(false);
const [tempSelectedModules, setTempSelectedModules] = useState<(string | number)[]>([]);  const [lastProcessedModules, setLastProcessedModules] = useState<(string | number)[]>([]); 
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    email: '',
    moduleAccess: [] as number[],
    entityName: '',
    compliance_checklist: false,
    both_checklist: false,
    custom_checklist: false
  });
  

  useEffect(() => {
  if (adminData && modules.length > 0) {
    const initialModuleIds = modules
      .filter(module => adminData.moduleAccessNames.includes(module.name))
      .map(module => module.id);
    
    setFormData({
      id: adminData.id,
      name: adminData.name || '',
      email: adminData.email || '',
      moduleAccess: initialModuleIds,
      entityName: adminData.entityName || '',
      compliance_checklist: adminData.compliance_checklist || false,
      both_checklist: adminData.both_checklist || false,
      custom_checklist: adminData.custom_checklist || false
    });
    setSelectedModules(initialModuleIds); // This will work with Checkbox.Group
    setLastProcessedModules(initialModuleIds);
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

  // REPLACE handleModuleChange with this EXACT function from CompanyAdmin.tsx:
const handleModuleChange = (options: (string | number)[]) => {
  const auditTrackerModule = modules.find(m => m.name === 'Audit Tracker');
  const auditTrackerId = auditTrackerModule?.id || -1;
  
  // Check if this is the initial selection (no previous state)
  const isInitialSelection = selectedModules.length === 0 && options.length === 1;
  
  // Check if Audit Tracker is being specifically selected now
  const isSpecificallySelectingAuditTracker = 
      options.includes(auditTrackerId) && 
      !lastProcessedModules.includes(auditTrackerId) &&
      !isInitialSelection;

  if (isSpecificallySelectingAuditTracker) {
      setTempSelectedModules(options);
      setShowAuditTrackerDialog(true);
  } else {
      const moduleAccess = options.map(option => Number(option));
      setSelectedModules(options);
      setLastProcessedModules(options);
      setFormData(prev => ({
          ...prev,
          moduleAccess,
          ...(!options.includes(auditTrackerId) && {
              compliance_checklist: false,
              both_checklist: false,
              custom_checklist: false
          })
      }));
  }
};

// REPLACE handleAuditTrackerConfirm with this EXACT function:
const handleAuditTrackerConfirm = (selection: 'custom' | 'compliance' | 'both') => {
  const moduleAccess = tempSelectedModules.map(option => Number(option));
  setSelectedModules(tempSelectedModules);
  setLastProcessedModules(tempSelectedModules);
  
  setFormData(prev => ({
    ...prev,
    moduleAccess,
    compliance_checklist: selection === 'compliance',
    both_checklist: selection === 'both',
    custom_checklist: selection === 'custom' || selection === 'both'
  }));
  
  setShowAuditTrackerDialog(false);
  setTempSelectedModules([]);
};

// Make sure your updateSelections function looks like this:
const updateSelections = (newSelected: number[]) => {
  console.log('updateSelections called:', newSelected);
  
  setSelectedModules(newSelected);
  setLastProcessedModules(newSelected);
  
  const auditTrackerId = modules.find(m => m.name === 'Audit Tracker')?.id || -1;
  
  setFormData(prev => ({
    ...prev,
    moduleAccess: newSelected,
    // Reset checklist flags if Audit Tracker was deselected
    ...(!newSelected.includes(auditTrackerId) && {
      compliance_checklist: false,
      both_checklist: false,
      custom_checklist: false
    })
  }));
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
          <Notification title="Danger" type="error">
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

  const displayedModules = modules.filter(module => 
    ['Remittance Tracker', 'Notice', 'Agreement', 'Audit Tracker', 'POSH', 'Return'].includes(module.name)
  );

  return (
    <>
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
          {/* <div>
            <h6 className="text-gray-800 font-medium mb-2">Module List</h6>
            <div className="border rounded p-2">
              <div className="flex flex-row flex-wrap gap-3">
                {displayedModules.map(module => (
                  <div key={module.id} className="flex-1 min-w-[180px]">
                    <Checkbox
                      checked={selectedModules.includes(module.id)}
                      onChange={(checked) => handleModuleChange(module.id, checked)}
                      className="inline-flex items-center"
                    >
                      <span className="ml-2 whitespace-nowrap">{module.name}</span>
                    </Checkbox>
                  </div>
                ))}
              </div>
              {errors.moduleAccess && (
                <p className="text-red-500 text-xs mt-1">{errors.moduleAccess}</p>
              )}
            </div>
          </div> */}
         <div>
  <h6 className="text-gray-800 font-medium mb-2">Module List</h6>
  <div className="border rounded p-2">
    <Checkbox.Group
      value={selectedModules}
      onChange={handleModuleChange}
      className="flex flex-row flex-wrap gap-3"
    >
      {modules
        .filter((module) =>
          ['Remittance Tracker', 'Notice', 'Agreement', 'Audit Tracker', 'POSH', 'Return'].includes(module.name)
        )
        .map((module) => (
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
          <Button variant="plain" onClick={handleDialogClose}>
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
      <AuditTrackerDialog
  isOpen={showAuditTrackerDialog}
  onClose={() => {
    console.log('Dialog closed, reverting to lastProcessedModules:', lastProcessedModules);
    setShowAuditTrackerDialog(false);
    setSelectedModules(lastProcessedModules);
    setTempSelectedModules([]);
  }}
  onConfirm={handleAuditTrackerConfirm}
/>
    </>
  );
};

export default EditCompanyAdmin;