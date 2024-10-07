import React, { useState } from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard';
import { Button, Dialog, Notification, toast } from '@/components/ui';
import { HiPlusCircle } from 'react-icons/hi';
import BulkUpload from './components/BulkUpload';
import DistrictTable from './components/DistrictTable';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';

interface DistrictData {
  id: string;
  stateName: string;
  districtName: string;
}

const stateOptions = [
  { value: 'gujarat', label: 'Gujarat' },
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'karnataka', label: 'Karnataka' },
];

const initialDummyData: DistrictData[] = [
  { id: '1', stateName: 'Gujarat', districtName: 'Ahmedabad' },
  { id: '2', stateName: 'Maharashtra', districtName: 'Mumbai' },
  { id: '3', stateName: 'Karnataka', districtName: 'Bangalore' },
];

const District = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [districtData, setDistrictData] = useState<DistrictData[]>(initialDummyData);
  const [newDistrictData, setNewDistrictData] = useState<Omit<DistrictData, 'id'>>({
    stateName: '',
    districtName: '',
  });

  const handleInputChange = (name: string, value: string | React.ChangeEvent<HTMLInputElement>) => {
    if (typeof value === 'object' && 'target' in value) {
      // This is an event object from OutlinedInput
      setNewDistrictData(prevState => ({
        ...prevState,
        [name]: value.target.value
      }));
    } else {
      // This is a direct value from OutlinedSelect
      setNewDistrictData(prevState => ({
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
    setNewDistrictData({
      stateName: '',
      districtName: '',
    });
  };

  const handleConfirm = () => {
   
    toast.push(
      <Notification title="Success" type="success">
        District assigned successfully!
      </Notification>
    );
    handleDialogClose();
  };

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">District Manager</h3>
        </div>
        <div className="flex gap-2">
          <BulkUpload />
          <Button
            variant="solid"
            size="sm"
            icon={<HiPlusCircle />}
            onClick={handleAssignState}
          >
            Add District
          </Button>
        </div>
      </div>
      
      <DistrictTable districtData={districtData} setDistrictData={setDistrictData} />

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
      >
        <h5 className="mb-4">Add District</h5>
        <div className="flex flex-col gap-6">
          <div className='flex flex-col gap-3'>
            <label>Select State</label>
            <OutlinedSelect 
              label='State'
              options={stateOptions}
              value={newDistrictData.stateName}
              onChange={(value) => handleInputChange('stateName', value)}
            />
          </div>
          <div className='flex flex-col gap-3'>
            <label>Enter District</label>
            <OutlinedInput 
              label='District'
              value={newDistrictData.districtName}
              onChange={(e) => handleInputChange('districtName', e)}
            />
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

export default District;