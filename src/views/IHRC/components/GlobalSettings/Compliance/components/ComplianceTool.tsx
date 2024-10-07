import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import { Button } from '@/components/ui'
import BulkUpload from './BulkUpload';


const ComplianceTool = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/add-compliance-form'); // Adjust the path as needed
    };
    return (
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <BulkUpload />
            <div className="block lg:inline-block md:mb-0 mb-4 ml-2">
            <Button
            block
            variant="solid"
            size="sm"
            icon={<HiPlusCircle />}
            onClick={handleClick}
        >
           Add Compliance
        </Button>
            </div>
        </div>
    )
}

export default ComplianceTool
