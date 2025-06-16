import React, { useEffect, useState } from 'react';
import { AdaptableCard } from '@/components/shared';
import { Button } from '@/components/ui';
import OutlinedInput from '@/components/ui/OutlinedInput';
import { useNavigate } from 'react-router-dom';
import { HiDownload, HiPlusCircle } from 'react-icons/hi';
import OutlinedSelect from '@/components/ui/Outlined/Outlined';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { Notification, toast } from '@/components/ui';
import AuditTrackerTable from './components/AuditTrackerTable';
import { ComplianceData, CountryOption, ReferenceData } from '@/@types/compliance';
// import { ComplianceData, CountryOption, ReferenceData } from '@/types/complianceTypes';

const AuditTracker = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState<string>('INDIA');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [tableData, setTableData] = useState<ComplianceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  });
  const [states, setStates] = useState<ReferenceData[]>([]);

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
          ...params,
        },
      });

      const dataWithStateNames = response.data.data.map((item: any) => ({
        ...item,
        state_name: item.state_id
          ? states.find(state => state.id === item.state_id)?.name
          : (item.applicable === 'central' ? 'Central' : 'N/A')
      }));

      setTableData(dataWithStateNames);
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

  const handleDownload = async () => {
    try {
      const response = await httpClient.get(endpoints.compliances.exportData(), {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ComplianceData.xlsx');
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
  }, [selectedCountry, searchTerm]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, pageIndex: page }));
    fetchComplianceData({ page });
  };

  const handlePageSizeChange = (size: number) => {
    setPagination(prev => ({ ...prev, pageSize: size, pageIndex: 1 }));
    fetchComplianceData({ pageSize: size, page: 1 });
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchComplianceData({ page: 1 });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
          <div className="w-full md:w-48">
  <OutlinedInput
    label="Search By State"
    value={searchTerm}
    onChange={setSearchTerm}  // Directly pass setSearchTerm since it expects (value: string) => void
    onKeyDown={handleSearch}
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
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          refetchData={() => fetchComplianceData()}
          states={states}
        />
      </div>
    </AdaptableCard>
  );
};

export default AuditTracker;