// // // import React, { useState } from 'react';
// // // import { Button, Dialog } from '@/components/ui';
// // // import { HiPlusCircle } from 'react-icons/hi';
// // // import { AdaptableCard } from '@/components/shared';
// // // import OutlinedInput from '@/components/ui/OutlinedInput';
// // // import ExternalUserTable from './components/ExternalUserTable';
// // // import ExternalUserUpload from './components/ExternalUserUpload';

// // // // External User Form Component
// // // const ExternalUserForm = ({ onClose, onSubmit }) => {
// // //   const [formData, setFormData] = useState({
// // //     email: '',
// // //     phoneNo: '',
// // //     company: '',
// // //     username: ''
// // //   });

// // //   const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     setFormData(prev => ({
// // //       ...prev,
// // //       [field]: e.target.value
// // //     }));
// // //   };

// // //   const handleSubmit = (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     onSubmit(formData);
// // //     onClose();
// // //   };

// // //   return (
// // //     <form onSubmit={handleSubmit} className="p-4">
// // //       <h4 className="mb-4">Add External User</h4>
// // //       <div className="space-y-4">
// // //         <div>
// // //         <label className="block mb-2 font-medium">
// // //             Username
// // //           </label>
// // //           <OutlinedInput
// // //             label="Username"
// // //             value={formData.username}
// // //             onChange={handleInputChange('username')}
// // //           />
// // //         </div>
// // //         <div>
// // //         <label className="block mb-2 font-medium">
// // //         Email
// // //           </label>
// // //           <OutlinedInput
// // //             label="Email"
// // //             value={formData.email}
// // //             onChange={handleInputChange('email')}
// // //           />
// // //         </div>
// // //         <div>
// // //         <label className="block mb-2 font-medium">
// // //         Phone Number
// // //           </label>
// // //           <OutlinedInput
// // //             label="Phone Number"
// // //             value={formData.phoneNo}
// // //             onChange={handleInputChange('phoneNo')}
// // //           />
// // //         </div>
// // //         <div>
// // //         <label className="block mb-2 font-medium">
// // //         Company
// // //           </label>
// // //           <OutlinedInput
// // //             label="Company"
// // //             value={formData.company}
// // //             onChange={handleInputChange('company')}
// // //           />
// // //         </div>
// // //         <div className="flex justify-end space-x-2 mt-6">
// // //           <Button variant="plain" onClick={onClose}>
// // //             Cancel
// // //           </Button>
// // //           <Button variant="solid" type="submit">
// // //             Submit
// // //           </Button>
// // //         </div>
// // //       </div>
// // //     </form>
// // //   );
// // // };

// // // // Main External User Component
// // // const ExternalUser = () => {
// // //   const [isDialogOpen, setIsDialogOpen] = useState(false);

// // //   const handleAddUser = (userData) => {
// // //     console.log('New user data:', userData);
// // //     // Handle the submission logic here
// // //   };

// // //   return (
// // //     <AdaptableCard className="h-full" bodyClass="h-full">
// // //       <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
// // //         <div className="mb-4 lg:mb-0">
// // //           <h3 className="text-2xl font-bold">
// // //             External User
// // //           </h3>
// // //         </div>
// // //         <Button
// // //           variant="solid"
// // //           size="sm"
// // //           icon={<HiPlusCircle />}
// // //           onClick={() => setIsDialogOpen(true)}
// // //         >
// // //           Add External User
// // //         </Button>
// // //       </div>

// // //       <Dialog
// // //         isOpen={isDialogOpen}
// // //         onClose={() => setIsDialogOpen(false)}
// // //         onRequestClose={() => setIsDialogOpen(false)}
// // //         width={500}
// // //         height={480}
// // //       >
// // //       </Dialog>
// // //       <ExternalUserTable></ExternalUserTable>
// // //     </AdaptableCard>
// // //   );
// // // };

// // // export default ExternalUser;

// // // import React, { useState } from 'react';
// // // import { Button, Dialog } from '@/components/ui';
// // // import { HiPlusCircle } from 'react-icons/hi';
// // // import { AdaptableCard } from '@/components/shared';
// // // import ExternalUserTable from './components/ExternalUserTable';
// // // import ExternalUserUpload from './components/ExternalUserUpload';

// // // const ExternalUser = () => {
// // //   const [isDialogOpen, setIsDialogOpen] = useState(false);

// // //   const handleUploadConfirm = () => {
// // //     setIsDialogOpen(false);
// // //     // Refresh the table or perform any necessary updates
// // //   };

// // //   return (
// // //     <AdaptableCard className="h-full" bodyClass="h-full">
// // //     <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
// // //       <div className="mb-4 lg:mb-0">
// // //         <h3 className="text-2xl font-bold">
// // //           External User
// // //         </h3>
// // //       </div>
// // //       <ExternalUserUpload onUploadConfirm={handleUploadConfirm} />
// // //     </div>
    
// // //     <ExternalUserTable />
// // //   </AdaptableCard>
// // //   );
// // // };

// // // export default ExternalUser;

// // import React, { useEffect, useState } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { Button, Dialog } from '@/components/ui';
// // import { HiPlusCircle } from 'react-icons/hi';
// // import { AdaptableCard } from '@/components/shared';
// // import ExternalUserTable from './components/ExternalUserTable';
// // import ExternalUserUpload from './components/ExternalUserUpload';
// // import { RootState } from '@/store';
// // import { fetchExternalUsers } from '@/store/slices/externaluser/externalUserSlice';
// // // import { fetchExternalUsers } from '../store/externalUserSlice'; // Adjust the import path as needed
// // // import { AppDispatch, RootState } from '../store/store'; // Adjust the import path as needed

// // const ExternalUser = () => {
// //   const dispatch = useDispatch();
// //   const [isDialogOpen, setIsDialogOpen] = useState(false);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const pageSize = 10; // You can make this configurable if needed

// //   // Select data from Redux store
// //   const {
// //     data: users,
// //     paginateData,
// //     loading,
// //     error
// //   } = useSelector((state: RootState) => state.externalUser);

// //   useEffect(() => {
// //     // Fetch data when component mounts and when page changes
// //     dispatch(fetchExternalUsers({ page: currentPage, page_size: pageSize }));
// //   }, [dispatch, currentPage, pageSize]);

// //   const handlePageChange = (newPage: number) => {
// //     setCurrentPage(newPage);
// //   };

// //   const handleUploadConfirm = () => {
// //     setIsDialogOpen(false);
// //     // Refresh the data after upload
// //     dispatch(fetchExternalUsers({ page: currentPage, page_size: pageSize }));
// //   };

// //   return (
// //     <AdaptableCard className="h-full" bodyClass="h-full">
// //       <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
// //         <div className="mb-4 lg:mb-0">
// //           <h3 className="text-2xl font-bold">
// //             External User
// //           </h3>
// //         </div>
// //         <ExternalUserUpload onUploadConfirm={handleUploadConfirm} />
// //       </div>
      
// //       <ExternalUserTable 
// //         data={users}
// //         loading={loading}
// //         error={error}
// //         pagination={{
// //           currentPage,
// //           totalPages: paginateData?.totalPages || 0,
// //           totalResults: paginateData?.totalResults || 0,
// //           pageSize,
// //           onPageChange: handlePageChange
// //         }}
// //       />
// //     </AdaptableCard>
// //   );
// // };

// // export default ExternalUser;

// // import React, { useEffect, useState } from 'react';
// // import { Button, Dialog } from '@/components/ui';
// // import { AdaptableCard } from '@/components/shared';
// // import ExternalUserTable from './components/ExternalUserTable';
// // import ExternalUserUpload from './components/ExternalUserUpload';
// // import { endpoints } from '@/api/endpoint';
// // import httpClient from '@/api/http-client';
// // // import { httpClient } from '@/api/http-client';
// // // import { endpoints } from '@/api/endpoints';

// // interface User {
// //   id: number;
// //   username: string;
// //   email: string;
// //   phoneNo: string;
// //   company: string;
// //   status: string;
// // }

// // interface PaginateData {
// //   totalResults: number;
// //   totalPages: number;
// // }

// // const ExternalUser = () => {
// //   const [users, setUsers] = useState<User[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [paginateData, setPaginateData] = useState<PaginateData>({
// //     totalResults: 0,
// //     totalPages: 0
// //   });
  
// //   const pageSize = 10;

// //   const fetchUsers = async (page: number) => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const { data } = await httpClient.get(endpoints.externaluser.list(), {
// //         params: {
// //           page,
// //           page_size: pageSize,
// //         },
// //       });
      
// //       setUsers(data.data);
// //       setPaginateData({
// //         totalResults: data.paginate_data.totalResults,
// //         totalPages: data.paginate_data.totalPages || 0,
// //       });
// //     } catch (err: any) {
// //       setError(err.response?.data.message || 'Failed to fetch users');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchUsers(currentPage);
// //   }, [currentPage]);

// //   const handlePageChange = (newPage: number) => {
// //     setCurrentPage(newPage);
// //   };

// //   const handleUploadConfirm = () => {
// //     // Refresh the data after upload
// //     fetchUsers(currentPage);
// //   };

// //   return (
// //     <AdaptableCard className="h-full" bodyClass="h-full">
// //       <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
// //         <div className="mb-4 lg:mb-0">
// //           <h3 className="text-2xl font-bold">
// //             External User
// //           </h3>
// //         </div>
// //         <ExternalUserUpload onUploadConfirm={handleUploadConfirm} />
// //       </div>
      
// //       <ExternalUserTable 
// //         data={users}
// //         loading={loading}
// //         pagination={{
// //           currentPage,
// //           totalPages: paginateData.totalPages,
// //           totalResults: paginateData.totalResults,
// //           pageSize,
// //           onPageChange: handlePageChange
// //         }}
// //       />
// //     </AdaptableCard>
// //   );
// // };

// // export default ExternalUser;

// import React, { useEffect, useState } from 'react';
// import { Button, Dialog } from '@/components/ui';
// import { AdaptableCard } from '@/components/shared';
// import ExternalUserTable from './components/ExternalUserTable';
// import ExternalUserUpload from './components/ExternalUserUpload';
// import { endpoints } from '@/api/endpoint';
// import httpClient from '@/api/http-client';

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   phoneNo: string;
//   company: string;
//   status: string;
// }

// interface PaginateData {
//   totalResults: number;
//   totalPages: number;
// }

// interface Pagination {
//   total: number;
//   pageIndex: number;
//   pageSize: number;
// }

// const ExternalUser = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [pagination, setPagination] = useState<Pagination>({
//     total: 0,
//     pageIndex: 1,
//     pageSize: 10,
//   });

//   const fetchUsers = async (page: number, pageSize: number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { data } = await httpClient.get(endpoints.externaluser.list(), {
//         params: {
//           page,
//           page_size: pageSize,
//         },
//       });
      
//       setUsers(data.data);
//       setPagination(prev => ({
//         ...prev,
//         total: data.meta.total,
//       }));
//     } catch (err: any) {
//       setError(err.response?.data.message || 'Failed to fetch users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers(pagination.pageIndex, pagination.pageSize);
//   }, [pagination.pageIndex, pagination.pageSize]);

//   const handlePaginationChange = (page: number) => {
//     setPagination(prev => ({ ...prev, pageIndex: page }));
//   };

//   const handlePageSizeChange = (newPageSize: number) => {
//     setPagination(prev => ({
//       ...prev,
//       pageSize: newPageSize,
//       pageIndex: 1, // Reset to first page when changing page size
//     }));
//   };

//   const handleUploadConfirm = () => {
//     // Refresh the data after upload
//     fetchUsers(pagination.pageIndex, pagination.pageSize);
//   };

//   return (
//     <AdaptableCard className="h-full" bodyClass="h-full">
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
//         <div className="mb-4 lg:mb-0">
//           <h3 className="text-2xl font-bold">
//             External User
//           </h3>
//         </div>
//         <ExternalUserUpload onUploadConfirm={handleUploadConfirm} />
//       </div>
      
//       <ExternalUserTable 
//         data={users}
//         onRefresh={() => fetchUsers(pagination.pageIndex, pagination.pageSize)}
//         loading={loading}
//         pagination={pagination}
//                 onPaginationChange={handlePaginationChange}
//                 onPageSizeChange={handlePageSizeChange}
//       />
//     </AdaptableCard>
//   );
// };

// export default ExternalUser;

// import React, { useCallback, useEffect, useRef, useState } from 'react';
// import { AdaptableCard } from '@/components/shared';
// import ExternalUserTable from './components/ExternalUserTable';
// import ExternalUserUpload from './components/ExternalUserUpload';
// import { endpoints } from '@/api/endpoint';
// import httpClient from '@/api/http-client';

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   company_name: string;
//   contact_number: string;
//   created_at: string;
//   updated_at: string;
// }

// interface Pagination {
//   total: number;
//   pageIndex: number;
//   pageSize: number;
// }

// const ExternalUser = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [pagination, setPagination] = useState<Pagination>({
//     total: 0,
//     pageIndex: 1,
//     pageSize: 10,
//   });

//   // Add a ref to store pagination state
//   const paginationRef = useRef(pagination);
  
//   // Update ref whenever pagination changes
//   useEffect(() => {
//     paginationRef.current = pagination;
//   }, [pagination]);

//   const refreshUsers = useCallback(() => {
//     // Use ref to get most recent pagination state
//     const currentPagination = paginationRef.current;

//     setLoading(true);
//     httpClient.get(endpoints.externaluser.list(), {
//       params: {
//         page: 1, // Reset to first page on refresh
//         page_size: currentPagination.pageSize,
//       },
//     })
//     .then((response) => {
//       setUsers(response.data.data);
//       setPagination(prev => ({
//         ...prev,
//         total: response.data.meta.total,
//         pageIndex: 1 // Reset page index
//       }));
//     })
//     .catch((error) => {
//       setError(error.response?.data.message || 'Failed to fetch users');
//       console.error('Error refreshing users:', error);
//     })
//     .finally(() => {
//       setLoading(false);
//     });
//   }, []); // Empty dependency array since we're using ref

//   const fetchUsers = useCallback(async (page: number, pageSize: number) => {
//     setLoading(true);
//     try {
//       const { data } = await httpClient.get(endpoints.externaluser.list(), {
//         params: {
//           page,
//           page_size: pageSize,
//         },
//       });
      
//       setUsers(data.data);
//       setPagination(prev => ({
//         ...prev,
//         total: data.meta.total,
//       }));
//     } catch (err: any) {
//       setError(err.response?.data.message || 'Failed to fetch users');
//       console.error('Error fetching users:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Initial data fetch
//   useEffect(() => {
//     fetchUsers(pagination.pageIndex, pagination.pageSize);
//   }, [pagination.pageIndex, pagination.pageSize, fetchUsers]);

//   const handlePaginationChange = (page: number) => {
//     setPagination(prev => ({ ...prev, pageIndex: page }));
//   };

//   const handlePageSizeChange = (newPageSize: number) => {
//     setPagination(prev => ({
//       ...prev,
//       pageSize: newPageSize,
//       pageIndex: 1, // Reset to first page when changing page size
//     }));
//   };

//   const handleUploadSuccess = () => {
//     refreshUsers(); // Refresh the data after successful upload
//   };

//   if (error) {
//     // You might want to add a proper error component here
//     return (
//       <div className="text-red-500 p-4">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <AdaptableCard className="h-full" bodyClass="h-full">
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
//         <div className="mb-4 lg:mb-0">
//           <h3 className="text-2xl font-bold">
//             External User
//           </h3>
//         </div>
//         <ExternalUserUpload onUploadConfirm={handleUploadSuccess} />
//       </div>
      
//       <ExternalUserTable 
//         data={users}
//         onRefresh={refreshUsers}
//         loading={loading}
//         pagination={pagination}
//         onPaginationChange={handlePaginationChange}
//         onPageSizeChange={handlePageSizeChange}
//       />

//       {/* You might want to add a loading indicator here */}
//       {/* {loading && (
//         <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//         </div>
//       )} */}
//     </AdaptableCard>
//   );
// };

// export default ExternalUser;


import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AdaptableCard } from '@/components/shared';
import ExternalUserTable from './components/ExternalUserTable';
import ExternalUserUpload from './components/ExternalUserUpload';
import { endpoints } from '@/api/endpoint';
import httpClient from '@/api/http-client';

interface User {
  id: number;
  name: string;
  email: string;
  company_name: string;
  contact_number: string;
  created_at: string;
  updated_at: string;
}

interface Pagination {
  total: number;
  pageIndex: number;
  pageSize: number;
}

const ExternalUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  });

  const paginationRef = useRef(pagination);
  
  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  const fetchUsers = useCallback(async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const { data } = await httpClient.get(endpoints.externaluser.list(), {
        params: {
          page,
          page_size: pageSize,
        },
      });
      
      setUsers(data.data);
      setPagination(prev => ({
        ...prev,
        total: data.meta.total,
        // If the current page is empty and it's not the first page, go to previous page
        pageIndex: data.data.length === 0 && page > 1 ? page - 1 : page
      }));

      // If current page is empty and it's not the first page, fetch the previous page
      if (data.data.length === 0 && page > 1) {
        fetchUsers(page - 1, pageSize);
      }
    } catch (err: any) {
      setError(err.response?.data.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchUsers(pagination.pageIndex, pagination.pageSize);
  }, [pagination.pageIndex, pagination.pageSize, fetchUsers]);

  const handlePaginationChange = (page: number) => {
    setPagination(prev => ({ ...prev, pageIndex: page }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize: newPageSize,
      pageIndex: 1,
    }));
  };

  const handleDeleteSuccess = () => {
    // Recalculate total pages
    const totalPages = Math.ceil((pagination.total - 1) / pagination.pageSize);
    
    // If we're on the last page and it will be empty after deletion
    if (pagination.pageIndex > totalPages) {
      // Go to previous page
      handlePaginationChange(pagination.pageIndex - 1);
    } else {
      // Refresh current page
      fetchUsers(pagination.pageIndex, pagination.pageSize);
    }
  };

  const handleUploadSuccess = () => {
    fetchUsers(pagination.pageIndex, pagination.pageSize);
  };

//   if (error) {
//     return (
//       <div className="text-red-500 p-4">
//         Error: {error}
//       </div>
//     );
//   }

  return (
    <AdaptableCard className="h-full" bodyClass="h-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10">
        <div className="mb-4 lg:mb-0">
          <h3 className="text-2xl font-bold">
            External User
          </h3>
        </div>
        <ExternalUserUpload onUploadConfirm={handleUploadSuccess} />
      </div>
      
      <ExternalUserTable 
        data={users}
        onRefresh={fetchUsers}
        loading={loading}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
        onPageSizeChange={handlePageSizeChange}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </AdaptableCard>
  );
};

export default ExternalUser;