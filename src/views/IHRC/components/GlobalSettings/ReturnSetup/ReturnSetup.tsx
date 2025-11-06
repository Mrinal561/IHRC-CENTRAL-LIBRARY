import { AdaptableCard } from '@/components/shared'
import OutlinedInput from '@/components/ui/OutlinedInput'
import React, { useState, useEffect } from 'react'
import ReturnSetupTool from './components/ReturnSetupTool'
import ReturnSetupTable from './components/ReturnSetupTable'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'

interface ReturnSetupData {
    id: string | number;
    act_name: string;
    return_name: string;
    state_name: string;
    return_applicable: boolean;
    return_applicable_at: string;
    applicable: string;
    frequency: string;
    first_due_date: string;
    second_due_date: string;
    third_due_date: string;
    last_due_date: string;
    bi_annual_date: string;
    is_active: boolean;
}

const ReturnSetup = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('state');
    const [timestamp, setTimestamp] = useState(Date.now());
    const [tableData, setTableData] = useState({
        total: 0,
        pageIndex: 1,
        pageSize: 10,
    });
    const [returnSetupData, setReturnSetupData] = useState<ReturnSetupData[]>([]);
    const [loading, setLoading] = useState(false);
    
    const searchOptions = [
        { label: 'State', value: 'state' },
        { label: 'Act Name', value: 'act_name' },
        { label: 'Return Name', value: 'return_name' },
        { label: 'Applicability', value: 'applicability' },
    ]
    
    const fetchReturnSetupData = async () => {
        try {
            setLoading(true);
            const response = await httpClient.get(endpoints.return.list(), {
                params: {
                    page: tableData.pageIndex,
                    page_size: tableData.pageSize,
                    search: searchTerm,
                    search_by: searchBy
                }
            });
            
            const transformedData = response.data.data.map((item: any) => ({
                ...item,
                state: item.state_name || '--',
                return_applicability: item.return_applicable ? 'Yes' : 'No',
                first_due_date: item.due_dates?.first_due_date || '-',
                second_due_date: item.due_dates?.second_due_date || '-',
                third_due_date: item.due_dates?.third_due_date || '-',
                last_due_date: item.due_dates?.last_due_date || '-',
                bi_annual_date: item.due_dates?.bi_annual_due_date || '-'
            }));
            
            setReturnSetupData(transformedData || []);
            setTableData(prev => ({
                ...prev,
                total: response.data.paginate_data?.totalResults || 0
            }));
        } catch (error) {
            console.error('Error fetching return setup data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReturnSetupData();
    }, [tableData.pageIndex, tableData.pageSize, searchTerm, searchBy, timestamp]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const handleSearchByChange = (option: any) => {
        const value = typeof option === 'string' ? option : option.value;
        setSearchBy(value);
    };

    const refreshTable = () => {
        setTimestamp(Date.now());
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

    const handleStatusToggle = async (id: string | number, is_active: boolean) => {
        try {
            setLoading(true);
            
            await httpClient.put(
                endpoints.return.statusToggle(id, is_active),
                { is_active }
            );
            
            refreshTable();
        } catch (error) {
            console.error('Error toggling return status:', error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <AdaptableCard className='h-full' bodyClass='h-full'>
            <div className='flex flex-col justify-between gap-8 mb-2'>
                <div className='mb-4 lg:mb-0 flex justify-between'>
                    <h3 className='text-2xl font-bold'>Return Setup</h3>
                    <div className='flex items-center gap-4 relative z-10'>
                        <div className="w-full md:w-48">
                            <OutlinedSelect
                                options={searchOptions} 
                                label="Search By" 
                                value={{
                                    value: searchBy,
                                    label: searchOptions.find(option => option.value === searchBy)?.label || 'State'
                                }}
                                onChange={handleSearchByChange}
                            />
                        </div>
                        <div className="w-full md:w-64 relative">
                            <OutlinedInput
                                label='Search' 
                                value={searchTerm} 
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="flex-shrink-0">
                            <ReturnSetupTool onSuccess={refreshTable} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 relative z-0">
                <ReturnSetupTable 
                    data={returnSetupData}
                    loading={loading}
                    onStatusToggle={handleStatusToggle}
                    pageIndex={tableData.pageIndex}
                    pageSize={tableData.pageSize}
                    total={tableData.total}
                    onPaginationChange={onPaginationChange}
                    onSelectChange={onSelectChange}
                />
            </div>
        </AdaptableCard>
    )
}

export default ReturnSetup