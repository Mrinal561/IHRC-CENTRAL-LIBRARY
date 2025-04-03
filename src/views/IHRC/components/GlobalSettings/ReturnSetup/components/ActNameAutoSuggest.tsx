// import React, { useState, useRef, useEffect } from 'react';
// import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";
// import OutlinedInput from '@/components/ui/OutlinedInput';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';

// interface AgreementType {
//   id?: number;
//   agreement_type: string;
//   created_at?: string;
//   updated_at?: string;
// }

// const ActNameAutoSuggest = ({ 
// //   value, 
// //   onChange,
// //   onAgreementTypeSelect,
//   label = "Act Name",
//   placeholder = "Enter Act Name",
// //   isDisabled
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [agreementTypes, setAgreementTypes] = useState<AgreementType[]>([]);
//   const [filteredAgreementTypes, setFilteredAgreementTypes] = useState<AgreementType[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isCreating, setIsCreating] = useState(false);
//   const wrapperRef = useRef<HTMLDivElement>(null);



//   return (
//     <div className="relative" ref={wrapperRef}>
//       <p className="mb-2">{label} <span className="text-red-500">*</span></p>
//       <div 
//         className="relative"
//         // onKeyDown={handleKeyDown}
//         tabIndex={-1}
//       >
//         <OutlinedInput label={placeholder} value={''} onChange={function (value: string): void {
//                   throw new Error('Function not implemented.');
//               } }         
//         />
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           type="button"
//           className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
//         //   disabled={isDisabled || isCreating}
//         >
//           {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
//         </button>
//       </div>

//       {isOpen && (
//         <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
//           {isLoading ? (
//             <div className="p-2 text-gray-500 flex items-center justify-center">
//               <AiOutlineLoading3Quarters className="animate-spin mr-2" />
//               Loading agreement types...
//             </div>
//           ) : filteredAgreementTypes.length > 0 ? (
//             <ul className="max-h-60 overflow-auto">
//               {filteredAgreementTypes.map((agreementType) => (
//                 <li
//                   key={agreementType.id || agreementType.agreement_type}
//                   className="px-4 py-2 cursor-pointer hover:bg-gray-100"
//                 //   onClick={() => handleSelect(agreementType)}
//                 >
//                   {agreementType.agreement_type}
//                 </li>
//               ))}
//             </ul>
//           ) :  (
//             <div 
//               className={`p-2 text-gray-600 ${
//                 isCreating 
//                   ? 'cursor-wait bg-gray-50' 
//                   : 'cursor-pointer hover:bg-gray-100'
//               } flex items-center justify-center`}
//             //   onClick={() => !isCreating && handleCreateAgreementType(value)}
//             >
//               {isCreating ? (
//                 <>
//                   <AiOutlineLoading3Quarters className="animate-spin mr-2" />
//                   Creating agreement type ...
//                 </>
//               ) : (
//                 <>Press Enter to create agreement type </>
//               )}
//             </div>
//           ) }
//         </div>
//       )}
//     </div>
//   );
// };

// export default ActNameAutoSuggest;


import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import OutlinedInput from '@/components/ui/OutlinedInput';

interface ActType {
  id: number;
  act_name: string;
}

const ActNameAutoSuggest = ({ 
  label = "Act Name",
  placeholder = "Enter Act Name",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAct, setSelectedAct] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const dummyActData = [
    { id: 1, act_name: "Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013" },
    { id: 2, act_name: "Employment Exchanges (Compulsory Notification of Vacancies) Act, 1959" },
    { id: 3, act_name: "Payment of Bonus Act 1965" },
    { id: 4, act_name: "Maternity Benefit Act 1961" },
    { id: 5, act_name: "Shops & Commercial Establishment Act" },
    { id: 6, act_name: "Minimum Wages Act, 1948" },
    { id: 7, act_name: "Payment of Wages Act, 1934" },
    { id: 8, act_name: "Employee Compensation Act, 1923" },
    { id: 9, act_name: "Factories Act 1948" },
    { id: 10, act_name: "Combined Returns" },
  ];

  // Filter acts based on search term
  const filteredActs = dummyActData.filter(act => 
    act.act_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle selecting an act
  const handleSelect = (act: ActType) => {
    setSelectedAct(act.act_name);
    setIsOpen(false);
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setSelectedAct(value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  // Handle key presses
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="relative" ref={wrapperRef}>
      <p className="mb-2">{label} <span className="text-red-500">*</span></p>
      <div 
        className="relative"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <OutlinedInput 
          label={placeholder} 
          value={selectedAct}
          onChange={handleInputChange}
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
        >
          {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          {isLoading ? (
            <div className="p-2 text-gray-500 flex items-center justify-center">
              <AiOutlineLoading3Quarters className="animate-spin mr-2" />
              Loading acts...
            </div>
          ) : filteredActs.length > 0 ? (
            <ul className="max-h-60 overflow-auto">
              {filteredActs.map((act) => (
                <li
                  key={act.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect(act)}
                >
                  {act.act_name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2 text-gray-600">
              No acts found. Press Enter to create a new one.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActNameAutoSuggest;