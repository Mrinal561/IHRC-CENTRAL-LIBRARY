import { AdaptableCard } from '@/components/shared'
import { Button } from '@/components/ui'
import OutlinedInput from '@/components/ui/OutlinedInput'
import React from 'react'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import BulkUploadCompliance from './components/BulkUploadCompliance'
import AuditTrackerTable from './components/AuditTrackerTable'

const AuditTracker = () => {
  const navigate = useNavigate()
  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">Audit Tracker</h3>
                </div>
                <div className="flex gap-2 items-center">
                    <OutlinedInput
                      label="Search By State" value={''} onChange={function (value: string): void {
                        throw new Error('Function not implemented.')
                      } }                        // value={"searchTerm"}
                        // onChange={(e) => handleSearch(e)}
                    />
                    <Button variant='solid' size='sm' icon={<HiDownload />}>Download Data</Button>
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
                <div>
                  <AuditTrackerTable />
                </div>
    </AdaptableCard>
  )
}

export default AuditTracker