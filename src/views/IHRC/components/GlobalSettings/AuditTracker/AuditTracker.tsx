import { AdaptableCard } from '@/components/shared'
import { Button } from '@/components/ui'
import OutlinedInput from '@/components/ui/OutlinedInput'
import React, { useState } from 'react'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import BulkUploadCompliance from './components/BulkUploadCompliance'
import AuditTrackerTable from './components/AuditTrackerTable'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'

interface CountryOption {
  value: string
  label: string
}

const AuditTracker = () => {
  const navigate = useNavigate()
  const [selectedCountry, setSelectedCountry] = useState<string>('INDIA') 
  const [searchTerm, setSearchTerm] = useState<string>('')

  const countryOptions: CountryOption[] = [
    { value: 'INDIA', label: 'India' },
    { value: 'USA', label: 'USA' },
    { value: 'UK', label: 'UK' },
  ]

  // Find the initially selected country object
  const selectedCountryOption = countryOptions.find(option => option.value === selectedCountry) || countryOptions[0]

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">Audit Setup</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center w-full md:w-auto">
          <div className="w-full md:w-48">
            <OutlinedSelect 
              label="Select Country"
              options={countryOptions}
              value={selectedCountryOption} 
              onChange={(option) => setSelectedCountry(option?.value || 'INDIA')}
            />
          </div>
          <div className="w-full md:w-48">
            <OutlinedInput
              label="Search By State" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant='solid' size='sm' icon={<HiDownload />}>
              Download Data
            </Button>
            <BulkUploadCompliance companyId={undefined} />
            <Button
              variant="solid"
              size="sm"
              icon={<HiPlusCircle />}
              onClick={() => navigate('/add-compliance')}
            >
              Add Compliance
            </Button>
          </div>
        </div>
      </div>
      <div className="relative z-10">
        <AuditTrackerTable />
      </div>
    </AdaptableCard>
  )
}

export default AuditTracker