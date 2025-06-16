import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Notification, toast } from '@/components/ui';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
import ComplianceAddForm from './ComplianceAddForm';
import { ComplianceData, ComplianceFormData } from '@/@types/compliance';

interface LocationState {
  complianceSetupId: number;
}

const EditComplianceForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [complianceData, setComplianceData] = useState<ComplianceFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplianceData = async () => {
      try {
        const state = location.state as LocationState;
        if (!state?.complianceSetupId) {
          throw new Error('No compliance ID provided');
        }

        const response = await httpClient.get<ComplianceData>(
          endpoints.compliances.updatecompliance(state.complianceSetupId.toString())
        );
        
        // Transform API data (ComplianceData) to form data (ComplianceFormData)
        const transformedData: ComplianceFormData = {
          ...response.data,
          scope: response.data.applicable, // Map 'applicable' to 'scope'
          due_dates: response.data.due_dates || {}
        };
        
        setComplianceData(transformedData);
      } catch (error) {
        toast.push(
          <Notification title="Error" type="error">
            Failed to load compliance data
          </Notification>
        );
        navigate('/auditSetup');
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceData();
  }, [location.state, navigate]);

  const handleSubmit = async (formData: ComplianceFormData) => {
    try {
      if (!complianceData?.id) return;
      
      // Transform back to API expected format
      const apiData = {
        ...formData,
        applicable: formData.scope, // Map 'scope' back to 'applicable'
        state_id: formData.scope === 'state' ? Number(formData.state_id) : null
      };

      await httpClient.put(
        endpoints.compliances.updatecompliance(complianceData.id.toString()),
        apiData
      );
      
      toast.push(
        <Notification title="Success" type="success">
          Compliance updated successfully
        </Notification>
      );
      navigate('/auditSetup');
    } catch (error) {
      toast.push(
        <Notification title="Error" type="error">
          Failed to update compliance
        </Notification>
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!complianceData) return <div>No data found</div>;

  return (
    <ComplianceAddForm 
      initialData={complianceData}
      onSubmit={handleSubmit}
      isEditMode={true}
    />
  );
};

export default EditComplianceForm;