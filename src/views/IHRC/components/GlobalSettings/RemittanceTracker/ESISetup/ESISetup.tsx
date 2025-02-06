// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Button, Dialog, Notification, toast } from '@/components/ui';
// import { HiPlusCircle } from 'react-icons/hi';
// import AdaptableCard from '@/components/shared/AdaptableCard';
// import OutlinedInput from '@/components/ui/OutlinedInput';
// import OutlinedSelect from '@/components/ui/Outlined/Outlined';
// import DatePicker from '@/components/ui/DatePicker';
// import Checkbox from '@/components/ui/Checkbox';
// import BulkUpload from './components/BulkUpload';
// import ESITable from './components/ESITable';
// import { fetchESIConfigs, createESIConfig, updateESIConfig, clearCurrentESIConfig  } from '@/store/slices/esiConfig/esiConfigSlice';
// import { AppDispatch, RootState } from '@/store';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
// import { showErrorNotification } from '@/components/ui/ErrorMessage';
// import * as yup from 'yup';


// const validationSchema = yup.object().shape({
//   selectedState: yup
//     .object()
//     .nullable()
//     .required('State is required'),
//   frequency: yup
//     .string()
//     .oneOf(['monthly', 'yearly', 'half_yearly', 'quarterly'], 'Invalid frequency')
//     .required('Frequency is required'),
//   paymentDueDates: yup.object().shape({
//     firstDate: yup
//       .date()
//       .required('First due date is required')
//       .nullable(),
//     secondDate: yup
//       .date()
//       .nullable()
//       .when('frequency', {
//         is: 'quarterly',
//         then: yup.date().required('Second due date is required'),
//       }),
//     thirdDate: yup
//       .date()
//       .nullable()
//       .when('frequency', {
//         is: 'quarterly',
//         then: yup.date().required('Third due date is required'),
//       }),
//     lastDate: yup
//       .date()
//       .nullable()
//       .when('frequency', {
//         is: (frequency) => frequency === 'half_yearly' || frequency === 'quarterly',
//         then: yup.date().required('Last due date is required'),
//       }),
//   })
// });

// interface ValidationErrors {
//   [key: string]: string;
// }


// const frequencyOptions = [
//   { value: 'monthly', label: 'Monthly' },
//   { value: 'yearly', label: 'Yearly' },
//   { value: 'half_yearly', label: 'Half Yearly' },
//   { value: 'quarterly', label: 'Quarterly' },
// ];

// interface SelectOption {
//   value: string;
//   label: string;
// }

// const ESISetup = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { esiConfigs, loading, error, currentESIConfig } = useSelector((state: RootState) => state.esiconfig);
//   const [errors, setErrors] = useState<ValidationErrors>({});
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [states, setStates] = useState<SelectOption[]>([]);
//   const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
//   const [frequency, setFrequency] = useState<string>('');
//   const [isActive, setIsActive] = useState(false);
//     const [refreshCounter, setRefreshCounter] = useState(0);

//   const [paymentDueDates, setPaymentDueDates] = useState({
//     firstDate: null,
//     secondDate: null,
//     thirdDate: null,
//     lastDate: null
//   });

//   const [dateFieldsState, setDateFieldsState] = useState({
//     isSecondDateEnabled: false,
//     isThirdDateEnabled: false,
//     isLastDateEnabled: false
//   });

//   useEffect(() => {
//     loadStates();
//     dispatch(fetchESIConfigs({ page: 1, page_size: 10 }));
//   }, [dispatch]);

//   const loadStates = async () => {
//     try {
//       const response = await httpClient.get(endpoints.common.getStatesAll());
      
//       if (response.data) {
//         const formattedStates = response.data.map((state: any) => ({
//           label: state.name,
//           value: String(state.id)
//         }));
        
//         setStates(formattedStates);
//       }
//     } catch (error) {
//       console.error('Failed to load states:', error);
//       toast.push(
//         <Notification title="Error" type="danger">
//           Failed to load states
//         </Notification>
//       );
//     }
//   };

//   const handleFrequencyChange = (selectedFrequency: any) => {
//     const frequencyValue = selectedFrequency?.value || '';
//     setFrequency(frequencyValue);
    
//     // Reset date fields based on frequency
//     switch (frequencyValue) {
//       case 'monthly':
//       case 'yearly':
//         setPaymentDueDates({
//           firstDate: null,
//           secondDate: null,
//           thirdDate: null,
//           lastDate: null
//         });
//         setDateFieldsState({
//           isSecondDateEnabled: false,
//           isThirdDateEnabled: false,
//           isLastDateEnabled: false
//         });
//         break;
//       case 'half_yearly':
//         setPaymentDueDates(prev => ({
//           ...prev,
//           secondDate: null,
//           thirdDate: null
//         }));
//         setDateFieldsState({
//           isSecondDateEnabled: false,
//           isThirdDateEnabled: false,
//           isLastDateEnabled: true
//         });
//         break;
//       case 'quarterly':
//         setDateFieldsState({
//           isSecondDateEnabled: true,
//           isThirdDateEnabled: true,
//           isLastDateEnabled: true
//         });
//         break;
//     }
//   };

//   const isDueDateDisabled = (dateIndex: number) => {
//     switch (frequency) {
//       case 'monthly':
//       case 'yearly':
//         return dateIndex > 0;
//       case 'half_yearly':
//         return dateIndex > 0 && dateIndex < 3;
//       case 'quarterly':
//         return false;
//       default:
//         return true;
//     }
//   };

//   const handleDialogClose = () => {
//     setIsDialogOpen(false);
//     setIsEditMode(false);
//     resetForm();
//   };

//   const resetForm = () => {
//     setSelectedState(null);
//     setFrequency('');
//     setIsActive(false);
//     setPaymentDueDates({
//       firstDate: null,
//       secondDate: null,
//       thirdDate: null,
//       lastDate: null
//     });
//     dispatch(clearCurrentESIConfig());
//   };


//   const validateForm = async () => {
//     try {
//       await validationSchema.validate(formData, { abortEarly: false });
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
//     // Validate form
//     // if (!selectedState || !frequency || !paymentDueDates.firstDate) {
//     //   toast.push(
//     //     <Notification title="Error" type="danger">
//     //       Please fill all required fields
//     //     </Notification>
//     //   );
//     //   return;
//     // }

//     const esiConfigData = {
//       frequency: frequency as 'monthly' | 'half_yearly' | 'yearly' | 'quarterly',
//       payment_due_date: {
//         first_date: paymentDueDates.firstDate,
//         second_date: paymentDueDates.secondDate,
//         third_date: paymentDueDates.thirdDate,
//         last_date: paymentDueDates.lastDate
//       },
//       payment_mode: 'online', // Default value, can be made configurable
//       active: isActive,
//       state_id: selectedState.value
//     };

//     try {
//       const isValid = await validateForm();
//       if(!isValid){
//         toast.push(
//           <Notification title="Danger" type="danger">
//               Please fix the validation errors
//           </Notification>)
//         return;
//       }
//       if (isEditMode && currentESIConfig?.id) {
//         const result = await dispatch(updateESIConfig({ 
//           id: currentESIConfig.id, 
//           data: esiConfigData 
//         }))
//         .unwrap()
//         .catch((error: any) => {
//           console.error('Full error object:', error);
//           console.error('Error response:', error.response);
//           console.error('Error message:', error.message);
          
//           if (error.response?.data?.message) {
//             showErrorNotification(error.response.data.message)
//           } else if (error.message) {
//             showErrorNotification(error.message)
//           } else {
//             // showErrorNotification('An unexpected error occurred. Please try again.')
//             showErrorNotification(error);

//           }
//           throw error;
//         });

//         if(result) {
//           handleDialogClose();
//           dispatch(fetchESIConfigs({ page: 1, page_size: 10 }));
//            setRefreshCounter(prev => prev + 1); 
//         }
        
//       } else {
//         const result = await dispatch(createESIConfig(esiConfigData))
//         .unwrap()
//         .catch((error: any) => {
//           console.error('Full error object:', error);
//           console.error('Error response:', error.response);
//           console.error('Error message:', error.message);
          
//           if (error.response?.data?.message) {
//             showErrorNotification(error.response.data.message)
//           } else if (error.message) {
//             showErrorNotification(error.message)
//           } else {
//             // showErrorNotification('An unexpected error occurred. Please try again.')
//             showErrorNotification(error);

//           }
//           throw error;
//         });
        
//         // toast.push(
//         //   <Notification title="Success" type="success">
//         //     ESI Configuration created successfully
//         //   </Notification>
//         // );
//         if(result) {
//           handleDialogClose();
//           dispatch(fetchESIConfigs({ page: 1, page_size: 10 }));
//            setRefreshCounter(prev => prev + 1); 
//         }
//       }
      
//     } catch (error: any) {
//      console.log(error);
//     //  showErrorNotification(error);

     
//     }
//   };

//   const handleEdit = (config) => {
//     setIsEditMode(true);
//     setIsDialogOpen(true);
    
//     // Set state from the selected configuration
//     const selectedStateObj = states.find(state => state.value === config.state_id);
//     setSelectedState(selectedStateObj || null);
//     setFrequency(config.frequency);
//     setIsActive(config.active);
    
//     setPaymentDueDates({
//       firstDate: config.payment_due_date.first_date,
//       secondDate: config.payment_due_date.second_date,
//       thirdDate: config.payment_due_date.third_date,
//       lastDate: config.payment_due_date.last_date
//     });
    
//     // Update date fields state based on frequency
//     switch (config.frequency) {
//       case 'monthly':
//       case 'yearly':
//         setDateFieldsState({
//           isSecondDateEnabled: false,
//           isThirdDateEnabled: false,
//           isLastDateEnabled: false
//         });
//         break;
//       case 'half_yearly':
//         setDateFieldsState({
//           isSecondDateEnabled: false,
//           isThirdDateEnabled: false,
//           isLastDateEnabled: true
//         });
//         break;
//       case 'quarterly':
//         setDateFieldsState({
//           isSecondDateEnabled: true,
//           isThirdDateEnabled: true,
//           isLastDateEnabled: true
//         });
//         break;
//     }
//   };

//   return (
//     <AdaptableCard className="h-full" bodyClass="h-full">
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
//         <div className="mb-4 lg:mb-0">
//           <h3 className="text-2xl font-bold">ESI Global Setup</h3>
//         </div>
//         <div className="flex gap-2">
//           {/* <BulkUpload /> */}
//           {/* <Button
//             variant="solid"
//             size="sm"
//             icon={<HiPlusCircle />}
//             onClick={() => setIsDialogOpen(true)}
//           >
//             Edit ESI Setup
//           </Button> */}
//         </div>
//       </div>
      
//       <ESITable 
//         onEdit={handleEdit}
//         refreshTrigger={refreshCounter}
//       />

//       <Dialog
//         isOpen={isDialogOpen}
//         onClose={handleDialogClose}
//         onRequestClose={handleDialogClose}
//       >
//         <h5 className="mb-6">{'Edit ESI Setup'}</h5>
//         <div className="flex flex-col gap-6">
//           <div className="flex gap-4">
//             <div className="w-full">
//               <label className="text-gray-600 mb-2 block">State</label>
//               <OutlinedSelect
//                 label="Select State"
//                 options={states}
//                 value={selectedState}
//                 onChange={setSelectedState}
//               />
              
//             </div>
//           </div>

//           <div className="flex gap-4">
//             <div className="w-full">
//               <label className="text-gray-600 mb-2 block">ESI Frequency</label>
//               <OutlinedSelect
//                 label="Select ESI Frequency"
//                 options={frequencyOptions}
//                 value={frequencyOptions.find(option => option.value === frequency) || null}
//                 onChange={handleFrequencyChange}
//               />
//               <div className="min-h-[20px]">
//           {errors.frequency && (
//             <p className="text-red-500 text-xs mt-1">{errors.frequency}</p>
//           )}
//         </div>
//             </div>
//           </div>

//           <div className="flex gap-4">
//             <div className="w-1/2">
//               <label className="text-gray-600 mb-2 block">First Due Date <span className="text-red-500">*</span></label>
//               <DatePicker
//                 className="w-full"
//                 placeholder="Select first due date"
//                 value={paymentDueDates.firstDate}
//                 onChange={(date) => setPaymentDueDates(prev => ({ ...prev, firstDate: date }))}
//               />
//               <div className="min-h-[20px]">
//           {errors.firstDate && (
//             <p className="text-red-500 text-xs mt-1">{errors.firstDate}</p>
//           )}
//         </div>
//             </div>
//             <div className="w-1/2">
//               <label className="text-gray-600 mb-2 block">Second Due Date</label>
//               <DatePicker
//                 className="w-full"
//                 placeholder="Select second due date"
//                 value={paymentDueDates.secondDate}
//                 onChange={(date) => setPaymentDueDates(prev => ({ ...prev, secondDate: date }))}
//                 disabled={isDueDateDisabled(1)}
//               />
//               <div className="min-h-[20px]">
//           {errors.secondDate && (
//             <p className="text-red-500 text-xs mt-1">{errors.secondDate}</p>
//           )}
//         </div>
//             </div>
//           </div>

//           <div className="flex gap-4">
//             <div className="w-1/2">
//               <label className="text-gray-600 mb-2 block">Third Due Date</label>
//               <DatePicker
//                 className="w-full"
//                 placeholder="Select third due date"
//                 value={paymentDueDates.thirdDate}
//                 onChange={(date) => setPaymentDueDates(prev => ({ ...prev, thirdDate: date }))}
//                 disabled={isDueDateDisabled(2)}
//               />
//             </div>
//             <div className="w-1/2">
//               <label className="text-gray-600 mb-2 block">Last Due Date</label>
//               <DatePicker
//                 className="w-full"
//                 placeholder="Select last due date"
//                 value={paymentDueDates.lastDate}
//                 onChange={(date) => setPaymentDueDates(prev => ({ ...prev, lastDate: date }))}
//                 disabled={isDueDateDisabled(3)}
//               />
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             <Checkbox
//               checked={isActive}
//               onChange={(checked) => setIsActive(checked)}
//             />
//             <label className="text-gray-600">
//               Is ESI applicable for Selected State
//             </label>
//           </div>
//         </div>

//         <div className="flex justify-end gap-2 mt-6">
//           <Button
//             variant="plain"
//             onClick={handleDialogClose}
//           >
//             Cancel
//           </Button>
//           <Button 
//             variant="solid" 
//             onClick={handleConfirm}
//             loading={loading}
//           >
//             {isEditMode ? 'Update' : 'Confirm'}
//           </Button>
//         </div>
//       </Dialog>
//     </AdaptableCard>
//   );
// };

// export default ESISetup;

// import React, { useState } from 'react'
// import { AdaptableCard } from '@/components/shared'
// import { Button } from '@/components/ui'
// import { DatePicker } from '@/components/ui/DatePicker'

// const ESIConfiguration = () => {
//     const [esiConfig, setEsiConfig] = useState({
//         payment_mode: 'online',
//         esi_frequency: 'monthly',
//         payment_due_date: '',
//     })

//     const handleInputChange = (name: string, value: any) => {
//         if (name === 'dueDate') {
//             setEsiConfig((prev) => ({
//                 ...prev,
//                 payment_due_date: value.toISOString().split('T')[0],
//             }))
//         }
//     }

//     const handleSubmit = () => {
//         console.log('ESI Configuration:', esiConfig)
//     }

//     return (
//         <AdaptableCard className="h-full" bodyClass="h-full">
//             <div className="mb-6">
//                 <h3>ESI Configuration</h3>
//             </div>
            
//             <div className="max-w-xl">
//                 <div className="flex flex-col gap-6">
//                     <div className="flex flex-col gap-2">
//                         <label className="font-medium">Payment Mode</label>
//                         <div className="text-gray-500 p-2 bg-gray-50 rounded border">Online</div>
//                     </div>
                    
//                     <div className="flex flex-col gap-2">
//                         <label className="font-medium">ESI Frequency</label>
//                         <div className="text-gray-500 p-2 bg-gray-50 rounded border">Monthly</div>
//                     </div>
                    
//                     <div className="flex flex-col gap-2">
//                         <label className="font-medium">Due Date</label>
//                         <DatePicker
//                             value={
//                                 esiConfig.payment_due_date
//                                     ? new Date(esiConfig.payment_due_date)
//                                     : null
//                             }
//                             onChange={(date) =>
//                                 handleInputChange('dueDate', date)
//                             }
//                             placeholder="Select due date"
//                         />
//                     </div>

//                     <div className="mt-4">
//                         <Button variant="solid" onClick={handleSubmit}>
//                             Save Changes
//                         </Button>
//                     </div>
//                 </div>
//             </div>
//         </AdaptableCard>
//     )
// }

// export default ESIConfiguration

// import React, { useEffect, useState } from 'react';
// import { Button } from '@/components/ui';
// import { FormItem, FormContainer } from '@/components/ui/Form';
// import { HiOutlineViewGrid } from 'react-icons/hi';
// import SimpleDatePicker from '@/components/ui/OutlinedInput/SimpleDatePicker';
// import OutlinedSelect from '@/components/ui/Outlined/Outlined';
// import { showErrorNotification } from '@/components/ui/ErrorMessage';
// import * as yup from 'yup';

// // Validation schema
// const createESIValidationSchema = () => {
//     return yup.object().shape({
//         payment_due_date: yup
//             .date()
//             .required('Due date is required')
//             .typeError('Due date must be a valid date'),
//     });
// };

// type ESIFrequency = 'monthly';

// interface SelectOption {
//     value: string;
//     label: string;
// }

// const frequencyOptions = [
//     { value: 'monthly', label: 'Monthly' },
// ];

// const ESIConfiguration = () => {
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [selectedFrequency, setSelectedFrequency] = useState<SelectOption>({ value: 'monthly', label: 'Monthly' });
//     const [paymentDueDate, setPaymentDueDate] = useState<string | null>(null);
//     const [validationErrors, setValidationErrors] = useState({
//         payment_due_date: undefined,
//     });

//     const validateDates = async () => {
//         try {
//             const validationSchema = createESIValidationSchema();
//             await validationSchema.validate({ payment_due_date: paymentDueDate }, { abortEarly: false });
//             setValidationErrors({});
//             return true;
//         } catch (error) {
//             if (error instanceof yup.ValidationError) {
//                 const newErrors = {};
//                 error.inner.forEach((err) => {
//                     newErrors[err.path] = err.message;
//                 });
//                 setValidationErrors(newErrors);
//                 return false;
//             }
//             return false;
//         }
//     };

//     useEffect(() => {
//         validateDates();
//     }, [paymentDueDate]);

//     const handleEdit = () => {
//         setIsEditMode(true);
//     };

//     const handleCancel = () => {
//         setIsEditMode(false);
//         // Reset to original values
//         setSelectedFrequency({ value: 'monthly', label: 'Monthly' });
//         setPaymentDueDate(null);
//     };

//     const handleSubmit = async () => {
//         const isValid = await validateDates();

//         if (!isValid) {
//             return;
//         }

//         const esiConfigData = {
//             payment_mode: 'online',
//             esi_frequency: selectedFrequency.value as ESIFrequency,
//             payment_due_date: paymentDueDate,
//         };

//         try {
//             console.log('ESI Configuration:', esiConfigData);
//             setIsEditMode(false);
//         } catch (error: any) {
//             if (error.response?.data?.message) {
//                 showErrorNotification(error.response.data.message);
//             } else if (error.message) {
//                 showErrorNotification(error.message);
//             } else {
//                 showErrorNotification('An error occurred while saving the configuration');
//             }
//         }
//     };

//     return (
//       <div className="bg-white p-6 rounded-lg shadow-sm">
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
//           <div className="mb-4 lg:mb-0">
//               <h3 className="text-2xl font-bold">ESI Configuration</h3>
//           </div>
//       </div>

//             <FormContainer>
//                 <div className="mb-6">
//                     <h5>ESI Configuration</h5>
//                 </div>

//                 <div className="grid grid-cols-2 gap-6">
//                     <FormItem>
//                         <label className="text-gray-600 mb-2 block">ESI Payment Mode</label>
//                         <div className="text-gray-500 p-2 bg-gray-50 rounded border">Online</div>
//                     </FormItem>

//                     <FormItem>
//                         <label className="text-gray-600 mb-2 block">ESI Frequency<span className="text-red-500">*</span></label>
//                         <OutlinedSelect
//                             label="Select ESI Frequency"
//                             options={frequencyOptions}
//                             value={selectedFrequency}
//                             onChange={setSelectedFrequency}
//                             disabled={!isEditMode}
//                         />
//                     </FormItem>

//                     <FormItem
//                         invalid={!!validationErrors.payment_due_date}
//                         errorMessage={validationErrors.payment_due_date}
//                     >
//                         <label className="text-gray-600 mb-2 block">ESI Monthly Due Date<span className="text-red-500">*</span></label>
//                         <SimpleDatePicker
//                             className="w-full"
//                             placeholder="Select ESI due date"
//                             value={paymentDueDate ? new Date(paymentDueDate) : null}
//                             onChange={(date) => setPaymentDueDate(date ? date.toISOString() : null)}
//                             disabled={!isEditMode}
//                         />
//                     </FormItem>
//                 </div>

//                 <div className="flex justify-end gap-2 mt-8 pt-6 border-t">
//                     {!isEditMode ? (
//                         <Button variant="solid" onClick={handleEdit}>
//                             Edit
//                         </Button>
//                     ) : (
//                         <>
//                             <Button variant="plain" onClick={handleCancel}>
//                                 Cancel
//                             </Button>
//                             <Button variant="solid" onClick={handleSubmit}>
//                                 Save Changes
//                             </Button>
//                         </>
//                     )}
//                 </div>
//             </FormContainer>
//         </div>
//     );
// };

// export default ESIConfiguration;

// import React, { useEffect, useState } from 'react';
// import { Button } from '@/components/ui';
// import { FormItem, FormContainer } from '@/components/ui/Form';
// import { HiOutlineViewGrid } from 'react-icons/hi';
// import SimpleDatePicker from '@/components/ui/OutlinedInput/SimpleDatePicker';
// import OutlinedSelect from '@/components/ui/Outlined/Outlined';
// import { showErrorNotification } from '@/components/ui/ErrorMessage';
// import * as yup from 'yup';

// // Validation schema
// const createESIValidationSchema = () => {
//     return yup.object().shape({
//         payment_due_date: yup
//             .date()
//             .required('Due date is required')
//             .typeError('Due date must be a valid date'),
//     });
// };

// type ESIFrequency = 'monthly';

// interface SelectOption {
//     value: string;
//     label: string;
// }

// const frequencyOptions = [
//     { value: 'monthly', label: 'Monthly' },
// ];

// const ESIConfiguration = () => {
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [selectedFrequency, setSelectedFrequency] = useState<SelectOption>({ value: 'monthly', label: 'Monthly' });
    
//     // Initialize the date to the 15th of current month
//     const initialDate = new Date();
//     initialDate.setDate(15);
//     const [paymentDueDate, setPaymentDueDate] = useState<string | null>(initialDate.toISOString());
    
//     const [validationErrors, setValidationErrors] = useState({
//         payment_due_date: undefined,
//     });

//     const validateDates = async () => {
//         try {
//             const validationSchema = createESIValidationSchema();
//             await validationSchema.validate({ payment_due_date: paymentDueDate }, { abortEarly: false });
//             setValidationErrors({});
//             return true;
//         } catch (error) {
//             if (error instanceof yup.ValidationError) {
//                 const newErrors = {};
//                 error.inner.forEach((err) => {
//                     newErrors[err.path] = err.message;
//                 });
//                 setValidationErrors(newErrors);
//                 return false;
//             }
//             return false;
//         }
//     };

//     useEffect(() => {
//         validateDates();
//     }, [paymentDueDate]);

//     const handleEdit = () => {
//         setIsEditMode(true);
//     };

//     const handleCancel = () => {
//         setIsEditMode(false);
//         // Reset to the 15th of current month
//         const resetDate = new Date();
//         resetDate.setDate(15);
//         setPaymentDueDate(resetDate.toISOString());
//         setSelectedFrequency({ value: 'monthly', label: 'Monthly' });
//     };

//     const handleSubmit = async () => {
//         const isValid = await validateDates();

//         if (!isValid) {
//             return;
//         }

//         const esiConfigData = {
//             payment_mode: 'online',
//             esi_frequency: selectedFrequency.value as ESIFrequency,
//             payment_due_date: paymentDueDate,
//         };

//         try {
//             console.log('ESI Configuration:', esiConfigData);
//             setIsEditMode(false);
//         } catch (error: any) {
//             if (error.response?.data?.message) {
//                 showErrorNotification(error.response.data.message);
//             } else if (error.message) {
//                 showErrorNotification(error.message);
//             } else {
//                 showErrorNotification('An error occurred while saving the configuration');
//             }
//         }
//     };

//     return (
//         <div className="bg-white p-6 rounded-lg shadow-sm">
//             <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
//                 <div className="mb-4 lg:mb-0">
//                     <h3 className="text-2xl font-bold">ESI Configuration</h3>
//                 </div>
//             </div>

//             <FormContainer>
//                 <div className="mb-6">
//                     <h5>ESI Configuration</h5>
//                 </div>

//                 <div className="grid grid-cols-2 gap-6">
//                     <FormItem>
//                         <label className="text-gray-600 mb-2 block">ESI Payment Mode</label>
//                         <div className="text-gray-500 p-2 bg-gray-50 rounded border">Online</div>
//                     </FormItem>

//                     <FormItem>
//                         <label className="text-gray-600 mb-2 block">ESI Frequency</label>
//                         <OutlinedSelect
//                             label="Select ESI Frequency"
//                             options={frequencyOptions}
//                             value={selectedFrequency}
//                             onChange={setSelectedFrequency}
//                             disabled={!isEditMode}
//                         />
//                     </FormItem>

//                     <FormItem
//                         invalid={!!validationErrors.payment_due_date}
//                         errorMessage={validationErrors.payment_due_date}
//                     >
//                         <label className="text-gray-600 mb-2 block">ESI Monthly Due Date<span className="text-red-500">*</span></label>
//                         <SimpleDatePicker
//                             className="w-full"
//                             placeholder="Select ESI due date"
//                             value={paymentDueDate ? new Date(paymentDueDate) : null}
//                             onChange={(date) => setPaymentDueDate(date ? date.toISOString() : null)}
//                             disabled={!isEditMode}
//                         />
//                     </FormItem>
//                 </div>

//                 <div className="flex justify-end gap-2 mt-8 pt-6 border-t">
//                     {!isEditMode ? (
//                         <Button variant="solid" onClick={handleEdit}>
//                             Edit
//                         </Button>
//                     ) : (
//                         <>
//                             <Button variant="plain" onClick={handleCancel}>
//                                 Cancel
//                             </Button>
//                             <Button variant="solid" onClick={handleSubmit}>
//                                 Save Changes
//                             </Button>
//                         </>
//                     )}
//                 </div>
//             </FormContainer>
//         </div>
//     );
// };

// export default ESIConfiguration;

// import React, { useEffect, useState } from 'react';
// import { Button } from '@/components/ui';
// import { FormItem, FormContainer } from '@/components/ui/Form';
// import SimpleDatePicker from '@/components/ui/OutlinedInput/SimpleDatePicker';
// import OutlinedSelect from '@/components/ui/Outlined/Outlined';
// import { showErrorNotification } from '@/components/ui/ErrorMessage';
// import * as yup from 'yup';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';

// const createESIValidationSchema = () => {
//     return yup.object().shape({
//         payment_due_date: yup
//             .date()
//             .required('Due date is required')
//             .typeError('Due date must be a valid date'),
//     });
// };

// type ESIFrequency = 'monthly';

// interface SelectOption {
//     value: string;
//     label: string;
// }

// const frequencyOptions = [{ value: 'monthly', label: 'Monthly' }];

// const ESIConfiguration = () => {
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [selectedFrequency, setSelectedFrequency] = useState<SelectOption>({ value: 'monthly', label: 'Monthly' });
//     const [paymentMode, setPaymentMode] = useState('online');
//     const [paymentDueDate, setPaymentDueDate] = useState<string | null>(null);
//     const [validationErrors, setValidationErrors] = useState({});
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         fetchESIConfig();
//     }, []);

//     const fetchESIConfig = async () => {
//         try {
//             setIsLoading(true);
//             const response = await httpClient.get(endpoints.esiConfig.detail(1));
//             const configData = response.data;

//             if (configData) {
//                 setPaymentMode(configData.esi_payment_mode);
//                 setSelectedFrequency({
//                     value: configData.esi_frequency,
//                     label: configData.esi_frequency.charAt(0).toUpperCase() + configData.esi_frequency.slice(1),
//                 });
//                 setPaymentDueDate(configData.esi_payment_due_date?.first_date || null);
//             }
//         } catch (error) {
//             showErrorNotification('Failed to fetch ESI configuration');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const validateDates = async () => {
//         try {
//             const validationSchema = createESIValidationSchema();
//             await validationSchema.validate({ payment_due_date: paymentDueDate }, { abortEarly: false });
//             setValidationErrors({});
//             return true;
//         } catch (error) {
//             if (error instanceof yup.ValidationError) {
//                 const newErrors = {};
//                 error.inner.forEach((err) => {
//                     newErrors[err.path] = err.message;
//                 });
//                 setValidationErrors(newErrors);
//             }
//             return false;
//         }
//     };

//     const handleEdit = () => setIsEditMode(true);

//     const handleCancel = () => {
//         setIsEditMode(false);
//         fetchESIConfig();
//     };

//     const handleSubmit = async () => {
//         const isValid = await validateDates();

//         if (!isValid) return;

//         const esiConfigData = {
//             payment_mode: paymentMode,
//             esi_frequency: selectedFrequency.value,
//             payment_due_date: paymentDueDate,
//         };

//         try {
//             console.log('ESI Configuration to submit:', esiConfigData);
//             setIsEditMode(false);
//         } catch (error) {
//             showErrorNotification('An error occurred while saving the configuration');
//         }
//     };

//     if (isLoading) return <div>Loading...</div>;

//     return (
//         <div className="bg-white p-6 rounded-lg shadow-sm">
//             <div className="mb-6">
//                 <h3 className="text-2xl font-bold">ESI Configuration</h3>
//             </div>
//             <FormContainer>
//                 <div className="grid grid-cols-2 gap-6">
//                     <FormItem>
//                         <label className="text-gray-600 mb-2 block">ESI Payment Mode</label>
//                         <div className="text-gray-500 p-2 bg-gray-50 rounded border">{paymentMode}</div>
//                     </FormItem>

//                     <FormItem>
//                         <label className="text-gray-600 mb-2 block">ESI Frequency</label>
//                         <OutlinedSelect
//                             label="Select ESI Frequency"
//                             options={frequencyOptions}
//                             value={selectedFrequency}
//                             onChange={setSelectedFrequency}
//                             disabled={!isEditMode}
//                         />
//                     </FormItem>

//                     <FormItem
//                         invalid={!!validationErrors.payment_due_date}
//                         errorMessage={validationErrors.payment_due_date}
//                     >
//                         <label className="text-gray-600 mb-2 block">ESI Monthly Due Date</label>
//                         <SimpleDatePicker
//                             className="w-full"
//                             placeholder="Select ESI due date"
//                             value={paymentDueDate ? new Date(paymentDueDate) : null}
//                             onChange={(date) => setPaymentDueDate(date ? date.toISOString() : null)}
//                             disabled={!isEditMode}
//                         />
//                     </FormItem>
//                 </div>

//                 <div className="flex justify-end gap-2 mt-8">
//                     {!isEditMode ? (
//                         <Button variant="solid" onClick={handleEdit}>
//                             Edit
//                         </Button>
//                     ) : (
//                         <>
//                             <Button variant="plain" onClick={handleCancel}>
//                                 Cancel
//                             </Button>
//                             <Button variant="solid" onClick={handleSubmit}>
//                                 Save Changes
//                             </Button>
//                         </>
//                     )}
//                 </div>
//             </FormContainer>
//         </div>
//     );
// };

// export default ESIConfiguration;


import React, { useEffect, useState } from 'react';
import { Button, toast, Notification } from '@/components/ui';
import { FormItem, FormContainer } from '@/components/ui/Form';
import SimpleDatePicker from '@/components/ui/OutlinedInput/SimpleDatePicker';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import * as yup from 'yup';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { format, parseISO, startOfDay } from 'date-fns';

const formatDateForSubmission = (date: Date | null): string | null => {
    if (!date) return null;
    return format(startOfDay(date), 'yyyy-MM-dd');
};

// Helper function to parse API date
const parseAPIDate = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    return parseISO(dateString);
};

const createESIValidationSchema = () => {
    return yup.object().shape({
        payment_due_date: yup
            .date()
            .required('Due date is required')
            .typeError('Due date must be a valid date'),
    });
};

type ESIFrequency = 'monthly';

interface SelectOption {
    value: string;
    label: string;
}

const frequencyOptions = [{ value: 'monthly', label: 'Monthly' }];

const ESIConfiguration = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedFrequency, setSelectedFrequency] = useState<SelectOption>({ value: 'monthly', label: 'Monthly' });
    const [paymentMode, setPaymentMode] = useState('online');
    const [paymentDueDate, setPaymentDueDate] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchESIConfig();
    }, []);

    const fetchESIConfig = async () => {
        try {
            setIsLoading(true);
            const response = await httpClient.get(endpoints.esiConfig.detail(1));
            const configData = response.data;

            if (configData) {
                setPaymentMode(configData.esi_payment_mode);
                setSelectedFrequency({
                    value: configData.esi_frequency,
                    label: configData.esi_frequency.charAt(0).toUpperCase() + configData.esi_frequency.slice(1),
                });
                setPaymentDueDate(
                    configData.esi_payment_due_date?.first_date ? 
                    format(parseAPIDate(configData.esi_payment_due_date.first_date), 'yyyy-MM-dd') : 
                    null
                );
            }
        } catch (error) {
            showErrorNotification('Failed to fetch ESI configuration');
        } finally {
            setIsLoading(false);
        }
    };

    const validateDates = async () => {
        try {
            const validationSchema = createESIValidationSchema();
            await validationSchema.validate(
                { payment_due_date: paymentDueDate ? parseAPIDate(paymentDueDate) : null }, 
                { abortEarly: false }
            );
            setValidationErrors({});
            return true;
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const newErrors = {};
                error.inner.forEach((err) => {
                    newErrors[err.path] = err.message;
                });
                setValidationErrors(newErrors);
            }
            return false;
        }
    };

    const handleEdit = () => setIsEditMode(true);

    const handleCancel = () => {
        setIsEditMode(false);
        fetchESIConfig();
    };

    const handleSubmit = async () => {
        const isValid = await validateDates();

        if (!isValid) return;

        const esiConfigData = {
            esi_frequency: selectedFrequency.value,
            esi_payment_mode: paymentMode,
            esi_payment_due_date: {
                first_date: paymentDueDate,
                second_date: null,
                third_date: null,
                last_date: null
            }
        };

        try {
            await httpClient.put(endpoints.esiConfig.update(1), esiConfigData);
          toast.push(
            <Notification title="Copy Success" type="success">
           ESI configuration updatd Successfully
        </Notification>,
          )
            setIsEditMode(false);
        } catch (error) {
            showErrorNotification('An error occurred while saving the configuration');
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-6">
                <h3 className="text-2xl font-bold">ESI Configuration</h3>
            </div>
            <FormContainer>
                <div className="grid grid-cols-2 gap-6">
                    <FormItem>
                        <label className="text-gray-600 mb-2 block">ESI Payment Mode</label>
                        <div className="text-gray-500 p-2 bg-gray-50 rounded border">{paymentMode}</div>
                    </FormItem>

                    <FormItem>
                        <label className="text-gray-600 mb-2 block">ESI Frequency</label>
                        <OutlinedSelect
                            label="Select ESI Frequency"
                            options={frequencyOptions}
                            value={selectedFrequency}
                            onChange={setSelectedFrequency}
                            disabled={!isEditMode}
                        />
                    </FormItem>

                    <FormItem
                        invalid={!!validationErrors.payment_due_date}
                        errorMessage={validationErrors.payment_due_date}
                    >
                        <label className="text-gray-600 mb-2 block">ESI Monthly Due Date <span className="text-red-500">*</span></label>
                        <SimpleDatePicker
                            className="w-full"
                            placeholder="Select ESI due date"
                            value={paymentDueDate ? parseISO(paymentDueDate) : null}
                            onChange={(date) => setPaymentDueDate(date ? formatDateForSubmission(date) : null)}
                            disabled={!isEditMode}
                        />
                    </FormItem>
                </div>

                <div className="flex justify-end gap-2 mt-8">
                    {!isEditMode ? (
                        <Button variant="solid" onClick={handleEdit}>
                            Edit
                        </Button>
                    ) : (
                        <>
                            <Button variant="plain" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button variant="solid" onClick={handleSubmit}>
                                Save Changes
                            </Button>
                        </>
                    )}
                </div>
            </FormContainer>
        </div>
    );
};

export default ESIConfiguration;