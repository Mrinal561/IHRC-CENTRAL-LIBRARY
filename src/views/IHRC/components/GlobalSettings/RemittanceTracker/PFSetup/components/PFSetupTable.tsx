

// import React, { useEffect, useMemo, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import DataTable from '@/components/shared/DataTable';
// import { format } from 'date-fns';
// import { Button, Dialog, Tooltip } from '@/components/ui';
// import { MdEdit } from 'react-icons/md';
// import { HiOutlineViewGrid } from 'react-icons/hi';
// import { AppDispatch } from '@/store';
// import { fetchPFConfigById, fetchPFConfigs, updatePFConfig } from '@/store/slices/pfConfig/pfConfigSlice';
// import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json';
// import Lottie from 'lottie-react';
// import OutlinedSelect from '@/components/ui/Outlined/Outlined';
// import DatePicker from '@/components/ui/DatePicker';
// import { showErrorNotification } from '@/components/ui/ErrorMessage';
// import * as yup from 'yup';

// // First, add the validation schema for PF setup
// const createPFValidationSchema = (frequency: string) => {
//     const baseSchema = {
//         first_date: yup
//             .date()
//             .required('Due date is required')
//             .typeError('Due date must be a valid date'),
//     };

//     // For PF, we only need the base schema since it's monthly only
//     return yup.object().shape(baseSchema);
// };
// type PaymentMode = 'online' | 'offline';
// type PFFrequency = 'monthly';

// interface SelectOption {
//   value: string;
//   label: string;
// }

// interface PaymentDueDates {
//   first_date: string | null;
//   second_date: string | null;
//   third_date: string | null;
//   last_date: string | null;
// }

// const paymentModeOptions = [
//   { value: 'online', label: 'Online' },
//   { value: 'offline', label: 'Offline' },
// ];

// const frequencyOptions = [
//   { value: 'monthly', label: 'Monthly' },
// ];

// const PFSetupTable = ({ refreshTrigger } : any) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [pfTableData, setPFTableData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [currentPFId, setCurrentPFId] = useState<string | null>(null);
//   const [pfValidationErrors, setPfValidationErrors] = useState({
//     first_date: undefined,
// });

// const [pfiwValidationErrors, setPfiwValidationErrors] = useState({
//     first_date: undefined,
// });
//   // Form states
//   const [selectedPFPaymentMode, setSelectedPFPaymentMode] = useState<SelectOption | null>(null);
//   const [selectedPFIWPaymentMode, setSelectedPFIWPaymentMode] = useState<SelectOption | null>(null);
//   const [selectedPFFrequency, setSelectedPFFrequency] = useState<SelectOption | null>(null);
//   const [selectedPFIWFrequency, setSelectedPFIWFrequency] = useState<SelectOption | null>(null);
//   const [pfPaymentDueDates, setPFPaymentDueDates] = useState<PaymentDueDates>({
//     first_date: null,
//     second_date: null,
//     third_date: null,
//     last_date: null
//   });
//   const [pfiWPaymentDueDates, setPFIWPaymentDueDates] = useState<PaymentDueDates>({
//     first_date: null,
//     second_date: null,
//     third_date: null,
//     last_date: null
//   });



//   const validatePFDates = async () => {
//     try {
//         const validationSchema = createPFValidationSchema(selectedPFFrequency?.value);
//         await validationSchema.validate(pfPaymentDueDates, { abortEarly: false });
//         setPfValidationErrors({});
//         return true;
//     } catch (error) {
//         if (error instanceof yup.ValidationError) {
//             const newErrors = {};
//             error.inner.forEach((err) => {
//                 newErrors[err.path] = err.message;
//             });
//             setPfValidationErrors(newErrors);
//             return false;
//         }
//         return false;
//     }
// };

// const validatePFIWDates = async () => {
//     try {
//         const validationSchema = createPFValidationSchema(selectedPFIWFrequency?.value);
//         await validationSchema.validate(pfiWPaymentDueDates, { abortEarly: false });
//         setPfiwValidationErrors({});
//         return true;
//     } catch (error) {
//         if (error instanceof yup.ValidationError) {
//             const newErrors = {};
//             error.inner.forEach((err) => {
//                 newErrors[err.path] = err.message;
//             });
//             setPfiwValidationErrors(newErrors);
//             return false;
//         }
//         return false;
//     }
// };

// useEffect(() => {
//   validatePFDates();
// }, [pfPaymentDueDates, selectedPFFrequency]);

// useEffect(() => {
//   validatePFIWDates();
// }, [pfiWPaymentDueDates, selectedPFIWFrequency]);

//   const formatDate = (date: string | null) => {
//     if (!date) return '-';
//     return format(new Date(date), 'MMM dd, yyyy');
//   };

//   const getFrequencyLabel = (value: string | null) => {
//     if (!value) return '-';
//     const labels: { [key: string]: string } = {
//       'yearly': 'Yearly',
//       'half_yearly': 'Half Yearly',
//       'monthly': 'Monthly',
//       'quarterly': 'Quarterly'
//     };
//     return labels[value] || value;
//   };

//   const columns = useMemo(
//     () => [
//       {
//         header: 'Mode',
//         accessorKey: 'payment_mode',
//         enableSorting:false,
//       },
//       {
//         header: 'PF Frequency',
//         accessorKey: 'pf_frequency',
//         enableSorting:false,
//         cell: ({ row }) => getFrequencyLabel(row.original.pf_frequency),
//       },
//       {
//         header: 'First Due Date',
//         accessorKey: 'first_date',
//         enableSorting:false,
//         cell: ({ row }) => formatDate(row.original.pf_payment_due_date.first_date),
//       },
//       {
//         header: 'Mode',
//         accessorKey: 'pfiw_payment_mode',
//         enableSorting:false,
//       },
//       {
//         header: 'PFIW Frequency',
//         accessorKey: 'pfiw_frequency',
//         enableSorting:false,
//         cell: ({ row }) => getFrequencyLabel(row.original.pfiw_frequency),
//       },
//       {
//         header: 'First Due Date',
//         accessorKey: 'first_date',
//         enableSorting:false,
//         cell: ({ row }) => formatDate(row.original.pfiw_payment_due_date.first_date),
//       },
//       {
//         header: 'Actions',
//         id: 'actions',
//         enableSorting:false,
//         cell: ({ row }) => (
//           <div className="flex space-x-2">
//             <Tooltip title="Edit" placement="top">
//               <Button
//                 size="sm"
//                 icon={<MdEdit />}
//                 onClick={() => handleEdit(row.original)}
//               />
//             </Tooltip>
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   const [tableData, setTableData] = useState({
//     total: 0,
//     pageIndex: 1,
//     pageSize: 10,
//     query: '',
//     sort: { order: '', key: '' },
//   });

//   useEffect(() => {
//     fetchPFSetupData(tableData.pageIndex, tableData.pageSize);
//   }, [refreshTrigger]);

//   const fetchPFSetupData = async (page: number, size: number) => {
//     setIsLoading(true);
//     try {
//       const { payload } = await dispatch(
//         fetchPFConfigs({ page, page_size: size })
//       );
      
//       if (payload?.data && payload?.paginateData) {
//         setPFTableData(payload?.data);
//         setTableData((prev) => ({
//           ...prev,
//           total: payload.paginateData.totalResult,
//           totalPages: payload.paginateData.totalPages,
//           pageIndex: page, 
//           pageSize: size
//         }));
//       }
//     } catch (error) {
//       console.error('Failed to fetch PF setups', error);
//     }
//     finally {
//       setIsLoading(false);
//     }
//   };

//   // const handleEdit = (pfToEdit: any) => {
//   //   setIsDialogOpen(true);
//   //   setCurrentPFId(pfToEdit.id);

//   //   // Set PF Payment Mode
//   //   setSelectedPFPaymentMode({ 
//   //     value: pfToEdit.payment_mode, 
//   //     label: pfToEdit.payment_mode === 'online' ? 'Online' : 'Offline' 
//   //   });

//   //   // Set PFIW Payment Mode
//   //   setSelectedPFIWPaymentMode({ 
//   //     value: pfToEdit.pfiw_payment_mode, 
//   //     label: pfToEdit.pfiw_payment_mode === 'online' ? 'Online' : 'Offline' 
//   //   });

//   //   // Set PF Frequency
//   //   setSelectedPFFrequency({ 
//   //     value: pfToEdit.pf_frequency, 
//   //     label: pfToEdit.pf_frequency.charAt(0).toUpperCase() + pfToEdit.pf_frequency.slice(1)
//   //   });

//   //   // Set PFIW Frequency
//   //   setSelectedPFIWFrequency({ 
//   //     value: pfToEdit.pfiw_frequency, 
//   //     label: pfToEdit.pfiw_frequency.charAt(0).toUpperCase() + pfToEdit.pfiw_frequency.slice(1)
//   //   });

//   //   // Set Payment Due Dates
//   //   setPFPaymentDueDates({
//   //     first_date: pfToEdit.pf_payment_due_date.first_date,
//   //     second_date: pfToEdit.pf_payment_due_date.second_date,
//   //     third_date: pfToEdit.pf_payment_due_date.third_date,
//   //     last_date: pfToEdit.pf_payment_due_date.last_date
//   //   });

//   //   setPFIWPaymentDueDates({
//   //     first_date: pfToEdit.pfiw_payment_due_date.first_date,
//   //     second_date: pfToEdit.pfiw_payment_due_date.second_date,
//   //     third_date: pfToEdit.pfiw_payment_due_date.third_date,
//   //     last_date: pfToEdit.pfiw_payment_due_date.last_date
//   //   });
//   // };


//   const handleEdit = async (pfToEdit: any) => {
//     setIsDialogOpen(true);
//     setCurrentPFId(pfToEdit.id);
    
//     try {
//       // Fetch detailed PF config data and destructure the payload directly
//       const response = await dispatch(fetchPFConfigById(pfToEdit.id)).unwrap();
//       const pfConfig = response; // Now working with direct object
      
//       console.log("Fetched PF Config:", pfConfig); // Add this to debug
  
//       if (pfConfig) {
//         // Set PF Payment Mode
//         setSelectedPFPaymentMode({ 
//           value: pfConfig.payment_mode, 
//           label: pfConfig.payment_mode === 'online' ? 'Online' : 'Offline' 
//         });
  
//         // Set PFIW Payment Mode
//         setSelectedPFIWPaymentMode({ 
//           value: pfConfig.pfiw_payment_mode, 
//           label: pfConfig.pfiw_payment_mode === 'online' ? 'Online' : 'Offline' 
//         });
  
//         // Set PF Frequency
//         setSelectedPFFrequency({ 
//           value: pfConfig.pf_frequency, 
//           label: pfConfig.pf_frequency.charAt(0).toUpperCase() + pfConfig.pf_frequency.slice(1)
//         });
  
//         // Set PFIW Frequency
//         setSelectedPFIWFrequency({ 
//           value: pfConfig.pfiw_frequency, 
//           label: pfConfig.pfiw_frequency.charAt(0).toUpperCase() + pfConfig.pfiw_frequency.slice(1)
//         });
  
//         // Set Payment Due Dates - Add console.log to debug
//         console.log("PF Due Dates:", pfConfig.pf_payment_due_date);
//         setPFPaymentDueDates({
//           first_date: pfConfig.pf_payment_due_date.first_date || null,
//           second_date: pfConfig.pf_payment_due_date.second_date || null,
//           third_date: pfConfig.pf_payment_due_date.third_date || null,
//           last_date: pfConfig.pf_payment_due_date.last_date || null
//         });
  
//         console.log("PFIW Due Dates:", pfConfig.pfiw_payment_due_date);
//         setPFIWPaymentDueDates({
//           first_date: pfConfig.pfiw_payment_due_date.first_date || null,
//           second_date: pfConfig.pfiw_payment_due_date.second_date || null,
//           third_date: pfConfig.pfiw_payment_due_date.third_date || null,
//           last_date: pfConfig.pfiw_payment_due_date.last_date || null
//         });
//       }
//     } catch (error: any) {
//       console.error('Failed to fetch PF config details:', error);
//       if (error.response?.data?.message) {
//         showErrorNotification(error.response.data.message);
//       } else if (error.message) {
//         showErrorNotification(error.message);
//       } else {
//         showErrorNotification('Failed to fetch PF config details');
//       }
//       setIsDialogOpen(false);
//     }
//   };
//   const handleDialogClose = () => {
//     setIsDialogOpen(false);
//     resetForm();
//   };

//   const resetForm = () => {
//     setSelectedPFPaymentMode(null);
//     setSelectedPFIWPaymentMode(null);
//     setSelectedPFFrequency(null);
//     setSelectedPFIWFrequency(null);
//     setPFPaymentDueDates({
//       first_date: null,
//       second_date: null,
//       third_date: null,
//       last_date: null
//     });
//     setPFIWPaymentDueDates({
//       first_date: null,
//       second_date: null,
//       third_date: null,
//       last_date: null
//     });
//     setCurrentPFId(null);
//   };

//   const handleConfirm = async () => {
//     if (!selectedPFPaymentMode || !selectedPFIWPaymentMode || 
//       !selectedPFFrequency || !selectedPFIWFrequency) {
//       showErrorNotification('Please fill in all required fields');
//       return;
//   }

//   const isPFValid = await validatePFDates();
//   const isPFIWValid = await validatePFIWDates();

//   if (!isPFValid || !isPFIWValid) {
//       return;
//   }

//     const pfConfigData = {
//       payment_mode: selectedPFPaymentMode.value as PaymentMode,
//       pfiw_payment_mode: selectedPFIWPaymentMode.value as PaymentMode,
//       pf_frequency: selectedPFFrequency.value as PFFrequency,
//       pfiw_frequency: selectedPFIWFrequency.value as PFFrequency,
//       pf_payment_due_date: pfPaymentDueDates,
//       pfiw_payment_due_date: pfiWPaymentDueDates
//     };

//     try {
//       if (currentPFId) {
//         const result = await dispatch(updatePFConfig({ 
//           id: currentPFId, 
//           data: pfConfigData 
//         })).unwrap();

//         if (result) {
//           handleDialogClose();
//           fetchPFSetupData(tableData.pageIndex, tableData.pageSize);
//         }
//       }
//     } catch (error: any) {
//       console.error(error);
//       if (error.response?.data?.message) {
//         showErrorNotification(error.response.data.message);
//       } else if (error.message) {
//         showErrorNotification(error.message);
//       } else {
//         showErrorNotification(error);
//       }
//     }
//   };

//   const onPaginationChange = (page: number) => {
//     setTableData(prev => ({ ...prev, pageIndex: page }));
//     fetchPFSetupData(page, tableData.pageSize);
//   };

//   const onSelectChange = (value: number) => {
//     setTableData((prev) => ({
//       ...prev,
//       pageSize: Number(value),
//       pageIndex: 1,
//     }));
//     fetchPFSetupData(1, value);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
//         <div className="w-28 h-28">
//           <Lottie 
//             animationData={loadingAnimation} 
//             loop 
//             className="w-24 h-24"
//           />
//         </div>
//         <p className="text-lg font-semibold">Loading Data...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="relative">
//       {pfTableData.length === 0 ? (
//         <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
//           <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
//           <p className="text-center">No Data Available</p>
//         </div>
//       ) : (
//         <>
//           <DataTable
//             columns={columns}
//             data={pfTableData}
//             loading={isLoading}
//             stickyHeader={true}
//             stickyFirstColumn={true}
//             stickyLastColumn={true}
//             pagingData={{
//               total: tableData.total,
//               pageIndex: tableData.pageIndex,
//               pageSize: tableData.pageSize,
//             }}
//             onPaginationChange={onPaginationChange}
//             onSelectChange={onSelectChange}
//             selectable={true}
//           />

//           <Dialog
//             isOpen={isDialogOpen}
//             onClose={handleDialogClose}
//             onRequestClose={handleDialogClose}
//           >
//             <h5 className="mb-6">Edit PF Setup</h5>
//             <div className="flex flex-col gap-6">
//               <div className="flex gap-4">
//                 <div className="w-full">
//                   <label className="text-gray-600 mb-2 block">PF Payment Mode</label>
//                   <OutlinedSelect
//                     label="Select PF Payment Mode"
//                     options={paymentModeOptions}
//                     value={selectedPFPaymentMode}
//                     onChange={setSelectedPFPaymentMode}
//                   />
//                 </div>
//                 <div className="w-full">
//                   <label className="text-gray-600 mb-2 block">PFIW Payment Mode</label>
//                   <OutlinedSelect
//                     label="Select PFIW Payment Mode"
//                     options={paymentModeOptions}
//                     value={selectedPFIWPaymentMode}
//                     onChange={setSelectedPFIWPaymentMode}
//                   />
//                 </div>
//               </div>

//               <div className="flex gap-4">
//                 <div className="w-full">
//                   <label className="text-gray-600 mb-2 block">PF Frequency</label>
//                   <OutlinedSelect
//                     label="Select PF Frequency"
//                     options={frequencyOptions}
//                     value={selectedPFFrequency}
//                     onChange={setSelectedPFFrequency}
//                   />
//                 </div>
//                 <div className="w-full">
//                   <label className="text-gray-600 mb-2 block">PFIW Frequency</label>
//                   <OutlinedSelect
//                     label="Select PFIW Frequency"
//                     options={frequencyOptions}
//                     value={selectedPFIWFrequency}
//                     onChange={setSelectedPFIWFrequency}
//                   />
//                 </div>
//               </div>

//               <div className="flex gap-4">
//                 <div className="w-full">
//                   <label className="text-gray-600 mb-2 block">PF Due Date <span className="text-red-500">*</span></label>
//                   <DatePicker
//                     className="w-full"
//                     placeholder="Select PF first due date"
//                     value={pfPaymentDueDates.first_date ? new Date(pfPaymentDueDates.first_date) : null}
//                     onChange={(date) => setPFPaymentDueDates(prev => ({
//                       ...prev,
//                       first_date: date ? date.toISOString() : null
//                     }))}

//                     inputFormat="DD"
//                     defaultView="date"
//                     enableHeaderLabel={false}
//                     dateViewCount={1}
//                     labelFormat={{
//                         month: ' ',  // Using space instead of empty string
//                         year: ' '    // Using space instead of empty string
//                     }}
//                     monthLabelFormat=" "
//                     yearLabelFormat=" "
//                     hideWeekdays={false}                    
//                   />
//                   {pfValidationErrors.first_date && (
//     <div className="text-red-500 text-sm mt-1">
//         {pfValidationErrors.first_date}
//     </div>
// )}
//                 </div>
//                 <div className="w-full">
//                   <label className="text-gray-600 mb-2 block">PFIW Due Date <span className="text-red-500">*</span></label>
//                   <DatePicker
//                     className="w-full"
//                     placeholder="Select PFIW first due date"
//                     value={pfiWPaymentDueDates.first_date ? new Date(pfiWPaymentDueDates.first_date) : null}
//                     onChange={(date) => setPFIWPaymentDueDates(prev => ({
//                       ...prev,
//                       first_date: date ? date.toISOString() : null
//                     }))}
//                     inputFormat="DD"
//                     defaultView="date"
//                     enableHeaderLabel={false}
//                     dateViewCount={1}
//                     labelFormat={{
//                         month: ' ',  // Using space instead of empty string
//                         year: ' '    // Using space instead of empty string
//                     }}
//                     monthLabelFormat=" "
//                     yearLabelFormat=" "
//                     hideWeekdays={false}             
//                   />
//                   {pfiwValidationErrors.first_date && (
//     <div className="text-red-500 text-sm mt-1">
//         {pfiwValidationErrors.first_date}
//     </div>
// )}
//                 </div>
//               </div>

//               <div className="flex justify-end gap-2 mt-6">
//                 <Button
//                   variant="plain"
//                   onClick={handleDialogClose}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="solid"
//                   onClick={handleConfirm}
//                 >
//                   Confirm
//                 </Button>
//               </div>
//             </div>
//           </Dialog>
//         </>
//       )}
//     </div>
//   );
// };

// export default PFSetupTable;
            



import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { Button, Dialog } from '@/components/ui';
import { FormItem, FormContainer } from '@/components/ui/Form';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { AppDispatch } from '@/store';
import { fetchPFConfigs, fetchPFConfigById, updatePFConfig } from '@/store/slices/pfConfig/pfConfigSlice';
import loadingAnimation from '@/assets/lotties/system-regular-716-spinner-three-dots-loop-scale.json'
import Lottie from 'lottie-react';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import DatePicker from '@/components/ui/DatePicker';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import * as yup from 'yup';

// First, add the validation schema for PF setup
const createPFValidationSchema = (frequency: string) => {
    const baseSchema = {
        first_date: yup
            .date()
            .required('Due date is required')
            .typeError('Due date must be a valid date'),
    };

    // For PF, we only need the base schema since it's monthly only
    return yup.object().shape(baseSchema);
};
type PaymentMode = 'online' | 'offline';
type PFFrequency = 'monthly';

interface SelectOption {
  value: string;
  label: string;
}

interface PaymentDueDates {
  first_date: string | null;
  second_date: string | null;
  third_date: string | null;
  last_date: string | null;
}

const paymentModeOptions = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
];

const frequencyOptions = [
  { value: 'monthly', label: 'Monthly' },
];

const PFSetupTable = ({ refreshTrigger } : any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [pfData, setPFData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pfTableData, setPFTableData] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPFId, setCurrentPFId] = useState<string | null>(null);
  const [pfValidationErrors, setPfValidationErrors] = useState({
    first_date: undefined,
});

const [pfiwValidationErrors, setPfiwValidationErrors] = useState({
    first_date: undefined,
});
  // Form states
  const [selectedPFPaymentMode, setSelectedPFPaymentMode] = useState<SelectOption | null>(null);
  const [selectedPFIWPaymentMode, setSelectedPFIWPaymentMode] = useState<SelectOption | null>(null);
  const [selectedPFFrequency, setSelectedPFFrequency] = useState<SelectOption | null>(null);
  const [selectedPFIWFrequency, setSelectedPFIWFrequency] = useState<SelectOption | null>(null);
  const [pfPaymentDueDates, setPFPaymentDueDates] = useState<PaymentDueDates>({
    first_date: null,
    second_date: null,
    third_date: null,
    last_date: null
  });
  const [pfiWPaymentDueDates, setPFIWPaymentDueDates] = useState<PaymentDueDates>({
    first_date: null,
    second_date: null,
    third_date: null,
    last_date: null
  });



  const validatePFDates = async () => {
    try {
        const validationSchema = createPFValidationSchema(selectedPFFrequency?.value);
        await validationSchema.validate(pfPaymentDueDates, { abortEarly: false });
        setPfValidationErrors({});
        return true;
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setPfValidationErrors(newErrors);
            return false;
        }
        return false;
    }
};

const validatePFIWDates = async () => {
    try {
        const validationSchema = createPFValidationSchema(selectedPFIWFrequency?.value);
        await validationSchema.validate(pfiWPaymentDueDates, { abortEarly: false });
        setPfiwValidationErrors({});
        return true;
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setPfiwValidationErrors(newErrors);
            return false;
        }
        return false;
    }
};

useEffect(() => {
  validatePFDates();
}, [pfPaymentDueDates, selectedPFFrequency]);

useEffect(() => {
  validatePFIWDates();
}, [pfiWPaymentDueDates, selectedPFIWFrequency]);

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const getFrequencyLabel = (value: string | null) => {
    if (!value) return '-';
    const labels: { [key: string]: string } = {
      'yearly': 'Yearly',
      'half_yearly': 'Half Yearly',
      'monthly': 'Monthly',
      'quarterly': 'Quarterly'
    };
    return labels[value] || value;
  };
  useEffect(() => {
    fetchPFSetupData();
  }, [refreshTrigger]);

  const fetchPFSetupData = async () => {
    setIsLoading(true);
    try {
      const { payload } = await dispatch(fetchPFConfigs({ page: 1, page_size: 1 }));
      if (payload?.data && payload?.data.length > 0) {
        setPFData(payload.data[0]);
        // If data exists, populate the form fields
        const pfConfig = payload.data[0];
        setSelectedPFPaymentMode({ 
          value: pfConfig.payment_mode, 
          label: pfConfig.payment_mode === 'online' ? 'Online' : 'Offline' 
        });
        setSelectedPFIWPaymentMode({ 
          value: pfConfig.pfiw_payment_mode, 
          label: pfConfig.pfiw_payment_mode === 'online' ? 'Online' : 'Offline' 
        });
        setSelectedPFFrequency({ 
          value: pfConfig.pf_frequency, 
          label: pfConfig.pf_frequency.charAt(0).toUpperCase() + pfConfig.pf_frequency.slice(1)
        });
        setSelectedPFIWFrequency({ 
          value: pfConfig.pfiw_frequency, 
          label: pfConfig.pfiw_frequency.charAt(0).toUpperCase() + pfConfig.pfiw_frequency.slice(1)
        });
        setPFPaymentDueDates({
          first_date: pfConfig.pf_payment_due_date.first_date,
          second_date: pfConfig.pf_payment_due_date.second_date,
          third_date: pfConfig.pf_payment_due_date.third_date,
          last_date: pfConfig.pf_payment_due_date.last_date
        });
        setPFIWPaymentDueDates({
          first_date: pfConfig.pfiw_payment_due_date.first_date,
          second_date: pfConfig.pfiw_payment_due_date.second_date,
          third_date: pfConfig.pfiw_payment_due_date.third_date,
          last_date: pfConfig.pfiw_payment_due_date.last_date
        });
      }
    } catch (error) {
      console.error('Failed to fetch PF setups', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    fetchPFSetupData(); // Reset to original data
  };

  const handleSubmit = async () => {
    if (!selectedPFPaymentMode || !selectedPFIWPaymentMode || 
        !selectedPFFrequency || !selectedPFIWFrequency) {
      showErrorNotification('Please fill in all required fields');
      return;
    }

    const isPFValid = await validatePFDates();
    const isPFIWValid = await validatePFIWDates();

    if (!isPFValid || !isPFIWValid) {
      return;
    }

    const pfConfigData = {
      payment_mode: selectedPFPaymentMode.value as PaymentMode,
      pfiw_payment_mode: selectedPFIWPaymentMode.value as PaymentMode,
      pf_frequency: selectedPFFrequency.value as PFFrequency,
      pfiw_frequency: selectedPFIWFrequency.value as PFFrequency,
      pf_payment_due_date: pfPaymentDueDates,
      pfiw_payment_due_date: pfiWPaymentDueDates
    };

    try {
      if (pfData?.id) {
        const result = await dispatch(updatePFConfig({ 
          id: pfData.id, 
          data: pfConfigData 
        })).unwrap();

        if (result) {
          setIsEditMode(false);
          fetchPFSetupData();
        }
      }
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.message) {
        showErrorNotification(error.response.data.message);
      } else if (error.message) {
        showErrorNotification(error.message);
      } else {
        showErrorNotification(error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 rounded-xl">
        <div className="w-28 h-28">
          <Lottie 
            animationData={loadingAnimation} 
            loop 
            className="w-24 h-24"
          />
        </div>
        <p className="text-lg font-semibold">Loading Data...</p>
      </div>
    );
  }
  if (!pfData) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500 border rounded-xl">
        <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
        <p className="text-center">No Data Available</p>
      </div>
    );
  }

  return (
<div className="bg-white p-6 rounded-lg shadow-sm">
      <FormContainer>
        <div className="mb-6">
          <h5>PF Setup Configuration</h5>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormItem>
          <label className="text-gray-600 mb-2 block">PF Payment Mode<span className="text-red-500">*</span></label>
            <OutlinedSelect
              label="Select PF Payment Mode"
              options={paymentModeOptions}
              value={selectedPFPaymentMode}
              onChange={setSelectedPFPaymentMode}
              disabled={!isEditMode}
            />
          </FormItem>

          <FormItem>
          <label className="text-gray-600 mb-2 block">PFIW Payment Mode<span className="text-red-500">*</span></label>
            <OutlinedSelect
              label="Select PFIW Payment Mode"
              options={paymentModeOptions}
              value={selectedPFIWPaymentMode}
              onChange={setSelectedPFIWPaymentMode}
              disabled={!isEditMode}
            />
          </FormItem>

          <FormItem>
          <label className="text-gray-600 mb-2 block">PF Frequency<span className="text-red-500">*</span></label>
            <OutlinedSelect
              label="Select PF Frequency"
              options={frequencyOptions}
              value={selectedPFFrequency}
              onChange={setSelectedPFFrequency}
              disabled={!isEditMode}
            />
          </FormItem>

          <FormItem>
          <label className="text-gray-600 mb-2 block">PFIW Frequency<span className="text-red-500">*</span></label>
            <OutlinedSelect
              label="Select PFIW Frequency"
              options={frequencyOptions}
              value={selectedPFIWFrequency}
              onChange={setSelectedPFIWFrequency}
              disabled={!isEditMode}
            />
          </FormItem>

          <FormItem 
            // label="PF Due Date" 
            invalid={!!pfValidationErrors.first_date}
            errorMessage={pfValidationErrors.first_date}
          >
            <label className="text-gray-600 mb-2 block">PF Monthly Due Date<span className="text-red-500">*</span></label>
            <DatePicker
              className="w-full"
              placeholder="Select PF first due date"
              value={pfPaymentDueDates.first_date ? new Date(pfPaymentDueDates.first_date) : null}
              onChange={(date) => setPFPaymentDueDates(prev => ({
                ...prev,
                first_date: date ? date.toISOString() : null
              }))}
              disabled={!isEditMode}
              inputFormat="DD"
              defaultView="date"
              enableHeaderLabel={false}
              dateViewCount={1}
              labelFormat={{
                month: ' ',
                year: ' '
              }}
              monthLabelFormat=" "
              yearLabelFormat=" "
              hideWeekdays={false}
            />
          </FormItem>

          <FormItem 
            // label="PFIW Due Date"
            invalid={!!pfiwValidationErrors.first_date}
            errorMessage={pfiwValidationErrors.first_date}
          >
            <label className="text-gray-600 mb-2 block">PFIW Monthly Due Date<span className="text-red-500">*</span></label>
            <DatePicker
              className="w-full"
              placeholder="Select PFIW first due date"
              value={pfiWPaymentDueDates.first_date ? new Date(pfiWPaymentDueDates.first_date) : null}
              onChange={(date) => setPFIWPaymentDueDates(prev => ({
                ...prev,
                first_date: date ? date.toISOString() : null
              }))}
              disabled={!isEditMode}
              inputFormat="DD"
              defaultView="date"
              enableHeaderLabel={false}
              dateViewCount={1}
              labelFormat={{
                month: ' ',
                year: ' '
              }}
              monthLabelFormat=" "
              yearLabelFormat=" "
              hideWeekdays={false}
            />
          </FormItem>
        </div>

        <div className="flex justify-end gap-2 mt-8 pt-6 border-t">
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

export default PFSetupTable   ;