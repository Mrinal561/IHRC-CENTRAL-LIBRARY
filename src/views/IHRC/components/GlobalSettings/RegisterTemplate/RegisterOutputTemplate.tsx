import React, { useState, useEffect } from 'react';
import { Button, Dialog, FormContainer, FormItem, Input, Notification, Select, toast } from '@/components/ui';
import { HiPlus } from 'react-icons/hi';
import RegisterOutputTable from './components/RegisterOutputTable';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import { AdaptableCard } from '@/components/shared';

interface StateOption {
  value: string;
  label: string;
}

export interface RegisterOutput {
  id: number;
  register_type: string;
  state_id: number;
  state_name?: string;
  document?: string;
  original_filename?: string;
}

const RegisterOutputTemplate = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [registerType, setRegisterType] = useState('');
  const [selectedState, setSelectedState] = useState<StateOption | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [states, setStates] = useState<StateOption[]>([]);
  const [registers, setRegisters] = useState<RegisterOutput[]>([]);
  const [loading, setLoading] = useState({
    states: false,
    table: false,
    submit: false,
  });
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  });


  // Fetch states for dropdown
  useEffect(() => {
    const fetchStates = async () => {
      setLoading(prev => ({ ...prev, states: true }));
      try {
        const response = await httpClient.get(endpoints.common.getStatesAll());
        const formattedStates = response.data.map((state: any) => ({
          value: state.id.toString(),
          label: state.name,
        }));
        setStates(formattedStates);
      } catch (error) {
        toast.push(
          <Notification title="Error" type="error">
            Failed to load states
          </Notification>
        );
      } finally {
        setLoading(prev => ({ ...prev, states: false }));
      }
    };

    fetchStates();
  }, []);

  // Fetch register outputs
  const fetchRegisterOutputs = async () => {
    setLoading(prev => ({ ...prev, table: true }));
    try {
      const response = await httpClient.get(endpoints.register.listRegisterOutput(), {
         params: {
          page: pagination.pageIndex,
          page_size: pagination.pageSize,
        },
      });

      const formattedData = response.data.data.map((item: any) => ({
        ...item,
        state_name: item.State?.name || 'N/A',
      }));

      setRegisters(formattedData);
       setPagination({
        pageIndex: response.data.paginate_data.page,
        pageSize: response.data.paginate_data.limit,
        total: response.data.paginate_data.totalResults,
      });
    } catch (error) {
      toast.push(
        <Notification title="Error" type="error">
          Failed to load register outputs
        </Notification>
      );
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  };

  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setRegisterType('');
    setSelectedState(null);
    setSelectedFile(null);
  };

  const handleDialogClose = () => {
    resetForm();
    setIsDialogOpen(false);
  };

  const handleSubmit = async () => {
        const trimmedRegisterType = registerType.trim();
if (!trimmedRegisterType) {
      toast.push(
        <Notification title="Error" type="error">
          Please enter a register type
        </Notification>
      );
      return;
    }
    // if (!registerType || !selectedState || !selectedFile) {
    //   toast.push(
    //     <Notification title="Error" type="error">
    //       Please fill all fields and select a file
    //     </Notification>
    //   );
    //   return;
    // }

     if (!selectedState) {
      toast.push(
        <Notification title="Error" type="error">
          Please select a state
        </Notification>
      );
      return;
    }

     if (!selectedFile) {
      toast.push(
        <Notification title="Error" type="error">
          Please upload a document
        </Notification>
      );
      return;
    }
    setLoading(prev => ({ ...prev, submit: true }));

    try {
      const formData = new FormData();
      formData.append('register_type', trimmedRegisterType);
      formData.append('state_id', selectedState.value);
      formData.append('document', selectedFile);

      await httpClient.post(endpoints.register.createRegisterOutput(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.push(
        <Notification title="Success" type="success">
          Register output created successfully
        </Notification>
      );

      // Reset form and refresh data
      resetForm();
      setRegisterType('');
      setSelectedState(null);
      setSelectedFile(null);
      setIsDialogOpen(false);
      fetchRegisterOutputs();
    } catch (error) {
      toast.push(
        <Notification title="Error" type="error">
          Failed to create register output
        </Notification>
      );
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const handleDownload = async (register: RegisterOutput) => {
    if (!register.document) return;

    try {
      const response = await httpClient.get(
        endpoints.register.downloadDocumentOutputRegister(register.id),
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
            link.setAttribute('download', `${register.register_type.replace(/\s+/g, '_')}_document.xlsx`);

      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.push(
                      <Notification title="Success" type="success">
                          {register.register_type} template downloaded successfully
                      </Notification>
                  );
    } catch (error) {
      toast.push(
        <Notification title="Error" type="error">
          Failed to download document
        </Notification>
      );
    }
  };


  
  useEffect(() => {
    fetchRegisterOutputs();
  }, [pagination.pageIndex, pagination.pageSize]);

  
 const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, pageIndex: page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination(prev => ({ ...prev, pageSize: size, pageIndex: 1 }));
  };




  return (
        <AdaptableCard className="h-full" bodyClass="h-full">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-4">
                   <h3 className="text-2xl font-bold">Register Output Templates</h3>
                   <div className='flex gap-3'>
                       {/* <Button 
                           size='sm' 
                           variant='solid' 
                           icon={<HiDownload />}
                           onClick={handleDownloadAll}
                           loading={loading}
                       >
                           Download Registers
                       </Button> */}
   
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

      <RegisterOutputTable
        data={registers}
        loading={loading.table}
       onDownload={handleDownload}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

     <Dialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onRequestClose={handleDialogClose}
        width={500}
      >
        <h5 className="mb-4">Add New Register Output</h5>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="register-type">
            Register Type <span className='text-red-500'>*</span>
          </label>
          <Input
  value={registerType}
   onChange={(e) => {
              // Prevent leading spaces
              const value = e.target.value;
              if (value !== ' ' && !(value.endsWith(' ') && registerType.endsWith(' '))) {
                setRegisterType(value);
              }
            }} // Note the e.target.value
  placeholder="Enter register type"
  required
/>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="state-select">
            State <span className='text-red-500'>*</span>
          </label>
          <Select
            id="state-select"
            options={states}
            value={selectedState}
            onChange={setSelectedState}
            placeholder="Select state"
            isLoading={loading.states}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1" htmlFor="register-document">
            Document (Excel file) <span className='text-red-500'>*</span>
          </label>
          <Input
            type="file"
            id="register-document"
            onChange={handleFileChange}
             accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="plain"
            onClick={handleDialogClose}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            onClick={handleSubmit}
            loading={loading.submit}
            disabled={!registerType || !selectedState || !selectedFile}
          >
            Submit
          </Button>
        </div>
      </Dialog>
    </AdaptableCard>
  );
};

export default RegisterOutputTemplate;