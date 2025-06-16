import React, { useState } from 'react'
import { Button, Dialog, Input, Notification, toast } from '@/components/ui'
import { HiDownload, HiUpload } from 'react-icons/hi'

interface LWFBulkUploadProps {
    onUploadSuccess?: () => void
    companyId: any
}

const BulkUploadCompliance: React.FC<LWFBulkUploadProps> = ({
    onUploadSuccess,
    companyId,
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [remark, setRemark] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)

    const handleUploadClick = () => {
        setIsDialogOpen(true)
    }

    const handleCancel = () => {
        setIsDialogOpen(false)
        setRemark('')
        setFile(null)
        setIsUploading(false)
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0])
        }
    }

    return (
        <>
            <Button
                variant="solid"
                size="sm"
                icon={<HiUpload />}
                onClick={handleUploadClick}
            >
                Bulk Upload
            </Button>

            <Dialog
                isOpen={isDialogOpen}
                onClose={handleCancel}
                width={450}
                shouldCloseOnOverlayClick={false}
               
            >
                <h5 className="mb-4">Bulk Upload</h5>
                <div className="my-4 flex gap-2 items-center">
                    <p>Download Format</p>
                    <a className="text-blue-600 hover:underline">
                        <Button size="xs" icon={<HiDownload />}>
                            Download
                        </Button>
                    </a>
                </div>
                <div className="flex flex-col gap-2">
                    <p>Upload Compliance File:</p>
                    <Input
                        type="file"
                        onChange={handleFileChange}
                        accept=".xlsx,.xls"
                        className="mb-4"
                    />
                </div>
                <p>Please Enter the Remark:</p>
                <textarea
                    className="w-full p-2 border rounded mb-2"
                    rows={3}
                    placeholder="Enter remark"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                />
                <div className="mt-6 text-right flex gap-2 justify-end items-center">
                    <Button
                        size="sm"
                        className="mr-2"
                        onClick={handleCancel}
                        disabled={isUploading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        loading={isUploading}
                    >
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default BulkUploadCompliance