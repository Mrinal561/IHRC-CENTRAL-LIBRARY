import React from 'react'
import AdaptableCard from '@/components/shared/AdaptableCard'
import TemplateCards from './components/TemplateCards'
// import CertificateFilter from './CertificateFilter'
// import UploadDownload from './UploadDownload'
const RegisterTemplate = () => {
  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
              <div className="mb-4 lg:mb-0">
                  <h3 className="text-2xl font-bold">Register Templates</h3>
                  {/* <p className="text-gray-600">View your company's Custom compliance</p> */}
              </div>
              {/* <CustomChecklistTool /> */}
              {/* <CertificateFilter/> */}
    </div>
    <TemplateCards />
</AdaptableCard>
  )
}

export default RegisterTemplate