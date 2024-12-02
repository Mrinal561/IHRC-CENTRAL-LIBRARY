import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog, Notification, toast } from '@/components/ui';
import { HiPlusCircle } from 'react-icons/hi';
import AdaptableCard from '@/components/shared/AdaptableCard';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import DatePicker from '@/components/ui/DatePicker';
import PFSetupTable from './components/PFSetupTable';
import { createPFConfig, updatePFConfig, fetchPFConfigs, PFConfigData } from '@/store/slices/pfConfig/pfConfigSlice';
import { RootState, AppDispatch } from '@/store';
import { showErrorNotification } from '@/components/ui/ErrorMessage'



const paymentModeOptions = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
];

const frequencyOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'half_yearly', label: 'Half Yearly' },
  { value: 'quarterly', label: 'Quarterly' },
];

const initialPFData: PFConfigData = {
  payment_mode: 'online',
  pf_frequency: 'monthly',
  pt_payment_due_date: {
    first_date: '',
    second_date: '',
    third_date: '',
    last_date: '',
  },
};

interface SelectOption {
  value: string;
  label: string;
}

const PFSetup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pfConfigs, loading, error } = useSelector((state: RootState) => state.pfconfig);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPFId, setCurrentPFId] = useState<string | null>(null);
  const [pfData, setPFData] = useState<PFConfigData>(initialPFData);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<SelectOption | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<SelectOption | null>(null);

  const [dateFieldsState, setDateFieldsState] = useState({
    isSecondDateEnabled: false,
    isThirdDateEnabled: false,
    isLastDateEnabled: false
  });

  useEffect(() => {
    dispatch(fetchPFConfigs());
  }, [dispatch]);

  // useEffect(() => {
  //   if (error) {
  //     toast.push(
  //       <Notification title="Error" type="danger">
  //         {error}
  //       </Notification>
  //     );
  //   }
  // }, [error]);

  const handlePaymentModeChange = (option: SelectOption | null) => {
    setSelectedPaymentMode(option);
    if (option) {
      setPFData(prev => ({
        ...prev,
        payment_mode: option.value as 'online' | 'offline'
      }));
    }
  };

  const handleFrequencyChange = (option: SelectOption | null) => {
    setSelectedFrequency(option);
    if (option) {
      const frequencyValue = option.value as PFConfigData['pf_frequency'];
      setPFData(prev => {
        const updated = { ...prev, pf_frequency: frequencyValue };
        
        // Reset date fields based on frequency
        switch (frequencyValue) {
          case 'monthly':
          case 'yearly':
            updated.pt_payment_due_date.second_date = '';
            updated.pt_payment_due_date.third_date = '';
            updated.pt_payment_due_date.last_date = '';
            setDateFieldsState({
              isSecondDateEnabled: false,
              isThirdDateEnabled: false,
              isLastDateEnabled: false
            });
            break;
          case 'half_yearly':
            updated.pt_payment_due_date.second_date = '';
            updated.pt_payment_due_date.third_date = '';
            setDateFieldsState({
              isSecondDateEnabled: false,
              isThirdDateEnabled: false,
              isLastDateEnabled: true
            });
            break;
          case 'quarterly':
            setDateFieldsState({
              isSecondDateEnabled: true,
              isThirdDateEnabled: true,
              isLastDateEnabled: true
            });
            break;
        }
        
        return updated;
      });
    }
  };

  const handleDateChange = (field: keyof PFConfigData['pt_payment_due_date'], date: Date | null) => {
    setPFData(prev => ({
      ...prev,
      pt_payment_due_date: {
        ...prev.pt_payment_due_date,
        [field]: date ? date.toISOString().split('T')[0] : ''
      }
    }));
  };

  const handleEdit = (pfToEdit) => {
    setIsEditMode(true);
    setCurrentPFId(pfToEdit.id);
    setPFData({
      payment_mode: pfToEdit.payment_mode,
      pf_frequency: pfToEdit.pf_frequency,
      pt_payment_due_date: {
        first_date: pfToEdit.pt_payment_due_date.first_date,
        second_date: pfToEdit.pt_payment_due_date.second_date || '',
        third_date: pfToEdit.pt_payment_due_date.third_date || '',
        last_date: pfToEdit.pt_payment_due_date.last_date || '',
      }
    });
    setSelectedPaymentMode({ 
      value: pfToEdit.payment_mode, 
      label: pfToEdit.payment_mode === 'online' ? 'Online' : 'Offline' 
    });
    setSelectedFrequency({ 
      value: pfToEdit.pf_frequency, 
      label: frequencyOptions.find(f => f.value === pfToEdit.pf_frequency)?.label || ''
    });
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentPFId(null);
    setPFData(initialPFData);
    setSelectedPaymentMode(null);
    setSelectedFrequency(null);
  };

  const handleConfirm = async () => {
    try {
      if (isEditMode && currentPFId) {
        // Update existing PF setup
        const result = await dispatch(updatePFConfig({ 
          id: currentPFId, 
          data: pfData 
        }))
        .unwrap()  
        .catch((error: any) => {
          if (error.response?.data?.message) {
              showErrorNotification(error.response.data.message)
          } else if (error.message) {
              showErrorNotification(error.message)
          } else if (Array.isArray(error)) {
              showErrorNotification(error)
          } else {
              showErrorNotification('An unexpected error occurred. Please try again.')
          }
          throw error
      });
        
        // toast.push(
        //   <Notification title="Success" type="success">
        //     PF Setup updated successfully!
        //   </Notification>
        // );
      } else {
        // Create new PF setup
        const result = await dispatch(createPFConfig(pfData))
        .unwrap()
        .catch((error: any) => {
          if (error.response?.data?.message) {
              showErrorNotification(error.response.data.message)
          } else if (error.message) {
              showErrorNotification(error.message)
          } else if (Array.isArray(error)) {
              showErrorNotification(error)
          } else {
              showErrorNotification('An unexpected error occurred. Please try again.')
          }
          throw error
      });
        
        // toast.push(
        //   <Notification title="Success" type="success">
        //     PF Setup created successfully!
        //   </Notification>
        // );
        if(result) {
          handleDialogClose();
        }
      }
    } catch (error) {
      console.error(error)    
    }
  };

  // Helper function to determine if a due date should be disabled
  const isDueDateDisabled = (dateIndex: number) => {
    switch (pfData.pf_frequency) {
      case 'monthly':
      case 'yearly':
        // Only first date is allowed
        return dateIndex > 0;
      case 'half_yearly':
        // First and last dates are allowed
        return dateIndex > 0 && dateIndex < 3;
      case 'quarterly':
        // All dates are allowed
        return false;
      default:
        return true;
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
            Add PF Setup
          </Button>
        </div>
      </div>
      
      <PFSetupTable 
        data={pfConfigs}
        loading={loading}
        onEdit={handleEdit}
      />

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
      >
        <h5 className="mb-6">{isEditMode ? 'Edit PF Setup' : 'Add PF Setup'}</h5>
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="w-full">
              <label className="text-gray-600 mb-2 block">Payment Mode</label>
              <OutlinedSelect
                label="Select Payment Mode"
                options={paymentModeOptions}
                value={selectedPaymentMode}
                onChange={handlePaymentModeChange}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <label className="text-gray-600 mb-2 block">PF Frequency</label>
              <OutlinedSelect
                label="Select PF Frequency"
                options={frequencyOptions}
                value={selectedFrequency}
                onChange={handleFrequencyChange}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">First Due Date <span className="text-red-500">*</span></label>
              <DatePicker
                className="w-full"
                placeholder="Select first due date"
                value={pfData.pt_payment_due_date.first_date ? new Date(pfData.pt_payment_due_date.first_date) : null}
                onChange={(date) => handleDateChange('first_date', date)}
              />
            </div>
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">Second Due Date</label>
              <DatePicker
                className="w-full"
                placeholder="Select second due date"
                value={pfData.pt_payment_due_date.second_date ? new Date(pfData.pt_payment_due_date.second_date) : null}
                onChange={(date) => handleDateChange('second_date', date)}
                disabled={isDueDateDisabled(1)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">Third Due Date</label>
              <DatePicker
                className="w-full"
                placeholder="Select third due date"
                value={pfData.pt_payment_due_date.third_date ? new Date(pfData.pt_payment_due_date.third_date) : null}
                onChange={(date) => handleDateChange('third_date', date)}
                disabled={isDueDateDisabled(2)}
              />
            </div>
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">Fourth Due Date</label>
              <DatePicker
                className="w-full"
                placeholder="Select fourth due date"
                value={pfData.pt_payment_due_date.last_date ? new Date(pfData.pt_payment_due_date.last_date) : null}
                onChange={(date) => handleDateChange('last_date', date)}
                disabled={isDueDateDisabled(3)}
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
            disabled={loading}
          >
            {isEditMode ? 'Update' : 'Confirm'}
          </Button>
        </div>
      </Dialog>
    </AdaptableCard>
  );
};

export default PFSetup;