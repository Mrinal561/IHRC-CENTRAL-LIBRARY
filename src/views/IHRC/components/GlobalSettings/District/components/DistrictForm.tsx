import React, { useState } from 'react';
import { DistrictData } from '@/@types/district';
import OutlinedInput from '@/components/ui/OutlinedInput';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import { Button } from '@/components/ui';

interface DistrictFormProps {
  onSubmit: (districtData: DistrictData) => void;
  states: DistrictData[];
}

const DistrictForm: React.FC<DistrictFormProps> = ({ onSubmit, states }) => {
  const [districtData, setDistrictData] = useState<DistrictData>({
    id: '',
    name: '',
    state_id: 0,
  });

  const handleInputChange = (name: string, value: string) => {
    setDistrictData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(districtData);
    setDistrictData({
      id: '',
      name: '',
      state_id: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <OutlinedSelect
          label="State"
          options={states.map((state) => ({ value: state.id, label: state.name }))}
          value={districtData.state_id.toString()}
          onChange={(value) => handleInputChange('state_id', value)}
        />
        <OutlinedInput
          label="District Name"
          value={districtData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
      </div>
      <div className="text-right mt-4">
        <Button type="submit" variant="solid">
          Create District
        </Button>
      </div>
    </form>
  );
};

export default DistrictForm;