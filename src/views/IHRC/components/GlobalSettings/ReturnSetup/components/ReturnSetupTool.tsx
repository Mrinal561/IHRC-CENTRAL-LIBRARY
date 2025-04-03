import React from 'react'
import ReturnBulkUpload from './ReturnBulkUpload'
import { Button } from '@/components/ui'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

const ReturnSetupTool = () => {
    const navigate = useNavigate();

    const handleAddReturnSetup = () => {
        navigate('/add-return-setup')
    }
  return (
    <div className='flex gap-2 items-center w-full'>
              <Button variant='solid' icon={<HiDownload />} size='sm' >Download</Button>

        <div>
            <ReturnBulkUpload />
        </div>
        <Button variant='solid' icon={<HiPlusCircle />} size='sm' onClick={handleAddReturnSetup}>Add Return Setup</Button>
    </div>
  )
}

export default ReturnSetupTool