import React from 'react'
import AdaptableCard from '@/components/shared/AdaptableCard'
import ComplianceTable from './components/ComplianceTable'
import ComplianceTool from './components/ComplianceTool'
const Compliance = () => {
  return (
     <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold"> Compliances</h3>
                   
                </div>
                <ComplianceTool />
      </div>
      <div className='mb-8'>
      </div>
    <ComplianceTable/>
 </AdaptableCard>
  )
}

export default Compliance