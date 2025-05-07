import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import AdaptableCard from '@/components/shared/AdaptableCard'
import OutlinedInput from '@/components/ui/OutlinedInput'
import BulkUpload from './components/BulkUpload'
import StateTable from './components/StateTable'
import {
    fetchStateDistricts,
    createState,
    updateStateAndDistrict,
    clearError,
} from '@/store/slices/state/stateDistrictSlice'
import { AppDispatch, RootState } from '@/store'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'

interface StateDistrictFormData {
    state_name: string;
    district_name: string;
}

const State = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { stateDistricts, loading, error, pagination } = useSelector(
        (state: RootState) => state.stateDistrict 
    );
    
    const [stateTableLoading, setStateTableLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [currentStateDistrict, setCurrentStateDistrict] = useState<{
        state_id: number;
        district_id: number;
    } | null>(null)
    const [formData, setFormData] = useState<StateDistrictFormData>({
        state_name: '',
        district_name: ''
    })
    const [searchTerm, setSearchTerm] = useState('');


    const fetchData = useCallback(() => {
        dispatch(fetchStateDistricts({
            page: pagination.page,
            page_size: pagination.limit.toString(),
            search: searchTerm
        }));
    }, [dispatch, pagination.page, pagination.limit, searchTerm]);

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        if (error) {
            toast.push(
                <Notification title="Error" closable={true} type="error">
                    {error}
                </Notification>,
            )
            dispatch(clearError())
        }
    }, [error, dispatch])

    const handleEdit = (stateId: number, districtId: number) => {
        const stateDistrictToEdit = stateDistricts.find(
            sd => sd.state_id === stateId && sd.district_id === districtId
        )
        if (stateDistrictToEdit) {
            setIsEditMode(true)
            setCurrentStateDistrict({
                state_id: stateId,
                district_id: districtId
            })
            setFormData({
                state_name: stateDistrictToEdit.state_name,
                district_name: stateDistrictToEdit.district_name
            })
            setIsDialogOpen(true)
        }
    }

    const handleInputChange = (field: keyof StateDistrictFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleDialogClose = () => {
        setIsDialogOpen(false)
        setIsEditMode(false)
        setCurrentStateDistrict(null)
        setFormData({
            state_name: '',
            district_name: ''
        })
    }

    const handleDownloadData = async () => {
        try {
            const response = await httpClient.get(endpoints.state.downloadData(), {
                responseType: 'blob'
              });
            // Assuming the API returns a blob for download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'State_District_Data.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url); 
        } catch (error) {
            toast.push(
                <Notification title="Error" type="error">
                    Failed to download data
                </Notification>
            );
        }
    };

    const handlePaginationChange = (page: number) => {
        dispatch(fetchStateDistricts({
            page,
            page_size: pagination.limit.toString(),
            search: searchTerm

        }))
    }

    const handlePageSizeChange = (pageSize: number) => {
        dispatch(fetchStateDistricts({
            page: 1,
            page_size: pageSize.toString(),
            search: searchTerm

        }))
    }

    const handleConfirm = async () => {
        try {
            if (isEditMode && currentStateDistrict) {
                await dispatch(
                    updateStateAndDistrict({ 
                        stateId: currentStateDistrict.state_id,
                        newStateName: formData.state_name,
                        districtId: currentStateDistrict.district_id,
                        newDistrictName: formData.district_name
                    })
                ).unwrap()
                
                toast.push(
                    <Notification title="Success" type="success">
                        State/District updated successfully!
                    </Notification>,
                )
            } else {
                await dispatch(createState({
                    stateName: formData.state_name,
                    districtName: formData.district_name
                })).unwrap()
                
                toast.push(
                    <Notification title="Success" type="success">
                        State/District created successfully!
                    </Notification>,
                )
            }
            handleDialogClose()
            fetchData()
        } catch (error) {
            console.error('Error:', error)
        }
    }

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">State/District Manager</h3>
                </div>
                <div className="flex gap-2">
                <OutlinedInput
                        label="Search by state name..."
                        value={searchTerm}
                        onChange={(value) => setSearchTerm(value)}
                    />
                    <Button
                        variant="solid"
                        size="sm"
                        icon={<HiDownload />}
                        onClick={handleDownloadData}
                    >
                        Download Data
                    </Button>
                    <BulkUpload />
                    <Button
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                        onClick={() => setIsDialogOpen(true)}
                    >
                        Add State/District
                    </Button>
                </div>
            </div>

            <StateTable
                tableLoading={stateTableLoading}
                setStateTableLoading={setStateTableLoading}
                loading={loading}
                onEdit={handleEdit}
                stateDistricts={stateDistricts}
                paginationData={pagination}
                onPaginationChange={handlePaginationChange}
                onPageSizeChange={handlePageSizeChange}
            />

            <Dialog
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
                width={500}
            >
                <h5 className="mb-6">
                    {isEditMode ? 'Edit State/District' : 'Add New State/District'}
                </h5>
                <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col gap-4">
                        <div className="w-full">
                            <label className="text-gray-600 mb-2 block">State Name</label>
                            <OutlinedInput
                                value={formData.state_name}
                                onChange={(value) => handleInputChange('state_name', value)} 
                                label='Enter State Name'
                            />
                        </div>
                        <div className="w-full">
                            <label className="text-gray-600 mb-2 block">District Name</label>
                            <OutlinedInput
                                value={formData.district_name}
                                onChange={(value) => handleInputChange('district_name', value)} 
                                label='Enter District Name'
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="plain" onClick={handleDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </AdaptableCard>
    )
}

export default State