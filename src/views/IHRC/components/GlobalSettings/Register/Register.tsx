import { AdaptableCard } from '@/components/shared'
import { Button, Dialog, Input } from '@/components/ui'
import React, { useState } from 'react'
import RegisterTable from './components/RegisterTable';
import { HiPlusCircle } from 'react-icons/hi';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import OutlinedInput from '@/components/ui/OutlinedInput';

const Register = () => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const centralOption = [
        { value: 'central', label: 'Central' },
        { value: 'delhi', label: 'Delhi' },
        { value: 'gujarat', label: 'Gujarat' },
        { value: 'jharkhand', label: 'Jharkhand' },
    ]

    const frequency = [
        { value: 'yearly', label: 'Yearly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'quarterly', label: 'Quarterly' },
        { value: 'half_yearly', label: 'Half Yearly' },
    ]

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">Register</h3>
                </div>
                <div className='flex items-center gap-2'>
                    <OutlinedInput 
                      label={'Search by State/Central/Act'} value={''} onChange={function (value: string): void {
                          throw new Error('Function not implemented.');
                      } }                   />
                    <Button size='sm' variant='solid' onClick={() => setIsDialogOpen(true)}  icon={<HiPlusCircle />}>Add Register</Button>
                </div>
      </div>
      <div className='mb-8'>
        <RegisterTable />
      </div>

      <Dialog  isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onRequestClose={() => setIsDialogOpen(false)}
                width={800}>
        <div className="">
        <h5 className="mb-6">Add Register</h5>
            <div className='flex flex-col gap-4'>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium mb-2">Select Central/State</label>
                        <OutlinedSelect 
                        label={"Select Central/State"} 
                        options={centralOption}
                        value={undefined} 
                        onChange={undefined} />
                    </div>

                    <div>
                    <label className="block text-sm font-medium mb-2">Form No</label>
                        <OutlinedInput 
                                  label={"Enter Form No"}
                                  value={''} onChange={function (value: string): void {
                                      throw new Error('Function not implemented.');
                                  } }/>                   
                         </div>


                   
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Act Name</label>
                        <OutlinedInput 
                        textarea
                                  label={"Enter Act Name"}
                                  value={''} onChange={function (value: string): void {
                                    throw new Error('Function not implemented.');
                                } }                        />                   
                         </div>

                    <div>
                    <label className="block text-sm font-medium mb-2">Register Name</label>
                    <OutlinedInput 
                    textarea
                                  label={"Enter Register Name"}
                                  value={''} onChange={function (value: string): void {
                                    throw new Error('Function not implemented.');
                                } }                        />  
                    </div>
                    
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                    <label className="block text-sm font-medium mb-2">Register Frequency</label>
                    <OutlinedSelect 
                        label={"Select Register Frequency"} 
                        options={frequency}
                        value={undefined} 
                        onChange={undefined} />
                    </div>
                    <div>
                    <label className="block text-sm font-medium mb-2">Upload Template</label>
                    <Input
                        type="file"
                        accept=".xlsx,.xls"
                        className="mb-4"
                    />                
                         </div>
                </div>

            </div>
            <div className="flex justify-end gap-2 mt-4">
                        <Button variant="plain" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="solid">
                            Confirm
                        </Button>
                    </div>
        </div>
      </Dialog>
   

 </AdaptableCard>
  )
}

export default Register