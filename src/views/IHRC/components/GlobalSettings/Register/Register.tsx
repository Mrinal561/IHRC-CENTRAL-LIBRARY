import { AdaptableCard } from '@/components/shared'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import React, { useState, useEffect } from 'react'
import OutlinedInput from '@/components/ui/OutlinedInput'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
import RegisterTable from './components/RegisterTable'
import UploadProcessedModal from './components/UploadProcessedModal'
import EditRegisterModal from './components/EditRegisterModal'
import { HiDownload } from 'react-icons/hi'

interface RegisterFormData {
  search?: string;
  year?: number;
  month?: string;
  page: number;
  page_size: number;
  sort_by: string;
  sort: 'asc' | 'desc';
}

interface SelectOption {
  value: string;
  label: string;
}

const Register = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentRegisterId, setCurrentRegisterId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  
  const [tableData, setTableData] = useState({
    data: [] as any[],
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  });

  // Generate year options from 2021 to current year
  const generateYearOptions = (): SelectOption[] => {
    const currentYear = new Date().getFullYear();
    const yearOptions: SelectOption[] = [];
    
    // Generate years from current year down to 2021
    for (let year = currentYear; year >= 2021; year--) {
      yearOptions.push({
        value: String(year),
        label: String(year),
      });
    }
    
    return yearOptions;
  };

  const monthOptions: SelectOption[] = [
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' },
  ];

  const yearOptions = generateYearOptions();

  const fetchRegisterData = async () => {
    try {
      setIsLoading(true);
      
      // Create params object
      const params: any = {
        page: tableData.pageIndex,
        page_size: tableData.pageSize,
        sort_by: 'created_at',
        sort: 'desc'
      };

      // Add search term if provided
      if (searchTerm && typeof searchTerm === 'string' && searchTerm.trim() !== '') {
        params.search = searchTerm;
      }

      // Add year if selected (check if it's an object or string)
      if (selectedYear) {
        let yearValue: string;
        
        // Check if selectedYear is an object
        if (typeof selectedYear === 'object' && selectedYear !== null) {
          yearValue = selectedYear.value;
        } else {
          yearValue = selectedYear;
        }
        
        if (yearValue && yearValue.trim() !== '') {
          const yearNum = parseInt(yearValue);
          if (!isNaN(yearNum)) {
            params.year = yearNum;
          }
        }
      }

       if (selectedMonth) {
        let monthValue: string;
        
        // Check if selectedMonth is an object
        if (typeof selectedMonth === 'object' && selectedMonth !== null) {
          monthValue = selectedMonth.value;
        } else {
          monthValue = selectedMonth;
        }
        
        if (monthValue && monthValue.trim() !== '') {
          params.month = monthValue;
        }
      }

      console.log('API params being sent:', params);

      const response = await httpClient.get(endpoints.registers.list(), { params });
      
      setTableData(prev => ({
        ...prev,
        data: response.data.data || [],
        total: response.data.pagination?.total_records || 0
      }));
    } catch (error) {
      console.error('Error fetching register data:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to fetch register data
        </Notification>
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisterData();
  }, [tableData.pageIndex, tableData.pageSize, searchTerm, selectedYear, selectedMonth]);

  const handleDownloadOriginal = async (id: number) => {
    try {
      const response = await httpClient.get(endpoints.registers.downloadOriginal(id), {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `register_input_${id}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.push(
        <Notification title="Success" type="success">
          Input file downloaded successfully
        </Notification>
      );
    } catch (error) {
      console.error('Download error:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to download Input file
        </Notification>
      );
    }
  };

  const handleDownloadProcessed = async (id: number) => {
    try {
      const response = await httpClient.get(endpoints.registers.downloadProcessed(id), {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `register_output_${id}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.push(
        <Notification title="Success" type="success">
          Output file downloaded successfully
        </Notification>
      );
    } catch (error) {
      console.error('Download error:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to download output file
        </Notification>
      );
    }
  };

  const handleUploadProcessed = (id: number) => {
    setCurrentRegisterId(id);
    setIsUploadModalOpen(true);
  };

  const handleEdit = (id: number) => {
    setCurrentRegisterId(id);
    setIsEditModalOpen(true);
  };

  const handleUploadSuccess = () => {
    setIsUploadModalOpen(false);
    setCurrentRegisterId(null);
    fetchRegisterData();
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setCurrentRegisterId(null);
    fetchRegisterData();
  };

  const handleExport = async () => {
    try {
      const response = await httpClient.get(endpoints.registers.export(), {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `register_report_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.push(
        <Notification title="Success" type="success">
          Report exported successfully
        </Notification>
      );
    } catch (error) {
      console.error('Export error:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to export report
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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setTableData(prev => ({ ...prev, pageIndex: 1 }));
  };

  const handleYearChange = (option: SelectOption | null) => {
    console.log('Year selected:', option);
    
    if (option) {
      setSelectedYear(option.value); // Store only the value string
    } else {
      setSelectedYear(''); // Clear if option is null
    }
    
    setTableData(prev => ({ ...prev, pageIndex: 1 }));
  };
  
  const handleMonthChange = (option: SelectOption | null) => {
    console.log('Month selected:', option);
    
    if (option) {
      setSelectedMonth(option.value);
    } else {
      setSelectedMonth('');
    }
    
    setTableData(prev => ({ ...prev, pageIndex: 1 }));
  };

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">Register</h3>
        </div>
        <div className="flex gap-3">
          <OutlinedInput 
            label={'Search by Company/Admin'} 
            value={searchTerm} 
            onChange={handleSearch}
          />
          <div className='w-36'>
            <OutlinedSelect
              label={'Year'}
              value={yearOptions.find(opt => opt.value === selectedYear) || null}
              options={yearOptions}
              onChange={handleYearChange}
            />
          </div>
          <div className='w-36'>
            <OutlinedSelect
              label={'Month'}
              value={monthOptions.find(opt => opt.value === selectedMonth) || null}
              options={monthOptions}
              onChange={handleMonthChange}
            />
          </div>
          <Button
            variant="solid"
            size="sm"
            icon={<HiDownload />}
            onClick={handleExport}
            loading={isLoading}
          >
            Export Report
          </Button>
        </div>
      </div>

      <RegisterTable 
        data={tableData.data}
        loading={isLoading}
        onDownloadOriginal={handleDownloadOriginal}
        onDownloadProcessed={handleDownloadProcessed}
        onUploadProcessed={handleUploadProcessed}
        onEdit={handleEdit}
        pageIndex={tableData.pageIndex}
        pageSize={tableData.pageSize}
        total={tableData.total}
        onPaginationChange={onPaginationChange}
        onSelectChange={onSelectChange}
      />

      {currentRegisterId && (
        <>
          <UploadProcessedModal
            isOpen={isUploadModalOpen}
            onClose={() => {
              setIsUploadModalOpen(false);
              setCurrentRegisterId(null);
            }}
            registerId={currentRegisterId}
            onSuccess={handleUploadSuccess}
          />

          <EditRegisterModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setCurrentRegisterId(null);
            }}
            registerId={currentRegisterId}
            onSuccess={handleEditSuccess}
          />
        </>
      )}
    </AdaptableCard>
  )
}

export default Register