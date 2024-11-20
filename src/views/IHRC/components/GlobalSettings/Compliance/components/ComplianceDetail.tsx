import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Badge from '@/components/ui/Badge'
import { Button } from '@/components/ui'
import { IoArrowBack } from 'react-icons/io5'
import { ComplianceData } from '@/@types/compliance'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'


interface StateData {
    id: number;
    name: string;
}


const getCategorizationColor = (scope: string): { label: string; dotClass: string; textClass: string } => {
  return {
    label: scope, // Returns the original category label
    dotClass: 'bg-emerald-500',
    textClass: 'text-emerald-500',
  };
};


const ComplianceDetail = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [stateName, setStateName] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)



    const compliance = location.state as ComplianceData | undefined

    useEffect(() => {
        const fetchStateName = async () => {
            if (compliance?.state_id && compliance.scope === 'state') {
                try {
                    setIsLoading(true)
                    const response = await httpClient.get(endpoints.common.getStatesAll())
                    const states = response.data as StateData[]
                    const state = states.find(state => state.id === compliance.state_id)
                    if (state) {
                        setStateName(state.name)
                    }
                } catch (error) {
                    console.error('Error fetching state details:', error)
                } finally {
                    setIsLoading(false)
                }
            }
        }

        fetchStateName()
    }, [compliance?.state_id])


    if (!compliance) {
        return <div>Compliance not found</div>
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    const scopeColor = getCategorizationColor(compliance.scope);


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
                <h2 className="text-xl font-semibold mb-2">{compliance.legislation}</h2>
                <p className="text-sm mb-2"><strong>Legislation:</strong> {compliance.header}</p>
                <div className="flex items-center gap-2">
                <Badge className={scopeColor.dotClass} />
                <p className={`capitalize font-semibold ${scopeColor.textClass}`}>
                        {compliance.scope}
                        {compliance.scope === 'state' && stateName && (
                            <span> ({stateName})</span>
                        )}
                    </p>
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
                        <p className="text-sm mb-2"><strong>Category:</strong> {compliance.category}</p>
                        {/* <p className="text-sm mb-2"><strong>State:</strong> {compliance.state_id}</p> */}
                        <p className="text-sm mb-2"><strong>Penalty Description:</strong> {compliance.penalty_description}</p>
                        <p className="text-sm mb-2"><strong>Applicability:</strong> {compliance.applicablility}</p>
                        <p className="text-sm mb-2"><strong>Clause:</strong> {compliance.caluse}</p>
                        <p className="text-sm mb-2"><strong>Type:</strong> {compliance.type}</p>
                        <p className="text-sm mb-2"><strong>Frequency:</strong> {compliance.frequency}</p>
                    </div>
                    {/* Right Column */}
                    <div className="w-1/2">
                        <p className="text-sm mb-2"><strong>Statutory Authority:</strong> {compliance.statutory_auth}</p>
                        <p className="text-sm mb-2"><strong>Criticality:</strong> {compliance.criticality}</p>
                        <p className="text-sm mb-2"><strong>Penalty Type:</strong> {compliance.penalty_type}</p>
                        <p className="text-sm mb-2"><strong>Default Due Date:</strong> {formatDate(compliance.default_due_date.first_date)} - {formatDate(compliance.default_due_date.last_date)}</p>
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