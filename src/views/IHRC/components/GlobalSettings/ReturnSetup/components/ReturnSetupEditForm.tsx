import { Button } from '@/components/ui'
import { Formik } from 'formik'
import React, { useState } from 'react'
import { IoArrowBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import ActNameAutoSuggest from './ActNameAutoSuggest'
import OutlinedInput from '@/components/ui/OutlinedInput'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'
import DatePicker from '@/components/ui/DatePicker/DatePicker'



const ReturnSetupEditForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Updated dummy state data with Central as first option and state names in alphabetical order
  const dummyStateData = [
    { value: "central", label: "Central" },
    { value: "andhra_pradesh", label: "Andhra Pradesh" },
    { value: "arunachal_pradesh", label: "Arunachal Pradesh" },
    { value: "assam", label: "Assam" },
    { value: "bihar", label: "Bihar" },
    { value: "chhattisgarh", label: "Chhattisgarh" },
    { value: "goa", label: "Goa" },
    { value: "gujarat", label: "Gujarat" },
    { value: "haryana", label: "Haryana" },
    { value: "himachal_pradesh", label: "Himachal Pradesh" },
    { value: "jharkhand", label: "Jharkhand" },
    { value: "karnataka", label: "Karnataka" },
    { value: "kerala", label: "Kerala" },
    { value: "madhya_pradesh", label: "Madhya Pradesh" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "manipur", label: "Manipur" },
    { value: "meghalaya", label: "Meghalaya" },
    { value: "mizoram", label: "Mizoram" },
    { value: "nagaland", label: "Nagaland" },
    { value: "odisha", label: "Odisha" },
    { value: "punjab", label: "Punjab" },
    { value: "rajasthan", label: "Rajasthan" },
    { value: "sikkim", label: "Sikkim" },
    { value: "tamil_nadu", label: "Tamil Nadu" },
    { value: "telangana", label: "Telangana" },
    { value: "tripura", label: "Tripura" },
    { value: "uttar_pradesh", label: "Uttar Pradesh" },
    { value: "uttarakhand", label: "Uttarakhand" },
    { value: "west_bengal", label: "West Bengal" }
  ];

  // Dummy data for other dropdowns
  const frequencyOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "half_yearly", label: "Half Yearly" },
    { value: "yearly", label: "Yearly" },     
    { value: "bi_annual_return", label: "Bi Annual Return" },     
  ];

  const applicabilityOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
   
  ];

  const applicableAtOptions = [
    { value: "branch", label: "Branch" },
    { value: "state", label: "State" },
    { value: "central", label: "Central" },
    { value: "corporate", label: "Corporate" },
  ];

  // State management for form values
  const [selectedState, setSelectedState] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [selectedApplicability, setSelectedApplicability] = useState('');
  const [selectedApplicableAt, setSelectedApplicableAt] = useState('');

  return (
    <div className='bg-white p-2 rounded-lg'>
        <div className="flex gap-2 items-center mb-6">
          <Button
            size="sm"
            variant="plain"
            icon={<IoArrowBack className="text-gray-500 hover:text-gray-700" />}
            onClick={() => navigate(-1)}
          />
          <h3 className="text-2xl font-semibold">Edit Return Setup</h3>
        </div>

        <div>
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <ActNameAutoSuggest />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="returnName">Return Name <span className="text-red-500">*</span></label>
                      <OutlinedInput
                        label="Enter Return Name" 
                        value={''} 
                        onChange={(value) => console.log(value)}
                      />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="state">State <span className="text-red-500">*</span></label>
                        <OutlinedSelect 
                label='Select State'
                options={dummyStateData} 
                value={undefined} 
                onChange={undefined}                          
                        />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="returnApplicability">Return Applicability<span className="text-red-500">*</span></label>
                      <OutlinedSelect 
                        label='Select Return Applicability' 
                        options={applicabilityOptions} 
                        value={undefined} 
                onChange={undefined}
                      />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="returnApplicableAt">Return Applicable At<span className="text-red-500">*</span></label>
                        <OutlinedSelect 
                          label='Select Return Applicable At' 
                          options={applicableAtOptions} 
                          value={undefined} 
                onChange={undefined}
                        />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="frequency">Frequency<span className="text-red-500">*</span></label>
                      <OutlinedSelect 
                        label='Select Frequency' 
                        options={frequencyOptions} 
                        value={undefined} 
                onChange={undefined}
                      />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="firstDate">First Due Date<span className="text-red-500">*</span></label>
                        <DatePicker 
                          placeholder='Select First Due Date' 
                          value={undefined} 
                onChange={undefined}
                        />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="secondDueDate">Second Due Date<span className="text-red-500">*</span></label>
                      <DatePicker 
                        placeholder='Select Second Due Date' 
                        value={undefined} 
                        onChange={(value) => console.log(value)} 
                      />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="thirdDate">Third Due Date<span className="text-red-500">*</span></label>
                        <DatePicker 
                          placeholder='Select Third Due Date' 
                          value={undefined} 
                          onChange={(value) => console.log(value)} 
                        />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lastDueDate">Last Due Date<span className="text-red-500">*</span></label>
                      <DatePicker 
                        placeholder='Select Last Due Date' 
                        value={undefined} 
                        onChange={(value) => console.log(value)}  
                      />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="biAnnualDate">Bi Annual Due Date<span className="text-red-500">*</span></label>
                        <DatePicker 
                          placeholder='Select Bi Annual Due Date' 
                          value={undefined} 
                          onChange={(value) => console.log(value)} 
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-8">
                  <Button
                    type="button"
                    variant="plain"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant='solid'
                    loading={loading}
                  >
                    Confirm
                  </Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ReturnSetupEditForm