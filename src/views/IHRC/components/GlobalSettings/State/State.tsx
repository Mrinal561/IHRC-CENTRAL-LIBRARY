import React, { useState } from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard';
import { Button, Dialog, Notification, toast } from '@/components/ui';
import { HiPlusCircle } from 'react-icons/hi';
import BulkUpload from './components/BulkUpload';
import StateTable from './components/StateTable';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import DatePicker from '@/components/ui/DatePicker';

interface StateData {
  id: string;
  stateName: string;
  ptEcFrequency: string;
  ptRcFrequency: string;
  ptEcDueDate: Date | null;
  ptRcDueDate: Date | null;
}

const frequencyOptions = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'half-yearly', label: 'Half Yearly' },
  { value: 'monthly', label: 'Monthly' },
];

const initialDummyData: StateData[] = [
  {
    id: '1',
    stateName: 'Gujarat',
    ptEcFrequency: 'yearly',
    ptRcFrequency: 'monthly',
    ptEcDueDate: new Date('2024-09-30'),
    ptRcDueDate: new Date('2024-09-15'),
  },
  {
    id: '2',
    stateName: 'Maharashtra',
    ptEcFrequency: 'yearly',
    ptRcFrequency: 'monthly',
    ptEcDueDate: new Date('2024-06-30'),
    ptRcDueDate: new Date('2024-06-30'),
  },
  {
    id: '3',
    stateName: 'Karnataka',
    ptEcFrequency: 'yearly',
    ptRcFrequency: 'monthly',
    ptEcDueDate: new Date('2024-04-30'),
    ptRcDueDate: new Date('2024-04-20'),
  },
];

const State = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stateData, setStateData] = useState<StateData[]>(initialDummyData);
  const [newStateData, setNewStateData] = useState<Omit<StateData, 'id'>>({
    stateName: '',
    ptEcFrequency: '',
    ptRcFrequency: '',
    ptEcDueDate: null,
    ptRcDueDate: null
  });

  const handleInputChange = (name: string, value: string | Date | null | React.ChangeEvent<HTMLInputElement>) => {
    if (value === null) {
      // Handle null value (e.g., when clearing a date picker)
      setNewStateData(prevState => ({
        ...prevState,
        [name]: null
      }));
    } else if (typeof value === 'object' && 'target' in value) {
      // This is an event object from OutlinedInput
      setNewStateData(prevState => ({
        ...prevState,
        [name]: value.target.value
      }));
    } else {
      // This is a direct value from OutlinedSelect or DatePicker
      setNewStateData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleAssignState = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setNewStateData({
      stateName: '',
      ptEcFrequency: '',
      ptRcFrequency: '',
      ptEcDueDate: null,
      ptRcDueDate: null
    });
  };

  const handleConfirm = () => {
    
    toast.push(
      <Notification title="Success" type="success">
        State assigned successfully!
      </Notification>
    );
    handleDialogClose();
  };

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
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
      
      <StateTable stateData={stateData} setStateData={setStateData} />

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
      >
        <h5 className="mb-4">Assign State</h5>
        <div className="flex flex-col gap-6">
          <div className='flex flex-col gap-3'>
            <label>State Name</label>
            <OutlinedInput 
              label='State'
              value={newStateData.stateName}
              onChange={(e) => handleInputChange('stateName', e)}
            />
          </div>

          <div className='flex gap-3'>
            <div className='flex flex-col gap-3 w-full'>
              <label>Select PT EC Frequency</label>
              <OutlinedSelect 
                label='PT EC Frequency'
                options={frequencyOptions}
                value={newStateData.ptEcFrequency}
                onChange={(value) => handleInputChange('ptEcFrequency', value)}
              />
            </div>
            
            <div className='flex flex-col gap-3 w-full'>
              <label>Select PT RC Frequency</label>
              <OutlinedSelect 
                label='PT RC Frequency'
                options={frequencyOptions}
                value={newStateData.ptRcFrequency}
                onChange={(value) => handleInputChange('ptRcFrequency', value)}
              />
            </div>
          </div>

          <div className='flex gap-3 mb-4'>
            <div className='flex flex-col gap-3 w-full'>
              <label>Choose PT EC Due Date</label>
              <DatePicker 
                size='sm'
                value={newStateData.ptEcDueDate}
                onChange={(date) => handleInputChange('ptEcDueDate', date)}
              />
            </div>
            
            <div className='flex flex-col gap-3 w-full'>
              <label>Choose PT RC Due Date</label>
              <DatePicker 
                size='sm'
                value={newStateData.ptRcDueDate}
                onChange={(date) => handleInputChange('ptRcDueDate', date)}
              />
            </div>
          </div>
        </div>
        <div className="text-right mt-6">
          <Button
            className="mr-2"
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