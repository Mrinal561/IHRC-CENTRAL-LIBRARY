import React from 'react'
import { HiOutlineViewGrid } from 'react-icons/hi'


const Home = () => {
  return (
    <>
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
                <div className="mb-4 lg:mb-0">
                    <h3 className="text-2xl font-bold">DASHBOARD</h3>
                    {/* <p className="text-gray-600">View your statistics</p> */}
                </div>

            </div>
                <div className="flex flex-col items-center justify-center h-full text-gray-500 border rounded-xl">
                <HiOutlineViewGrid className="w-12 h-12 mb-4 text-gray-300" />
                <p className="text-center">
        Still in Development Phase
                </p>
      </div>
   
    </>
  )
}

export default Home