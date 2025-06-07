import React, { useState } from 'react'
import AdaptableCard from '@/components/shared/AdaptableCard'
import TemplateCards from './components/TemplateCards'
import { Button, Dialog, Input, Notification, toast } from '@/components/ui'
import { HiDownload, HiPlus } from 'react-icons/hi'

const RegisterTemplate = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [registerName, setRegisterName] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0])
        }
    }

    const handleAddRegister = () => {
        if (!registerName.trim()) {
            toast.push(
                <Notification title="Error" type="danger">
                    Please enter a register name
                </Notification>
            )
            return
        }

        if (!selectedFile) {
            toast.push(
                <Notification title="Error" type="danger">
                    Please upload a register template
                </Notification>
            )
            return
        }

        // Here you would typically make an API call to save the new register
        // For now, we'll just show a success message
        setTimeout(() => {
            toast.push(
                <Notification title="Success" type="success">
                    Register "{registerName}" added successfully
                </Notification>
            )
            setIsDialogOpen(false)
            setRegisterName('')
            setSelectedFile(null)
        }, 1000)
    }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-4">
                <h3 className="text-2xl font-bold">Register Templates</h3>
                <div className='flex gap-3'>
                                      <Button size='sm' variant='solid' icon={<HiDownload />}>Download Registers</Button>

                <Button 
                    size="sm"
                    variant="solid"
                    icon={<HiPlus />}
                    onClick={() => setIsDialogOpen(true)}
                    >
                    Add Register
                </Button>
                  </div>
            </div>
            
            <TemplateCards />
            
            <Dialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onRequestClose={() => setIsDialogOpen(false)}
            >
                <h5 className="mb-4">Add New Register</h5>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="register-name">
                        Register Name
                    </label>
                    <Input
                        id="register-name"
                        placeholder="Enter register name"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1" htmlFor="register-template">
                        Upload Register Template
                    </label>
                    <Input
                        type="file"
                        id="register-template"
                        onChange={handleFileChange}
                        accept=".xlsx,.xls,.doc,.docx,.pdf"
                    />
                </div>
                
                <div className="text-right">
                    <Button
                        className="mr-2"
                        onClick={() => setIsDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        onClick={handleAddRegister}
                        disabled={!registerName.trim() || !selectedFile}
                    >
                        Add Register
                    </Button>
                </div>
            </Dialog>
        </AdaptableCard>
    )
}

export default RegisterTemplate