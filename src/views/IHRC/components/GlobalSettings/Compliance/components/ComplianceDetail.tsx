import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Badge from '@/components/ui/Badge'
import { Button } from '@/components/ui'
import { IoArrowBack } from 'react-icons/io5'

interface ComplianceData {
    id: number
    uuid: string
    legislation: string
    category: string
    penalty_type: string
    default_due_date: {
        first_date: string
        last_date: string
    }
    scheduled_frequency: string
    proof_mandatory: boolean
    header: string
    description: string
    penalty_description: string
    applicablility: string
    bare_act_text: string
    type: string
    caluse: string
    frequency: string
    statutory_auth: string
    approval_required: boolean
    criticality: string
    created_type: string
    created_at: string
    updated_at: string
}

// const categorizationColor: Record<string, { label: string; dotClass: string; textClass: string }> = {
//   // Default configuration for ALL categories
//   '*': { // <--- Using '*' as a wildcard to match all categories
//     label: (category: string) => category, // Returns the original category label
//     dotClass: 'bg-emerald-500',
//     textClass: 'text-emerald-500',
//   },
// };

const getCategorizationColor = (category: string): { label: string; dotClass: string; textClass: string } => {
  return {
    label: category, // Returns the original category label
    dotClass: 'bg-emerald-500',
    textClass: 'text-emerald-500',
  };
};

const ComplianceDetail = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const compliance = location.state as ComplianceData | undefined

    if (!compliance) {
        return <div>Compliance not found</div>
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    const categoryColor = getCategorizationColor(compliance.category);


    return (
        <AdaptableCard className="p-4">
            <div className="lg:flex items-center gap-2 mb-8">
                <div className='w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#7c828e]/30 hover:text-[#5d6169] hover:rounded-full'>
                    <Button
                        size="sm"
                        variant="plain"
                        icon={<IoArrowBack className="text-[#72828e] hover:text-[#5d6169]" />}
                        onClick={() => navigate(-1)}
                    />
                </div>
                <h3 className="mb-4 lg:mb-0">Compliance Details</h3>
            </div>

            {/* Header Section */}
            <div className="border p-4 rounded-md mb-6">
                <h2 className="text-xl font-semibold mb-2">{compliance.header}</h2>
                <p className="text-sm mb-2"><strong>Legislation:</strong> {compliance.legislation}</p>
                <div className="flex items-center gap-2">
                <Badge className={categoryColor.dotClass} />
                <span className={`capitalize font-semibold ${categoryColor.textClass}`}>
                {compliance.category}
                </span>
              </div>
            </div>

            {/* Description and Bare Act Section */}
            <div className="flex gap-6 mb-6">
                <div className="border p-4 rounded-md w-1/2">
                    <h3 className="text-base font-semibold mb-2">Description</h3>
                    <p className="text-sm">{compliance.description}</p>
                </div>
                <div className="border p-4 rounded-md w-1/2">
                    <h3 className="text-base font-semibold mb-2">Bare Act Text</h3>
                    <p className="text-sm">{compliance.bare_act_text}</p>
                </div>
            </div>

            {/* Compliance Information Section */}
            <div className="border p-4 rounded-md">
                <h3 className="text-xl font-semibold mb-4">Compliance Information</h3>
                <div className="flex gap-6">
                    {/* Left Column */}
                    <div className="w-1/2">
                        <p className="text-sm mb-2"><strong>Compliance ID:</strong> {compliance.id}</p>
                        <p className="text-sm mb-2"><strong>UUID:</strong> {compliance.uuid}</p>
                        <p className="text-sm mb-2"><strong>Penalty Description:</strong> {compliance.penalty_description}</p>
                        <p className="text-sm mb-2"><strong>Applicability:</strong> {compliance.applicablility}</p>
                        <p className="text-sm mb-2"><strong>Clause:</strong> {compliance.caluse}</p>
                        <p className="text-sm mb-2"><strong>Type:</strong> {compliance.type}</p>
                        <p className="text-sm mb-2"><strong>Frequency:</strong> {compliance.frequency}</p>
                        <p className="text-sm mb-2"><strong>Statutory Authority:</strong> {compliance.statutory_auth}</p>
                    </div>
                    {/* Right Column */}
                    <div className="w-1/2">
                        <p className="text-sm mb-2"><strong>Criticality:</strong> {compliance.criticality}</p>
                        <p className="text-sm mb-2"><strong>Penalty Type:</strong> {compliance.penalty_type}</p>
                        <p className="text-sm mb-2"><strong>Default Due Date:</strong> {formatDate(compliance.default_due_date.first_date)} - {formatDate(compliance.default_due_date.last_date)}</p>
                        <p className="text-sm mb-2"><strong>Scheduled Frequency:</strong> {compliance.scheduled_frequency}</p>
                        <p className="text-sm mb-2"><strong>Proof Mandatory:</strong> {compliance.proof_mandatory ? 'Yes' : 'No'}</p>
                        <p className="text-sm mb-2"><strong>Approval Required:</strong> {compliance.approval_required ? 'Yes' : 'No'}</p>
                        <p className="text-sm mb-2"><strong>Created Type:</strong> {compliance.created_type}</p>
                        <p className="text-sm mb-2"><strong>Created At:</strong> {formatDate(compliance.created_at)}</p>
                    </div>
                </div>
            </div>
        </AdaptableCard>
    )
}
export default ComplianceDetail;