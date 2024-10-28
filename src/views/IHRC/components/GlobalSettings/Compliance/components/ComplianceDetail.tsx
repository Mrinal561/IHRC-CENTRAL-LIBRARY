import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card } from '@/components/ui';
import { IoArrowBack } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';

const ComplianceDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const compliance = location.state;

  const details = [
    { label: 'Compliance ID', value: compliance?.Compliance_Id },
    { label: 'Legislation', value: compliance?.Legislation },
    { label: 'Location', value: compliance?.Location },
    { label: 'Header', value: compliance?.Compliance_Header },
    { label: 'Description', value: compliance?.Compliance_Description },
    { label: 'Categorization', value: compliance?.Compliance_Categorization },
    { label: 'Type', value: compliance?.Compliance_Type },
    { label: 'Frequency', value: compliance?.Compliance_Frequency },
    { label: 'Statutory Authority', value: compliance?.Compliance_Statutory_Authority },
    { label: 'Criticality', value: compliance?.Criticality },
    { label: 'Penalty Type', value: compliance?.Penalty_Type },
    { label: 'Penalty Description', value: compliance?.Penalty_Description },
    { label: 'Due Date', value: compliance?.Due_Date },
    { label: 'Scheduled Frequency', value: compliance?.Scheduled_Frequency },
    { label: 'Proof Required', value: compliance?.Proof_Of_Compliance_Mandatory },
    { label: 'Approval Required', value: compliance?.Approval_Required },
    { label: 'Bare Act Text', value: compliance?.Bare_Act_Text },
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="plain"
              icon={<IoArrowBack />}
              onClick={() => navigate(-1)}
            />
            <h1 className="text-2xl font-semibold">Compliance Details</h1>
          </div>
          <Button
            size="sm"
            icon={<MdEdit />}
            onClick={() => navigate(`/app/compliance/edit/${compliance?.Compliance_Id}`, {
              state: compliance
            })}
          >
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {details.map((detail, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm text-gray-500">{detail.label}</p>
              <p className="font-medium break-words">
                {detail.value || 'Not specified'}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Status</p>
            <div className="font-medium">
              <span className={`
                px-3 py-1 rounded-full text-sm
                ${compliance?.Compliance_Status === 'Approved' ? 'bg-green-100 text-green-800' : ''}
                ${compliance?.Compliance_Status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${compliance?.Compliance_Status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
              `}>
                {compliance?.Compliance_Status || 'Not specified'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ComplianceDetail;