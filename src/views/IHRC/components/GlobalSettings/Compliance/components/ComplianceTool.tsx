import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiDownload, HiPlusCircle } from 'react-icons/hi'
import { Button, toast, Notification } from '@/components/ui'
import BulkUpload from './BulkUpload';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';


const ComplianceTool = ({refreshData}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [complianceData, setComplianceData] = useState([]);
    const [tableKey, setTableKey] = useState(0);



    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/add-compliance-form'); // Adjust the path as needed
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

    const refreshComplianceTable = () => {
        fetchComplianceData()
        // setTableKey((prevKey) => prevKey + 1)
    }

    useEffect(() => {
        console.log("Initial Compliance Rendering");
        
        fetchComplianceData()
    }, [])

    return (
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
            <BulkUpload 
            refreshTable = {refreshData}
            />
            <div className="block lg:inline-block md:mb-0 mb-4 ml-2">
            <Button
            block
            variant="solid"
            size="sm"
            icon={<HiPlusCircle />}
            onClick={handleClick}
        >
           Add Compliance
           
        </Button>
            </div>
        </div>
    )
}

export default ComplianceTool
