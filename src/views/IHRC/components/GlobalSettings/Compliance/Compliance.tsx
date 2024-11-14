import React, { useState } from 'react'
import AdaptableCard from '@/components/shared/AdaptableCard'
import ComplianceTable from './components/ComplianceTable'
import ComplianceTool from './components/ComplianceTool'
const Compliance = () => {

  const [key, setKey] = useState(0);
const refreshData = () => {
  setKey(prev => prev + 1);
};


  return (
     <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold"> Compliances</h3>
                   
                   
                </div>
                <ComplianceTool refreshData={refreshData} />
      </div>
      <div className='mb-8'>
      </div>
    <ComplianceTable key={key}/>
 </AdaptableCard>
  )
}

export default Compliance