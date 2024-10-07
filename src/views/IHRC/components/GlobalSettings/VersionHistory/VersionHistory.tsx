import React from 'react'
import  AdaptableCard from '@/components/shared/AdaptableCard';
import VersionHistoryTable from './components/VersionHistoryTable';


const VersionHistory = () => {
  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
            {/* <div className="flex items-center justify-between mb-8">
                <h3 className="mb-4 lg:mb-0">Compliance History</h3>
                <HistoryPageTableTool />
            </div> */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">Version History</h3>
                   
                </div>
                {/* <HistoryPageTableTool /> */}
      </div>
      {/* <div className='mb-8'>
        <Company />
      </div> */}
                <VersionHistoryTable />
        </AdaptableCard>
  )
}

export default VersionHistory