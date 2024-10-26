
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Dialog, Notification, toast } from '@/components/ui';
import { HiPlusCircle } from 'react-icons/hi';
import AdaptableCard from '@/components/shared/AdaptableCard';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import DatePicker from '@/components/ui/DatePicker';
import BulkUpload from './components/BulkUpload';
import StateTable from './components/StateTable';
import { 
  fetchStates, 
  createState, 
  updateState, 
  deleteState,
  clearError  } from '@/store/slices/state/stateSlice';
import { AppDispatch, RootState } from '@/store';
import { transformStatePayload } from '@/@types/stateTransformer';

const frequencyOptions = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'half_yearly', label: 'Half Yearly' },
  { value: 'monthly', label: 'Monthly' },
];

const paymentOptions = [
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'Offline' },
];

const State = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { states, loading, error } = useSelector((state: RootState) => state.state);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStateData, setNewStateData] = useState({
    name: '',
    ptec_frequency: '',
    ptrc_frequency: '',
    lwf_frequency: '',
    paymentFrequency: '',
    ptEcFirstDueDate: null,
    ptEcLastDueDate: null,
    ptRcFirstDueDate: null,
    ptRcLastDueDate: null,
    lwfFirstDueDate: null,
    lwfLastDueDate: null,
  });

  useEffect(() => {
    dispatch(fetchStates());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.push(
        <Notification title="Error" type="danger">
          {error}
        </Notification>
      );
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleInputChange = (name: string, value: string | Date | null | React.ChangeEvent<HTMLInputElement>) => {
    if (value === null) {
      setNewStateData(prev => ({ ...prev, [name]: null }));
    } else if (typeof value === 'object' && 'target' in value) {
      setNewStateData(prev => ({ ...prev, [name]: value.target.value }));
    } else {
      setNewStateData(prev => {
        const updated = { ...prev, [name]: value };
        if (name.includes('Frequency')) {
          const lastDueDateField = name.replace('Frequency', 'LastDueDate');
          if (value === 'yearly' || value === 'monthly') {
            updated[lastDueDateField] = null;
          }
        }
        return updated;
      });
    }
  };

  const isDatePickerDisabled = (type: 'first' | 'last', frequency: string) => {
    if (type === 'first') {
      return false; // First due date is always enabled
    } else {
      // Last due date is only enabled for half-yearly frequency
      return frequency !== 'half-yearly';
    }
  };

  const handleConfirm = async () => {
    try {
      console.log("creating the state")
      const transformedData = transformStatePayload(newStateData);
      await dispatch(createState(transformedData)).unwrap();
      toast.push(
        <Notification title="Success" type="success">
          State assigned successfully!
        </Notification>
      );
      handleDialogClose();
    } catch (error) {
      // Error handling is done in the useEffect above
    }
  };

  const FrequencyRow = ({ 
    title,
    frequencyName,
    firstDateName,
    lastDateName,
    frequency,
  }: { 
    title: string;
    frequencyName: string;
    firstDateName: string;
    lastDateName: string;
    frequency: string;
  }) => (
    <div className="flex gap-4">
      <div className="w-1/3">
        <label className="text-gray-600 mb-2 block">{title}</label>
        <OutlinedSelect
          label="Frequency"
          options={frequencyOptions}
          value={frequency}
          onChange={(value) => handleInputChange(frequencyName, value)}
        />
      </div>
      <div className="w-1/3">
        <label className="text-gray-600 mb-2 block">First Due Date</label>
        <DatePicker
          className="w-full"
          placeholder="Select date"
          value={newStateData[firstDateName as keyof typeof newStateData] as Date | null}
          onChange={(date) => handleInputChange(firstDateName, date)}
          // disabled={isDatePickerDisabled('first', frequency)}
        />
      </div>
      <div className="w-1/3">
        <label className="text-gray-600 mb-2 block">Last Due Date</label>
        <DatePicker
          className="w-full"
          placeholder="Select date"
          value={newStateData[lastDateName as keyof typeof newStateData] as Date | null}
          onChange={(date) => handleInputChange(lastDateName, date)}
          // disabled={isDatePickerDisabled('last', frequency)}
        />
      </div>
    </div>
  );

  const handleAssignState = () => setIsDialogOpen(true);
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setNewStateData({
      name: '',
      ptec_frequency: '',
      ptrc_frequency: '',
      lwf_frequency: '',
      paymentFrequency: '',
      ptEcFirstDueDate: null,
      ptEcLastDueDate: null,
      ptRcFirstDueDate: null,
      ptRcLastDueDate: null,
      lwfFirstDueDate: null,
      lwfLastDueDate: null,
    });
  };

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">State Manager</h3>
        </div>
        <div className="flex gap-2">
          <BulkUpload />
          <Button
            variant="solid"
            size="sm"
            icon={<HiPlusCircle />}
            onClick={handleAssignState}
          >
            Add State
          </Button>
        </div>
      </div>
      
      <StateTable 
        stateData={states} 
        loading={loading}
        onUpdate={(id, data) => dispatch(updateState({ id, data }))}
        onDelete={(id) => dispatch(deleteState(id))}
      />
      <Dialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
      >
        <h5 className="mb-6">Assign State</h5>
        <div className="flex flex-col gap-6">
          {/* First Row: State and Payment Mode */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">State Name</label>
              <OutlinedInput 
                label="Enter state name"
                value={newStateData.name}
                onChange={(e) => handleInputChange('name', e)}
              />
            </div>
            <div className="w-1/2">
              <label className="text-gray-600 mb-2 block">Payment Mode</label>
              <OutlinedSelect
                label="Select payment mode"
                options={paymentOptions}
                value={newStateData.paymentFrequency}
                onChange={(value) => handleInputChange('paymentFrequency', value)}
              />
            </div>
          </div>

          {/* PT EC Row */}
          <FrequencyRow
            title="PT EC Frequency"
            frequencyName="ptec_frequency"
            firstDateName="ptEcFirstDueDate"
            lastDateName="ptEcLastDueDate"
            frequency={newStateData.ptec_frequency}
          />

          {/* PT RC Row */}
          <FrequencyRow
            title="PT RC Frequency"
            frequencyName="ptrc_frequency"
            firstDateName="ptRcFirstDueDate"
            lastDateName="ptRcLastDueDate"
            frequency={newStateData.ptrc_frequency}
          />

          {/* LWF Row */}
          <FrequencyRow
            title="LWF Frequency"
            frequencyName="lwf_frequency"
            firstDateName="lwfFirstDueDate"
            lastDateName="lwfLastDueDate"
            frequency={newStateData.lwf_frequency}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="plain"
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button variant="solid" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </Dialog>
    </AdaptableCard>
  );
};

export default State;

