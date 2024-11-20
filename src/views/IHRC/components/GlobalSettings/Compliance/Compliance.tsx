import React, { useEffect, useState } from 'react'
import AdaptableCard from '@/components/shared/AdaptableCard'
import ComplianceTable from './components/ComplianceTable'
import ComplianceTool from './components/ComplianceTool'
import { toast, Notification } from '@/components/ui'
import httpClient from '@/api/http-client'
import { endpoints } from '@/api/endpoint'
const Compliance = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [complianceData, setComplianceData] = useState([]);



  const [key, setKey] = useState(0);
const refreshData = () => {
  setKey(prev => prev + 1);
};

const fetchComplianceData = async (page = 1, pageSize = 10) => {
  setIsLoading(true);

  try {
      const response = await httpClient.get(endpoints.compliances.getAll(), {
          params: {
              page,
              pageSize,
          }
      })

      if (response?.data?.data) {
          console.log('API Response:', response.data)
          console.log('Compliance data received:', response.data.data)
          setComplianceData(response.data.data)
      } else {
          console.log(
              'No data in API response or unexpected response structure',
          )
      }
  }
  catch (error : any){
      console.error('Error fetching compliance data:', error)
      console.error('Error details:', {
          message: error.message,
          stack: error.stack,
      })
      toast.push(
          <Notification type="danger" title="Error">
              Failed to fetch compliance data
          </Notification>,
      )
  } finally {
      setIsLoading(false);
  }
}


useEffect(() => {
  console.log("Initial Compliance Rendering");
  
  fetchComplianceData()
}, [])



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
    <ComplianceTable 
    key={key} 
    complianceData={complianceData}
    isLoading={isLoading}
    onDataChange={fetchComplianceData}

    />

 </AdaptableCard>
  )
}

export default Compliance