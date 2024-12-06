// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Button, Dialog } from '@/components/ui';
// import { HiPlusCircle } from 'react-icons/hi';
// import AdaptableCard from '@/components/shared/AdaptableCard';
// import OutlinedSelect from '@/components/ui/Outlined/Outlined';
// import DatePicker from '@/components/ui/DatePicker';
// import PFSetupTable from './components/PFSetupTable';
// import { 
//   createPFConfig, 
//   updatePFConfig, 
//   fetchPFConfigs, 
//   clearCurrentPFConfig 
// } from '@/store/slices/pfConfig/pfConfigSlice';
// import { RootState, AppDispatch } from '@/store';
// import { showErrorNotification } from '@/components/ui/ErrorMessage';

// // Define types for better type safety
// type PaymentMode = 'online' | 'offline';
// type PFFrequency = 'monthly' | 'yearly' | 'half_yearly' | 'quarterly';

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
//   { value: 'yearly', label: 'Yearly' },
//   { value: 'half_yearly', label: 'Half Yearly' },
//   { value: 'quarterly', label: 'Quarterly' },
// ];

// const PFSetup: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { pfConfigs, loading, error } = useSelector((state: RootState) => state.pfconfig);

//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentPFId, setCurrentPFId] = useState<string | null>(null);
  
//   const [frequency, setFrequency] = useState<PFFrequency | ''>('');
//   const [selectedPaymentMode, setSelectedPaymentMode] = useState<SelectOption | null>(null);
//   const [selectedFrequency, setSelectedFrequency] = useState<SelectOption | null>(null);
//   const [refreshCounter, setRefreshCounter] = useState(0);

  
//   const [paymentDueDates, setPaymentDueDates] = useState<PaymentDueDates>({
//     first_date: null,
//     second_date: null,
//     third_date: null,
//     last_date: null
//   });

//   const [dateFieldsState, setDateFieldsState] = useState({
//     isSecondDateEnabled: false,
//     isThirdDateEnabled: false,
//     isLastDateEnabled: false
//   });

//   useEffect(() => {
//     dispatch(fetchPFConfigs({ page: 1, page_size: 10 }));
//   }, [dispatch]);

//   const handleFrequencyChange = (selectedOption: SelectOption | null) => {
//     const frequencyValue = selectedOption?.value as PFFrequency;
//     setFrequency(frequencyValue);
//     setSelectedFrequency(selectedOption);
    
//     // Reset date fields based on frequency
//     switch (frequencyValue) {
//       case 'monthly':
//       case 'yearly':
//         setPaymentDueDates({
//           first_date: null,
//           second_date: null,
//           third_date: null,
//           last_date: null
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
//           second_date: null,
//           third_date: null
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

//   const handleDateChange = (dateKey: keyof PaymentDueDates, date: Date | null) => {
//     setPaymentDueDates(prev => ({
//       ...prev,
//       [dateKey]: date ? date.toISOString().split('T')[0] : null
//     }));
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

//   const handlePaymentModeChange = (option: SelectOption | null) => {
//     setSelectedPaymentMode(option);
//   };

//   const handleEdit = (pfToEdit) => {
//     setIsEditMode(true);
//     setIsDialogOpen(true);
//     setCurrentPFId(pfToEdit.id);
//     setFrequency(pfToEdit.frequency);
//     setPaymentDueDates({
//       first_date: pfToEdit.payment_due_date.first_date,
//       second_date: pfToEdit.payment_due_date.second_date,
//       third_date: pfToEdit.payment_due_date.third_date,
//       last_date: pfToEdit.payment_due_date.last_date
//     });
//     setSelectedPaymentMode({ 
//       value: pfToEdit.payment_mode, 
//       label: pfToEdit.payment_mode === 'online' ? 'Online' : 'Offline' 
//     });
//   };

//   const handleDialogClose = () => {
//     setIsDialogOpen(false);
//     setIsEditMode(false);
//     resetForm();
//   };

//   const resetForm = () => {
//     setFrequency('');
//     setPaymentDueDates({
//       first_date: null,
//       second_date: null,
//       third_date: null,
//       last_date: null
//     });
//     setSelectedPaymentMode(null);
//     setSelectedFrequency(null);
//     dispatch(clearCurrentPFConfig());
//   };

//   const handleConfirm = async () => {
//     if (!frequency || !selectedPaymentMode) {
//       showErrorNotification('Please select frequency and payment mode');
//       return;
//     }

//     const pfConfigData = {
//       pf_frequency: frequency,
//       payment_mode: selectedPaymentMode.value as PaymentMode,
//       pt_payment_due_date: paymentDueDates
//     };

//     try {
//       if (isEditMode && currentPFId) {
//         const result = await dispatch(updatePFConfig({ 
//           id: currentPFId, 
//           data: pfConfigData 
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

//         if(result){
//           handleDialogClose();
//           dispatch(fetchPFConfigs({ page: 1, page_size: 10 }));
//           setRefreshCounter(prev => prev + 1); 

//         }

//       } else {
//         const result = await dispatch(createPFConfig(pfConfigData))
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
//           dispatch(fetchPFConfigs({ page: 1, page_size: 10 }));
//           setRefreshCounter(prev => prev + 1); 

//         }
//       }
//     } catch (error) {
//       console.error(error);
//       // showErrorNotification(error);
//     }
//   };


//   return (
//     <AdaptableCard className="h-full" bodyClass="h-full">
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
//         <div className="mb-4 lg:mb-0">
//           <h3 className="text-2xl font-bold">PF Global Setup</h3>
//         </div>
//         <div className="flex gap-2">
//           <Button
//             variant="solid"
//             size="sm"
//             icon={<HiPlusCircle />}
//             onClick={() => setIsDialogOpen(true)}
//           >
//             Add PF Setup
//           </Button>
//         </div>
//       </div>
      
//       <PFSetupTable 
//         // data={pfConfigs}
//         // loading={loading}
//         onEdit={handleEdit}
//         refreshTrigger={refreshCounter}

//       />

//       <Dialog
//         isOpen={isDialogOpen}
//         onClose={handleDialogClose}
//         onRequestClose={handleDialogClose}
//       >
//         <h5 className="mb-6">{isEditMode ? 'Edit PF Setup' : 'Add PF Setup'}</h5>
//         <div className="flex flex-col gap-6">
//           <div className="flex gap-4">
//             <div className="w-full">
//               <label className="text-gray-600 mb-2 block">Payment Mode</label>
//               <OutlinedSelect
//                 label="Select Payment Mode"
//                 options={paymentModeOptions}
//                 value={selectedPaymentMode}
//                 onChange={handlePaymentModeChange}
//               />
//             </div>
//           </div>

//           <div className="flex gap-4">
//             <div className="w-full">
//               <label className="text-gray-600 mb-2 block">PF Frequency</label>
//               <OutlinedSelect
//                 label="Select PF Frequency"
//                 options={frequencyOptions}
//                 value={selectedFrequency}
//                 onChange={handleFrequencyChange}
//               />
//             </div>
//           </div>

//           <div className="flex gap-4">
//             <div className="w-1/2">
//               <label className="text-gray-600 mb-2 block">First Due Date <span className="text-red-500">*</span></label>
//               <DatePicker
//                 className="w-full"
//                 placeholder="Select first due date"
//                 value={paymentDueDates.first_date ? new Date(paymentDueDates.first_date) : null}
//                 onChange={(date) => handleDateChange('first_date', date)}
//               />
//             </div>
//             <div className="w-1/2">
//               <label className="text-gray-600 mb-2 block">Second Due Date</label>
//               <DatePicker
//                 className="w-full"
//                 placeholder="Select second due date"
//                 value={paymentDueDates.second_date ? new Date(paymentDueDates.second_date) : null}
//                 onChange={(date) => handleDateChange('second_date', date)}
//                 disabled={isDueDateDisabled(1)}
//               />
//             </div>
//           </div>

//           <div className="flex gap-4">
//             <div className="w-1/2">
//               <label className="text-gray-600 mb-2 block">Third Due Date</label>
//               <DatePicker
//                 className="w-full"
//                 placeholder="Select third due date"
//                 value={paymentDueDates.third_date ? new Date(paymentDueDates.third_date) : null}
//                 onChange={(date) => handleDateChange('third_date', date)}
//                 disabled={isDueDateDisabled(2)}
//               />
//             </div>
//             <div className="w-1/2">
//               <label className="text-gray-600 mb-2 block">Fourth Due Date</label>
//               <DatePicker
//                 className="w-full"
//                 placeholder="Select fourth due date"
//                 value={paymentDueDates.last_date ? new Date(paymentDueDates.last_date) : null}
//                 onChange={(date) => handleDateChange('last_date', date)}
//                 disabled={isDueDateDisabled(3)}
//               />
//             </div>
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

// export default PFSetup;


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog } from '@/components/ui';
import { HiPlusCircle } from 'react-icons/hi';
import AdaptableCard from '@/components/shared/AdaptableCard';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import DatePicker from '@/components/ui/DatePicker';
import PFSetupTable from './components/PFSetupTable';
import { 
  createPFConfig, 
  updatePFConfig, 
  fetchPFConfigs, 
  clearCurrentPFConfig 
} from '@/store/slices/pfConfig/pfConfigSlice';
import { RootState, AppDispatch } from '@/store';
import { showErrorNotification } from '@/components/ui/ErrorMessage';

// Define types for better type safety
type PaymentMode = 'online' | 'offline';
// type PFFrequency = 'monthly' | 'yearly' | 'half_yearly' | 'quarterly';
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
  // { value: 'yearly', label: 'Yearly' },
  // { value: 'half_yearly', label: 'Half Yearly' },
  // { value: 'quarterly', label: 'Quarterly' },
];

const PFSetup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pfConfigs, loading, error } = useSelector((state: RootState) => state.pfconfig);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPFId, setCurrentPFId] = useState<string | null>(null);
  
  // Separate state for PF and PFIW
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

  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    dispatch(fetchPFConfigs({ page: 1, page_size: 10 }));
  }, [dispatch]);

  const handlePFPaymentModeChange = (option: SelectOption | null) => {
    setSelectedPFPaymentMode(option);
  };

  const handlePFIWPaymentModeChange = (option: SelectOption | null) => {
    setSelectedPFIWPaymentMode(option);
  };

  const handlePFFrequencyChange = (option: SelectOption | null) => {
    setSelectedPFFrequency(option);
  };

  const handlePFIWFrequencyChange = (option: SelectOption | null) => {
    setSelectedPFIWFrequency(option);
  };

  const handlePFDateChange = (dateKey: keyof PaymentDueDates, date: Date | null) => {
    setPFPaymentDueDates(prev => ({
      ...prev,
      [dateKey]: date ? 
        // Use local date string without timezone conversion
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` 
        : null
    }));
  };

  const handlePFIWDateChange = (dateKey: keyof PaymentDueDates, date: Date | null) => {
    setPFIWPaymentDueDates(prev => ({
      ...prev,
      [dateKey]: date ? 
        // Use local date string without timezone conversion
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` 
        : null
    }));
  };

  const handleEdit = (pfToEdit) => {
    setIsEditMode(true);
    setIsDialogOpen(true);
    setCurrentPFId(pfToEdit.id);

    // Set PF Payment Mode
    setSelectedPFPaymentMode({ 
      value: pfToEdit.payment_mode, 
      label: pfToEdit.payment_mode === 'online' ? 'Online' : 'Offline' 
    });

    // Set PFIW Payment Mode (assuming same structure)
    setSelectedPFIWPaymentMode({ 
      value: pfToEdit.pfiw_payment_mode, 
      label: pfToEdit.pfiw_payment_mode === 'online' ? 'Online' : 'Offline' 
    });

    // Set PF Frequency
    setSelectedPFFrequency({ 
      value: pfToEdit.pf_frequency, 
      label: pfToEdit.pf_frequency.charAt(0).toUpperCase() + pfToEdit.pf_frequency.slice(1)
    });

    // Set PFIW Frequency
    setSelectedPFIWFrequency({ 
      value: pfToEdit.pfiw_frequency, 
      label: pfToEdit.pfiw_frequency.charAt(0).toUpperCase() + pfToEdit.pfiw_frequency.slice(1)
    });

    // Set Payment Due Dates
    setPFPaymentDueDates({
      first_date: pfToEdit.pf_payment_due_date.first_date,
      second_date: pfToEdit.pf_payment_due_date.second_date,
      third_date: pfToEdit.pf_payment_due_date.third_date,
      last_date: pfToEdit.pf_payment_due_date.last_date
    });

    setPFIWPaymentDueDates({
      first_date: pfToEdit.pfiw_payment_due_date.first_date,
      second_date: pfToEdit.pfiw_payment_due_date.second_date,
      third_date: pfToEdit.pfiw_payment_due_date.third_date,
      last_date: pfToEdit.pfiw_payment_due_date.last_date
    });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedPFPaymentMode(null);
    setSelectedPFIWPaymentMode(null);
    setSelectedPFFrequency(null);
    setSelectedPFIWFrequency(null);
    setPFPaymentDueDates({
      first_date: null,
      second_date: null,
      third_date: null,
      last_date: null
    });
    setPFIWPaymentDueDates({
      first_date: null,
      second_date: null,
      third_date: null,
      last_date: null
    });
    dispatch(clearCurrentPFConfig());
  };

  const handleConfirm = async () => {
    // Validate all required fields
    if (!selectedPFPaymentMode || !selectedPFIWPaymentMode || 
        !selectedPFFrequency || !selectedPFIWFrequency || 
        !pfPaymentDueDates.first_date || !pfiWPaymentDueDates.first_date) {
      showErrorNotification('Please fill in all required fields');
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
      if (isEditMode && currentPFId) {
        const result = await dispatch(updatePFConfig({ 
          id: currentPFId, 
          data: pfConfigData 
        }))
        .unwrap() 
        .catch((error: any) => {
          console.error('Full error object:', error);
          console.error('Error response:', error.response);
          console.error('Error message:', error.message);
          
          if (error.response?.data?.message) {
            showErrorNotification(error.response.data.message)
          } else if (error.message) {
            showErrorNotification(error.message)
          } else {
            // showErrorNotification('An unexpected error occurred. Please try again.')
            showErrorNotification(error);

          }
          throw error;
        });

        if(result){
          handleDialogClose();
          dispatch(fetchPFConfigs({ page: 1, page_size: 10 }));
          setRefreshCounter(prev => prev + 1); 
        }
      } else {
        const result = await dispatch(createPFConfig(pfConfigData))
        .unwrap() 
        .catch((error: any) => {
          console.error('Full error object:', error);
          console.error('Error response:', error.response);
          console.error('Error message:', error.message);
          
          if (error.response?.data?.message) {
            showErrorNotification(error.response.data.message)
          } else if (error.message) {
            showErrorNotification(error.message)
          } else {
            // showErrorNotification('An unexpected error occurred. Please try again.')
            showErrorNotification(error);

          }
          throw error;
        });
        if(result) {
          handleDialogClose();
          dispatch(fetchPFConfigs({ page: 1, page_size: 10 }));
          setRefreshCounter(prev => prev + 1); 
        }
      }
    } catch (error: any) {
      console.error(error);
      // showErrorNotification(error.message || 'An unexpected error occurred');
    }
  };

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">PF Global Setup</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="solid"
            size="sm"
            icon={<HiPlusCircle />}
            onClick={() => setIsDialogOpen(true)}
          >
            Edit PF Setup
          </Button>
        </div>
      </div>
      
      <PFSetupTable 
        onEdit={handleEdit}
        refreshTrigger={refreshCounter}
      />

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
      >
        <h5 className="mb-6">{isEditMode ? 'Edit PF Setup' : 'Add PF Setup'}</h5>
        <div className="flex flex-col gap-6">
          {/* First Row: Payment Modes */}
          <div className="flex gap-4">
            <div className="w-full">
              <label className="text-gray-600 mb-2 block">PF Payment Mode</label>
              <OutlinedSelect
                label="Select PF Payment Mode"
                options={paymentModeOptions}
                value={selectedPFPaymentMode}
                onChange={handlePFPaymentModeChange}
              />
            </div>
            <div className="w-full">
              <label className="text-gray-600 mb-2 block">PFIW Payment Mode</label>
              <OutlinedSelect
                label="Select PFIW Payment Mode"
                options={paymentModeOptions}
                value={selectedPFIWPaymentMode}
                onChange={handlePFIWPaymentModeChange}
              />
            </div>
          </div>

          {/* Second Row: Frequencies */}
          <div className="flex gap-4">
            <div className="w-full">
              <label className="text-gray-600 mb-2 block">PF Frequency</label>
              <OutlinedSelect
                label="Select PF Frequency"
                options={frequencyOptions}
                value={selectedPFFrequency}
                onChange={handlePFFrequencyChange}
              />
            </div>
            <div className="w-full">
              <label className="text-gray-600 mb-2 block">PFIW Frequency</label>
              <OutlinedSelect
                label="Select PFIW Frequency"
                options={frequencyOptions}
                value={selectedPFIWFrequency}
                onChange={handlePFIWFrequencyChange}
              />
            </div>
          </div>

          {/* Third Row: Due Dates */}
          <div className="flex gap-4">
            <div className="w-full">
              <label className="text-gray-600 mb-2 block">PF Due Date <span className="text-red-500">*</span></label>
              <DatePicker
                className="w-full"
                placeholder="Select PF first due date"
                value={pfPaymentDueDates.first_date ? new Date(pfPaymentDueDates.first_date) : null}
                onChange={(date) => handlePFDateChange('first_date', date)}
              />
            </div>
            <div className="w-full">
              <label className="text-gray-600 mb-2 block">PFIW Due Date <span className="text-red-500">*</span></label>
              <DatePicker
                className="w-full"
                placeholder="Select PFIW first due date"
                value={pfiWPaymentDueDates.first_date ? new Date(pfiWPaymentDueDates.first_date) : null}
                onChange={(date) => handlePFIWDateChange('first_date', date)}
              />
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
            loading={loading}
          >
            {isEditMode ? 'Update' : 'Confirm'}
          </Button>
        </div>
      </Dialog>
    </AdaptableCard>
  );
};

export default PFSetup;