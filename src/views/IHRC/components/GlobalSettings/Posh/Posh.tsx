import { AdaptableCard } from '@/components/shared'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import React, { useState, useEffect } from 'react'
import PoshBulkUpload from './components/PoshBulkUpload'
import { HiPlusCircle } from 'react-icons/hi'
import OutlinedInput from '@/components/ui/OutlinedInput'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'
import PoshTable from './components/PoshTable'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'

interface PoshFormData {
    state_id: string;
    district_id: string;
    authority_name: string;
    authority_address: string;
}

const Posh = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPoshId, setCurrentPoshId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [states, setStates] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [isLoadingStates, setIsLoadingStates] = useState(false);
    const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
    const [timestamp, setTimestamp] = useState(Date.now());
    const [formData, setFormData] = useState<PoshFormData>({
        state_id: '',
        district_id: '',
        authority_name: '',
        authority_address: ''
    });
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
    });

    const fetchStates = async () => {
        setIsLoadingStates(true);
        try {
            const response = await httpClient.get(endpoints.common.getStatesAll());
            const statesData = response.data.data || response.data || [];
            setStates(statesData);
        } catch (error) {
            toast.push(
                <Notification title="Error" type="error">
                    Failed to fetch states
                </Notification>
            );
        } finally {
            setIsLoadingStates(false);
        }
    };

    useEffect(() => {
        fetchStates();
    }, []);

    const fetchDistricts = async (stateId: string) => {
        if (!stateId) {
            setDistricts([]);
            return;
        }
    
        setIsLoadingDistricts(true);
        try {
            const response = await httpClient.get(endpoints.district.getAllDistrict(), {
                params: {
                    state_id: stateId
                }
            });
            
            console.log('Districts response:', response.data); // Debug log
            setDistricts(response.data || []);
        } catch (error) {
            console.error('District fetch error:', error);
            // Error handling
        } finally {
            setIsLoadingDistricts(false);
        }
    };
    
    const handleStateChange = (selectedOption: {value: string, label: string} | string) => {
        // Handle both cases - when the select returns an object or just the value
        const stateId = typeof selectedOption === 'string' 
            ? selectedOption 
            : selectedOption.value;
    
        setFormData(prev => ({
            ...prev,
            state_id: stateId,
            district_id: ''
        }));
        fetchDistricts(stateId);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setIsEditMode(false);
        setCurrentPoshId(null);
        setFormData({
            state_id: '',
            district_id: '',
            authority_name: '',
            authority_address: ''
        });
        setDistricts([]);
    };

    const handleEdit = async (id: string) => {
        try {
            const response = await httpClient.get(endpoints.posh.detail(id));
            const poshData = response.data.data || response.data; // Handle both cases
            
            console.log('Edit data:', poshData); // Debug log
            
            setCurrentPoshId(id);
            setFormData({
                state_id: poshData.state_id?.toString() || '',
                district_id: poshData.district_id?.toString() || '',
                authority_name: poshData.authority_name || '',
                authority_address: poshData.authority_address || ''
            });
            
            // Fetch districts for the selected state
            if (poshData.state_id) {
                await fetchDistricts(poshData.state_id.toString());
            }
            
            setIsEditMode(true);
            setIsDialogOpen(true);
        } catch (error) {
            console.error('Edit error:', error);
            toast.push(
                <Notification title="Error" type="error">
                    Failed to fetch POSH details
                </Notification>
            );
        }
    };

    const handleInputChange = (field: keyof PoshFormData, value: string) => {
        console.log(`Setting ${field} to:`, value); // Debug log
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleConfirm = async () => {
        // Validate district_id
        if (!formData.district_id || isNaN(Number(formData.district_id))) {
            toast.push(
                <Notification title="Error" type="error">
                    Please select a valid district
                </Notification>
            );
            return;
        }
    
        try {
            const payload = {
                state_id: Number(formData.state_id),
                district_id: Number(formData.district_id),
                authority_name: formData.authority_name,
                authority_address: formData.authority_address
            };
    
            console.log('Submitting payload:', payload);

            if (isEditMode && currentPoshId) {
                await httpClient.put(endpoints.posh.update(currentPoshId), payload);
                toast.push(
                    <Notification title="Success" type="success">
                        POSH authority updated successfully!
                    </Notification>
                );
            } else {
                await httpClient.post(endpoints.posh.create(), payload);
                toast.push(
                    <Notification title="Success" type="success">
                        POSH authority created successfully!
                    </Notification>
                );
            }

            handleDialogClose();
            // Refresh table data
            setTimestamp(Date.now());
        } catch (error: any) {
            toast.push(
                <Notification title="Error" type="error">
                    {error.response?.data?.message || 'Operation failed'}
                </Notification>
            );
        }
    };

    const handleDownloadData = async () => {
        try {
            const response = await httpClient.get(endpoints.posh.downloadData(), {
                responseType: 'blob'
              });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'POSH_Data.xlsx');
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

    const onPaginationChange = (page: number) => {
        setTableData(prev => ({ ...prev, pageIndex: page }));
    };

    const onSelectChange = (value: number) => {
        setTableData(prev => ({
            ...prev,
            pageSize: Number(value),
            pageIndex: 1,
        }));
    };

    const refreshTable = () => {
        setTimestamp(Date.now());
    };

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">POSH Manager</h3>
                </div>
                <div className="flex gap-2">
                    <OutlinedInput 
                        label={'Search by State/District'} 
                        value={searchTerm} 
                        onChange={setSearchTerm}
                    />
                    <Button
                        variant="solid"
                        size="sm"
                        icon={<HiPlusCircle />}
                        onClick={handleDownloadData}
                    >
                        Download Data
                    </Button>
                    <PoshBulkUpload onSuccess={refreshTable} />
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

            <PoshTable 
                onEdit={handleEdit} 
                searchTerm={searchTerm}
                pageIndex={tableData.pageIndex}
                pageSize={tableData.pageSize}
                onPaginationChange={onPaginationChange}
                onSelectChange={onSelectChange}
                timestamp={timestamp}
               
            />

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
    value={formData.state_id ? {
        value: formData.state_id,
        label: states.find(state => state.id.toString() === formData.state_id)?.name || ''
    } : null}
    label={'Select State Name'}
    options={states.map(state => ({
        value: state.id.toString(),
        label: state.name
    }))}
    onChange={(selectedOption) => handleStateChange(selectedOption)}
    disabled={isLoadingStates}
/>

                        </div>
                        <div>
                            <label className="text-gray-600 mb-2 block">District</label>
                            <OutlinedSelect
    value={formData.district_id ? {
        value: formData.district_id,
        label: districts.find(district => district.id.toString() === formData.district_id)?.name || ''
    } : null}
    label={'Select District Name'} 
    options={districts.map(district => ({
        value: district.id.toString(),
        label: district.name
    }))} 
    onChange={(selectedOption) => {
        const districtId = typeof selectedOption === 'string' 
            ? selectedOption 
            : selectedOption?.value || '';
        handleInputChange('district_id', districtId);
    }}
    disabled={!formData.state_id || isLoadingDistricts}
/>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-gray-600 mb-2 block">Authority Name</label>
                            <OutlinedInput
                                value={formData.authority_name}
                                label={'Enter Authority Name'} 
                                onChange={(value) => handleInputChange('authority_name', value)} 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-gray-600 mb-2 block">Authority Address</label>
                        <OutlinedInput
                            textarea
                            value={formData.authority_address}
                            label={'Enter Authority Address'} 
                            onChange={(value) => handleInputChange('authority_address', value)} 
                        />
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

export default Posh