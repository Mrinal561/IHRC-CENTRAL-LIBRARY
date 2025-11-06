
import React, { useEffect, useState } from 'react';
import { AdaptableCard } from '@/components/shared';
import { Button } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import { useNavigate } from 'react-router-dom';
import { HiDownload, HiPlusCircle, HiUpload } from 'react-icons/hi';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { Notification, toast } from '@/components/ui';
import AuditTrackerTable from './components/AuditTrackerTable';
import BulkUploadCompliance from './components/BulkUploadCompliance';
import { ComplianceData, CountryOption, ReferenceData } from '@/@types/compliance';

const AuditTracker = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<string>('INDIA');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [tableData, setTableData] = useState<ComplianceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<ReferenceData[]>([]);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [selectedState, setSelectedState] = useState<number | null>(null);

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  });
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const countryOptions: CountryOption[] = [
    { value: 'INDIA', label: 'India' },
  ];

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await httpClient.get(endpoints.common.getStatesAll());
        setStates(response.data || []);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    fetchStates();
  }, []);

  const fetchComplianceData = async (params: any = {}) => {
    setLoading(true);
    try {
      const response = await httpClient.get(endpoints.compliances.listCompliance(), {
        params: {
          page: params.page || pagination.pageIndex,
          page_size: params.pageSize || pagination.pageSize,
          search: params.search || searchTerm,
          country: selectedCountry,
          state_id: selectedState,
          ...params,
        },
      });

      const transformedData = response.data.data.map((item: any) => ({
        ...item,
        state_name: item.state_id
          ? states.find(state => state.id === item.state_id)?.name
          : (item.applicable === 'central' ? 'Central' : 'N/A'),
        formatted_due_dates: item.due_dates ? Object.fromEntries(
          Object.entries(item.due_dates).map(([key, value]) => [
            key,
            value ? formatDisplayDate(value as string) : ''
          ])
        ) : {}
      }));

      setTableData(transformedData);
      setPagination({
        pageIndex: response.data.paginate_data.page,
        pageSize: response.data.paginate_data.limit,
        total: response.data.paginate_data.totalResults,
      });
    } catch (error) {
      toast.push(
        <Notification title="Error" type="error">
          Failed to fetch compliance data
        </Notification>
      );
      console.error('Error fetching compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const refreshTable = () => {
    setTimestamp(Date.now());
  };

  const toggleComplianceStatus = async (id: number, is_active: boolean) => {
    setIsTogglingStatus(true);
    try {
      await httpClient.put(
        endpoints.compliances.togglestatus(id.toString()),
        { is_active }
      );
      toast.push(
        <Notification title="Success" type="success">
          Compliance status updated successfully
        </Notification>
      );
      refreshTable();
    } catch (error) {
      toast.push(
        <Notification title="Error" type="error">
          Failed to update compliance status
        </Notification>
      );
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await httpClient.get(endpoints.compliances.exportData(), {
        responseType: 'blob',
        params: {
          country: selectedCountry,
          search: searchTerm
        }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ComplianceData_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.push(
        <Notification title="Success" type="success">
          Download successful
        </Notification>
      );
    } catch (error) {
      console.error('Download error:', error);
      toast.push(
        <Notification title="Error" type="error">
          Failed to download data
        </Notification>
      );
    }
  };

  useEffect(() => {
    fetchComplianceData();
  }, [timestamp, selectedCountry, searchTerm, pagination.pageIndex, pagination.pageSize, selectedState]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, pageIndex: page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination(prev => ({ ...prev, pageSize: size, pageIndex: 1 }));
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setPagination(prev => ({ ...prev, pageIndex: 1 }));
      fetchComplianceData({ page: 1 });
    }
  };

  const handleStateChange = (option: any) => {
  setSelectedState(option?.value || null);
  setPagination(prev => ({ ...prev, pageIndex: 1 })); // Reset to first page
};

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
  };

  const selectedCountryOption = countryOptions.find(option => option.value === selectedCountry) || countryOptions[0];

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">Audit Setup</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center w-full md:w-auto">
          <div className="w-full md:w-48 z-20">
            <OutlinedSelect
              label="Select Country"
              options={countryOptions}
              value={selectedCountryOption}
              onChange={(option: any) => setSelectedCountry(option?.value || 'INDIA')}
            />
          </div>
          <div className="w-full md:w-48 z-20">
           <OutlinedSelect
  label="Filter by State"
  options={states.map(state => ({
    value: state.id,
    label: state.name
  }))}
  value={selectedState ? { 
    value: selectedState, 
    label: states.find(s => s.id === selectedState)?.name || '' 
  } : null}
  onChange={handleStateChange}
  showClearButton={true}
/>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant='solid'
              size='sm'
              icon={<HiDownload />}
              onClick={handleDownload}
            >
              Download Data
            </Button>
            <Button
              variant='solid'
              size='sm'
              icon={<HiUpload />}
              onClick={() => setIsBulkUploadOpen(true)}
            >
              Bulk Upload
            </Button>
            <Button
              variant="solid"
              size="sm"
              icon={<HiPlusCircle />}
              onClick={() => navigate('/add-compliance')}
            >
              Add Compliance
            </Button>
          </div>
        </div>
      </div>
      <div className="relative z-10">
        <AuditTrackerTable
          data={tableData}
          loading={loading || isTogglingStatus}
          onStatusToggle={toggleComplianceStatus}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          states={states}
        />
      </div>

      {isBulkUploadOpen && (
        <BulkUploadCompliance 
          onUploadSuccess={() => {
            setIsBulkUploadOpen(false);
            refreshTable();
          }}
          onClose={() => setIsBulkUploadOpen(false)}
        />
      )}
    </AdaptableCard>
  );
};

export default AuditTracker;