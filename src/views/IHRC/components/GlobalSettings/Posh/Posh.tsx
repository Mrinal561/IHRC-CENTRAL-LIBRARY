import { AdaptableCard } from '@/components/shared'
import { Button, Dialog } from '@/components/ui'
import React, { useState } from 'react'
import PoshBulkUpload from './components/PoshBulkUpload'
import { HiPlusCircle } from 'react-icons/hi'
import OutlinedInput from '@/components/ui/OutlinedInput'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'
import PoshTable from './components/PoshTable'


const Posh = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPoshId, setCurrentPoshId] = useState<string | null>(null);
    
    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setIsEditMode(false);
        setCurrentPoshId(null);
    }

    const handleEdit = (id: string) => {
        setCurrentPoshId(id);
        setIsEditMode(true);
        setIsDialogOpen(true);
        // Here you would typically fetch the data for the selected ID
        // and populate the form fields
    }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">POSH Manager</h3>
                </div>
                <div className="flex gap-2">
                    <OutlinedInput 
                    label={'Search by State/District'} 
                    value={''} 
                    onChange={function (value: string): void {
                        throw new Error('Function not implemented.')
                    } }>
                    </OutlinedInput>
                    <PoshBulkUpload />
                    <Button
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                        onClick={() => setIsDialogOpen(true)}
                    >
                        Add
                    </Button>
                </div>
            </div>

            {/* Add the PoshTable component */}
            <PoshTable onEdit={handleEdit} />

            <Dialog
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
                width={800}
            >
                <h5 className="mb-6">
                    {isEditMode ? 'Edit Details' : 'Add Details'}
                </h5>
                <div className='grid grid-cols-1 gap-4'>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-gray-600 mb-2 block">State Name</label>
                            <OutlinedSelect
                                value={''}
                                label={'Select State Name'} 
                                options={undefined} 
                                onChange={undefined} 
                            />
                        </div>
                        <div>
                            <label className="text-gray-600 mb-2 block">District</label>
                            <OutlinedSelect
                                value={''}
                                label={'Select District Name'} 
                                options={undefined} 
                                onChange={undefined}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-gray-600 mb-2 block">Authority Name</label>
                            <OutlinedInput
                                value={''}
                                label={'Enter Authority Name'} 
                                onChange={function (value: string): void {
                                    throw new Error('Function not implemented.')
                                }} 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-gray-600 mb-2 block">Authority Address</label>
                        <OutlinedInput
                            textarea
                            value={''}
                            label={'Enter Authority Address'} 
                            onChange={function (value: string): void {
                                throw new Error('Function not implemented.')
                            }} 
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="plain" onClick={handleDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="solid">
                        {isEditMode ? 'Confirm' : 'Confirm'}
                    </Button>
                </div>
            </Dialog>
        </AdaptableCard>
    )
}

export default Posh