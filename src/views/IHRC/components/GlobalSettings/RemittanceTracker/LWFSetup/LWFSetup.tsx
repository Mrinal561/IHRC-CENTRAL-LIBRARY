import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog, Notification, toast } from '@/components/ui';
import { HiPlusCircle } from 'react-icons/hi';
import AdaptableCard from '@/components/shared/AdaptableCard';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import DatePicker from '@/components/ui/DatePicker';
import Checkbox from '@/components/ui/Checkbox';
import BulkUpload from './components/BulkUpload';
import { AppDispatch, RootState } from '@/store';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { showErrorNotification } from '@/components/ui/ErrorMessage';
import { clearCurrentLWFConfig, createLWFConfig, fetchLWFConfigs, updateLWFConfig } from '@/store/slices/lwfConfig/lwfConfigSlice';
import LWFTable from './components/LWFTable';

const frequencyOptions = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'half_yearly', label: 'Half Yearly' },
  { value: 'quarterly', label: 'Quarterly' },
];

interface SelectOption {
  value: string;
  label: string;
}
const LWFSetup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { lwfConfigs, loading, error, currentLWFConfig } = useSelector((state: RootState) => state.lwfconfig);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [states, setStates] = useState<SelectOption[]>([]);
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
  const [frequency, setFrequency] = useState<string>('');
  const [isActive, setIsActive] = useState(false);

  const [paymentDueDates, setPaymentDueDates] = useState({
    firstDate: null,
    secondDate: null,
    thirdDate: null,
    lastDate: null
  });

  const [dateFieldsState, setDateFieldsState] = useState({
    isSecondDateEnabled: false,
    isThirdDateEnabled: false,
    isLastDateEnabled: false
  });

  useEffect(() => {
    loadStates();
    dispatch(fetchLWFConfigs({ page: 1, page_size: 10 }));
  }, [dispatch]);



const loadStates = async () => {
    try {
      const response = await httpClient.get(endpoints.common.getStatesAll());
      
      if (response.data) {
        const formattedStates = response.data.map((state: any) => ({
          label: state.name,
          value: String(state.id)
        }));
        
        setStates(formattedStates);
      }
    } catch (error) {
      console.error('Failed to load states:', error);
      toast.push(
        <Notification title="Error" type="danger">
          Failed to load states
        </Notification>
      );
    }
  };


  const handleFrequencyChange = (selectedFrequency: any) => {
    const frequencyValue = selectedFrequency?.value || '';
    setFrequency(frequencyValue);
    
    // Reset date fields based on frequency
    switch (frequencyValue) {
      case 'monthly':
      case 'yearly':
        setPaymentDueDates({
          firstDate: null,
          secondDate: null,
          thirdDate: null,
          lastDate: null
        });
        setDateFieldsState({
          isSecondDateEnabled: false,
          isThirdDateEnabled: false,
          isLastDateEnabled: false
        });
        break;
      case 'half_yearly':
        setPaymentDueDates(prev => ({
          ...prev,
          secondDate: null,
          thirdDate: null
        }));
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
  };

  const isDueDateDisabled = (dateIndex: number) => {
    switch (frequency) {
      case 'monthly':
      case 'yearly':
        return dateIndex > 0;
      case 'half_yearly':
        return dateIndex > 0 && dateIndex < 3;
      case 'quarterly':
        return false;
      default:
        return true;
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedState(null);
    setFrequency('');
    setIsActive(false);
    setPaymentDueDates({
      firstDate: null,
      secondDate: null,
      thirdDate: null,
      lastDate: null
    });
    dispatch(clearCurrentLWFConfig());
  };


  const handleConfirm = async () => {


    if (!selectedState || !frequency || !paymentDueDates.firstDate) {
      toast.push(
        <Notification title="Error" type="danger">
          Please fill all required fields
        </Notification>
      );
      return;
    }

    const lwfConfigData = {
      frequency: frequency as 'monthly' | 'half_yearly' | 'yearly' | 'quarterly',
      lwf_payment_due_date: {
        first_date: paymentDueDates.firstDate,
        second_date: paymentDueDates.secondDate,
        third_date: paymentDueDates.thirdDate,
        last_date: paymentDueDates.lastDate
      },
      payment_mode: 'online', // Default value, can be made configurable
      active: isActive,
      state_id: selectedState.value
    };



    try {
      if (isEditMode && currentLWFConfig?.id) {
        const result = await dispatch(updateLWFConfig({ 
          id: currentLWFConfig.id, 
          data: lwfConfigData 
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
            showErrorNotification('An unexpected error occurred. Please try again.')
          }
          throw error;
        });
        
      } else {
        const result = await dispatch(createLWFConfig(lwfConfigData))
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
            showErrorNotification('An unexpected error occurred. Please try again.')
          }
          throw error;
        });
        
        // toast.push(
        //   <Notification title="Success" type="success">
        //     ESI Configuration created successfully
        //   </Notification>
        // );
        if(result) {
          handleDialogClose();
          dispatch(fetchLWFConfigs({ page: 1, page_size: 10 }));
        }
      }
      
    } catch (error: any) {
     console.log(error);
     
    }
  };



  
  // const handleEdit = (pfToEdit) => {
  //   setIsEditMode(true);
  //   setCurrentPFId(pfToEdit.id);
  //   setPFData({
  //     name: pfToEdit.name,
  //     frequency: pfToEdit.frequency,
  //     firstDueDate: pfToEdit.firstDueDate,
  //     secondDueDate: pfToEdit.secondDueDate,
  //     thirdDueDate: pfToEdit.thirdDueDate,
  //     fourthDueDate: pfToEdit.fourthDueDate,
  //   });
  //   setIsDialogOpen(true);
  // };

  const handleEdit = (config) => {
    setIsEditMode(true);
    setIsDialogOpen(true);
    
    // Set state from the selected configuration
    const selectedStateObj = states.find(state => state.value === config.state_id);
    setSelectedState(selectedStateObj || null);
    setFrequency(config.frequency);
    setIsActive(config.active);
    
    setPaymentDueDates({
      firstDate: config.lwf_payment_due_date.first_date,
      secondDate: config.lwf_payment_due_date.second_date,
      thirdDate: config.lwf_payment_due_date.third_date,
      lastDate: config.lwf_payment_due_date.last_date
    });
    
    // Update date fields state based on frequency
    switch (config.frequency) {
      case 'monthly':
      case 'yearly':
        setDateFieldsState({
          isSecondDateEnabled: false,
          isThirdDateEnabled: false,
          isLastDateEnabled: false
        });
        break;
      case 'half_yearly':
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
  };


  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">LWF Global Setup</h3>
        </div>
        <div className="flex gap-2">
          {/* <BulkUpload /> */}
          <Button
            variant="solid"
            size="sm"
            icon={<HiPlusCircle />}
            onClick={() => setIsDialogOpen(true)}
          >
            Add LWF Setup
          </Button>
        </div>
      </div>
      
      <LWFTable 
        // Add necessary props
        onEdit={handleEdit}
      />

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
      >
        <h5 className="mb-6">{isEditMode ? 'Edit LWF Setup' : 'Add LWF Setup'}</h5>
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="w-full">
              <label className="text-gray-600 mb-2 block">State</label>
              <OutlinedSelect
                        label="Select State"
                        options={states}
                        value={selectedState}
                        onChange={setSelectedState}
                      
                        />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <label className="text-gray-600 mb-2 block">LWF Frequency</label>
              <OutlinedSelect
                label="Select LWF Frequency"
                options={frequencyOptions}
                value={frequencyOptions.find(option => option.value === frequency) || null}
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
                value={paymentDueDates.firstDate}
                onChange={(date) => setPaymentDueDates(prev => ({ ...prev, firstDate: date }))}
              />
            </div>
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">Second Due Date</label>
              <DatePicker
                className="w-full"
                placeholder="Select second due date"
                value={paymentDueDates.secondDate}
                onChange={(date) => setPaymentDueDates(prev => ({ ...prev, secondDate: date }))}
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
                value={paymentDueDates.thirdDate}
                onChange={(date) => setPaymentDueDates(prev => ({ ...prev, thirdDate: date }))}
                disabled={isDueDateDisabled(2)}
              />
            </div>
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">Last Due Date</label>
              <DatePicker
                className="w-full"
                placeholder="Select last due date"
                value={paymentDueDates.lastDate}
                onChange={(date) => setPaymentDueDates(prev => ({ ...prev, lastDate: date }))}
                disabled={isDueDateDisabled(3)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isActive}
              onChange={(checked) => setIsActive(checked)}
            />
            <label className="text-gray-600">
              Is LWF applicable for Selected State
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="plain"
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={handleConfirm}  loading={loading}>
            {isEditMode ? 'Update' : 'Confirm'}
          </Button>
        </div>
      </Dialog>
    </AdaptableCard>
  );
};

export default LWFSetup;