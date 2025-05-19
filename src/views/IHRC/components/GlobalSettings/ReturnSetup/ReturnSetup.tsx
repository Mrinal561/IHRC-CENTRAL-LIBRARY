// import { AdaptableCard } from '@/components/shared'
// import OutlinedInput from '@/components/ui/OutlinedInput'
// import React from 'react'
// import ReturnSetupTool from './components/ReturnSetupTool'
// import ReturnSetupTable from './components/ReturnSetupTable'
// import OutlinedSelect from '@/components/ui/Outlined/Outlined'

// const ReturnSetup = () => {

//     const searchOptions = [
//         { label: 'state', value: 'State' },
//         { label: 'act_name', value: 'Act Name' },
//         { label: 'return_name', value: 'Return Name' },
//         { label: 'applicability', value: 'Applicability' },
//     ]
//   return (
//     <AdaptableCard className='h-full' bodyClass='h-full'>
//     <div className='flex flex-col justify-between gap-8 mb-2'>
//         <div className='mb-4 lg:mb-0 flex justify-between'>
//             <h3 className='text-2xl font-bold'>Return Setup</h3>
//             <div className='flex items-center gap-4'>
//                 <div>

//                 <OutlinedSelect
//                           options={searchOptions} label="Search By" value={undefined} onChange={undefined}                
//                           />
//                           </div>
//                           <div>

//                 <OutlinedInput
//                     label='Search' 
//                     value={''} 
//                     onChange={function (value: string): void {
//                         throw new Error('Function not implemented.')
//                     } }               
//                     />
//                     </div>
//                 <div className="flex-shrink-0">
//                     <ReturnSetupTool />
//                 </div>
//             </div>
//         </div>
//     </div>
//     <div className="mt-6">
//     <ReturnSetupTable />
//     </div>
//     </AdaptableCard>
//   )
// }

// export default ReturnSetup



import { AdaptableCard } from '@/components/shared'
import OutlinedInput from '@/components/ui/OutlinedInput'
import React, { CSSProperties } from 'react'
import ReturnSetupTool from './components/ReturnSetupTool'
import ReturnSetupTable from './components/ReturnSetupTable'
import OutlinedSelect from '@/components/ui/Outlined/Outlined'

const ReturnSetup = () => {
    const searchOptions = [
        { label: 'State', value: 'state' },
        { label: 'Act Name', value: 'act_name' },
        { label: 'Return Name', value: 'return_name' },
        { label: 'Applicability', value: 'applicability' },
    ]
    
    // Using CSSProperties type for proper TypeScript compatibility
    const selectStyles: CSSProperties = {
        position: 'relative',
        zIndex: 50 // Higher z-index to ensure dropdown appears above other elements
    }
    
    return (
        <AdaptableCard className='h-full' bodyClass='h-full'>
            <div className='flex flex-col justify-between gap-8 mb-2'>
                <div className='mb-4 lg:mb-0 flex justify-between'>
                    <h3 className='text-2xl font-bold'>Return Setup</h3>
                    <div className='flex items-center gap-4'>
                        <div style={selectStyles} className="w-full md:w-48">
                            <OutlinedSelect
                                options={searchOptions} 
                                label="Search By" 
                                value={undefined} 
                                onChange={undefined}
                            />
                        </div>
                        <div className="w-full md:w-64 relative">
                            <OutlinedInput
                                label='Search' 
                                value={''} 
                                onChange={function (value: string): void {
                                    throw new Error('Function not implemented.')
                                }}
                            />
                        </div>
                        <div className="flex-shrink-0">
                            <ReturnSetupTool />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6">
                <ReturnSetupTable />
            </div>
        </AdaptableCard>
    )
}

export default ReturnSetup