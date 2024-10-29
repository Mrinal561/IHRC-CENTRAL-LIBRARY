
import React, { useState, useEffect } from 'react';
import AdaptableCard from '@/components/shared/AdaptableCard';
import { Button, Dialog, Notification, toast } from '@/components/ui';
import { HiPlusCircle } from 'react-icons/hi';
import BulkUpload from './components/BulkUpload';
import DistrictTable from './components/DistrictTable';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import { useAppDispatch } from '@/store';
import { fetchAll } from '@/store/slices/common/commonSlice';
import { createDistrict, fetchDistricts } from '@/store/slices/district/districtSlice';
import { DistrictData } from '@/@types/district';

interface SelectOption {
  value: string;
  label: string;
}

interface NewDistrict {
  name: string;
  state_id: number;
}

const District = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [districtData, setDistrictData] = useState<DistrictData[]>([]);
  const [states, setStates] = useState([]);
  const [tableKey, setTableKey] = useState(0);
  const [districtName, setDistrictName] = useState('');
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
  const [newDistrictData, setNewDistrictData] = useState<NewDistrict>({
    name: '',
    state_id: 0
  });

  useEffect(() => {
    setNewDistrictData(prev => ({
      ...prev,
      name: districtName,
      state_id: selectedState?.value ? parseInt(selectedState.value) : 0
    }));
  }, [districtName, selectedState]);

  const loadStates = async () => {
    try {
      const { payload: data }: any = await dispatch(fetchAll());
      setStates(data.map((state: any) => ({
        value: String(state.id),
        label: state.name
      })));
    } catch (error) {
      console.error('Failed to load states:', error);
      toast.push(
        <Notification title="Error" type="danger">
          Failed to load states
        </Notification>
      );
    }
  };

  const fetchDistrictData = async (page = 1, pageSize = 10) => {
    setIsLoading(true);
    try {
      const { payload: data }: any = await dispatch(fetchDistricts({
        page,
        page_size: pageSize
      }));
      
      if (data && data.data) {
        setDistrictData(data.data.map((district: any) => ({
          ...district,
          state_name: district?.State?.name
        })));
      }
    } catch (error) {
      console.error('Failed to fetch districts:', error);
      toast.push(
        <Notification title="Error" type="danger">
          Failed to fetch districts
        </Notification>
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStates();
    fetchDistrictData();
  }, []);

  const handleDataChange = async () => {
    setTableKey(prevKey => prevKey + 1);
    await fetchDistrictData(1, 10); // Reset to first page with default page size
  };

  const handleConfirm = async () => {
    if (!newDistrictData.name.trim() || !newDistrictData.state_id) {
      toast.push(
        <Notification title="Error" type="danger">
          Please fill in all required fields
        </Notification>
      );
      return;
    }

    setDialogLoading(true);
    try {
      await dispatch(createDistrict(newDistrictData)).unwrap();
      toast.push(
        <Notification title="Success" type="success">
          District added successfully
        </Notification>
      );
      handleDialogClose();
      await handleDataChange(); // Wait for the table to refresh
    } catch (error) {
      console.error(error);
      toast.push(
        <Notification title="Failed" type="danger">
          Failed to add district
        </Notification>
      );
    } finally {
      setDialogLoading(false);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setDistrictName('');
    setSelectedState(null);
    setNewDistrictData({
      name: '',
      state_id: 0
    });
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
            onClick={() => setIsDialogOpen(true)}
          >
            Add District
          </Button>
        </div>
      </div>
      
      <DistrictTable 
        key={tableKey}
        districtData={districtData} 
        isLoading={isLoading}
        onDataChange={handleDataChange}
      />

      <Dialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
      >
        <h5 className="mb-4">Add District</h5>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label>Select State</label>
            <OutlinedSelect 
              label="State"
              options={states}
              value={selectedState}
              onChange={setSelectedState}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label>Enter District</label>
            <OutlinedInput 
              label="District Name"
              value={districtName}
              onChange={(value: string) => setDistrictName(value)}
            />
          </div>
        </div>
        <div className="text-right mt-6">
          <Button
            className="mr-2"
            variant="plain"
            onClick={handleDialogClose}
            disabled={dialogLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="solid" 
            onClick={handleConfirm}
            loading={dialogLoading}
          >
            {dialogLoading ? 'Adding...' : 'Confirm'}
          </Button>
        </div>
      </Dialog>
    </AdaptableCard>
  );
};

export default District;