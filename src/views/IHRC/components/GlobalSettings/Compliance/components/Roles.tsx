
//     import React, { useState, useMemo, useEffect } from 'react';
//     import { ColumnDef } from '@/components/shared/DataTable';
//     import DataTable from '@/components/shared/DataTable';
//     import { Button, Tooltip, Dialog, Input, Select, Badge } from '@/components/ui';
//     import { MdEdit } from 'react-icons/md';
//     import { FiTrash } from 'react-icons/fi';
//     import { HiOutlinePlusCircle, HiPlusCircle } from 'react-icons/hi';
// import OutlinedInput from '@/components/ui/OutlinedInput';
// import httpClient from '@/api/http-client';
// import { endpoints } from '@/api/endpoint';
    
//     interface Role {
//       id: string;
//       name: string;
//       description: string;
//       accessedModules: string[];
//     }
    
//     interface Module {
//       value: string;
//       label: string;
//       color?: string;
//     }
    
//     const Roles = () => {
//       // Predefined modules
//       const moduleOptions: Module[] = [
//         { value: '1', label: 'View', color: '#00B8D9' },
//         { value: '2', label: 'Add', color: '#0052CC' },
//         { value: '3', label: 'Edit', color: '#5243AA' },
//         { value: '4', label: 'Delete', color: '#FF5630' },
//       ];
    
//       const [roles, setRoles] = useState<Role[]>([
//         { id: '1', name: 'CEO', description: 'Chief Executive Officer', accessedModules: ['1', '2', '3', '4', '5'] },
//         { id: '2', name: 'Manager', description: 'Department Manager', accessedModules: ['1', '2', '3'] },
//         { id: '3', name: 'HR Specialist', description: 'Human Resources Specialist', accessedModules: ['4', '3'] },
//         { id: '4', name: 'Developer', description: 'Software Developer', accessedModules: ['1', '3'] }
//       ]);
    
//       const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
//       const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
//       const [isModifyAccessDialogOpen, setIsModifyAccessDialogOpen] = useState(false);
//       const [currentRole, setCurrentRole] = useState<Role>({ id: '', name: '', description: '', accessedModules: [] });
//       const [selectedModules, setSelectedModules] = useState<Module[]>([]);
    

//       useEffect(() => {
//         const deleteTracker = async () => {
//           try {
//             const { data } = await httpClient.get(endpoints.role.list());
            
//             // Update state to reflect successful deletion
//             // setIsDeleted(true);
            
//             // Optional: Log the response data
//             console.log('Deletion response:', data);
//           } catch (error) {
//             // Handle and set any errors
//             console.error('Error deleting tracker:', error);
//             // setError(error);
//           }
//         };
    
//         // Call the delete function when the component mounts
//         deleteTracker();
//       }, []);
//       const handleAddRole = () => {
//         const newRole = {
//           id: (roles.length + 1).toString(),
//           name: currentRole.name,
//           description: currentRole.description,
//           accessedModules: []
//         };
//         setRoles([...roles, newRole]);
//         setCurrentRole({ id: '', name: '', description: '', accessedModules: [] });
//         setIsAddRoleDialogOpen(false);
//       };
    
//       const handleEditRole = () => {
//         const updatedRoles = roles.map(role => 
//           role.id === currentRole.id ? currentRole : role
//         );
//         setRoles(updatedRoles);
//         setIsEditRoleDialogOpen(false);
//       };
    
//       const handleDeleteRole = (id: string) => {
//         const updatedRoles = roles.filter(role => role.id !== id);
//         setRoles(updatedRoles);
//       };
    
//       const handleOpenModifyAccess = (role: Role) => {
//         const currentRoleModules = role.accessedModules.map(
//           moduleId => moduleOptions.find(m => m.value === moduleId)
//         ).filter(Boolean) as Module[];
    
//         setCurrentRole(role);
//         setSelectedModules(currentRoleModules);
//         setIsModifyAccessDialogOpen(true);
//       };
    
//       const handleUpdateModuleAccess = () => {
//         const updatedRoles = roles.map(role =>
//           role.id === currentRole.id
//             ? { ...role, accessedModules: selectedModules.map(m => m.value) }
//             : role
//         );
//         setRoles(updatedRoles);
//         setIsModifyAccessDialogOpen(false);
//       };
    
//       const columns: ColumnDef<Role>[] = useMemo(
//         () => [
//           {
//             header: 'Role Name',
//             accessorKey: 'name',
//             cell: (props) => (
//               <Tooltip title={props.getValue() as string}>
//                 <div className="w-32 truncate">{props.getValue()}</div>
//               </Tooltip>
//             ),
//           },
//           {
//             header: 'Description',
//             accessorKey: 'description',
//             cell: (props) => (
//               <Tooltip title={props.getValue() as string}>
//                 <div className="w-48 truncate">{props.getValue()}</div>
//               </Tooltip>
//             ),
//           },
//           {
//             header: 'Permissions',
//             accessorKey: 'accessedModules',
//             cell: (props) => {
//               const moduleIds = props.getValue() as string[];
//               const modules = moduleIds
//                 .map(id => moduleOptions.find(m => m.value === id))
//                 .filter(Boolean);
    
//               return (
//                 <div className="flex flex-wrap gap-2">
//                   {modules.map((module, index) => (
//                     <Badge
//                       key={index}
//                       className="text-xs text-white bg-sky-600"
//                       content={module?.label}
//                     />
//                   ))}
//                 </div>
//               );
//             },
//           },
//           {
//             header: 'Actions',
//             id: 'actions',
//             cell: ({ row }) => (
//               <div className="flex gap-2">
//                 <Tooltip title="Edit Role">
//                   <Button
//                     size="sm"
//                     icon={<MdEdit />}
//                     onClick={() => {
//                       setCurrentRole(row.original);
//                       setIsEditRoleDialogOpen(true);
//                     }}
//                   />
//                 </Tooltip>
//                 <Tooltip title="Modify Access">
//                   <Button
//                     size="sm"
//                     icon={<HiOutlinePlusCircle />}
//                     onClick={() => handleOpenModifyAccess(row.original)}
//                   >
//                   </Button>
//                 </Tooltip>
//                 <Tooltip title="Delete Role">
//                   <Button
//                     size="sm"
//                     color="red"
//                      className="text-red-500"
//                     icon={<FiTrash />}
//                     onClick={() => handleDeleteRole(row.original.id)}
//                   />
//                 </Tooltip>
//               </div>
//             ),
//           },
//         ],
//         [moduleOptions]
//       );
    
//       return (
//         <div className="p-8">
//           <div className="flex justify-between items-center mb-12">
//             <h3 className="text-2xl font-bold">Roles Management</h3>
//             <Button
//               size="sm"
//               variant="solid"
//               icon={<HiPlusCircle />}
//               onClick={() => {
//                 setCurrentRole({ id: '', name: '', description: '', accessedModules: [] });
//                 setIsAddRoleDialogOpen(true);
//               }}
//             >
//               Add Role
//             </Button>
//           </div>
    
//           <DataTable
//             columns={columns}
//             data={roles}
//             pagingData={{
//               total: roles.length,
//               pageIndex: 1,
//               pageSize: 10,
//             }}
//           />
    
//           {/* Add Role Dialog */}
//           <Dialog
//   height={250}
//   isOpen={isAddRoleDialogOpen}
//   onClose={() => setIsAddRoleDialogOpen(false)}
// >
//   <h5 className='mb-4'>Add Roles</h5>
//   <div className="space-y-4">
//     <OutlinedInput
//       label="Role Name"
//       value={currentRole.name}
//       onChange={(value: string) => setCurrentRole(prev => ({ ...prev, name: value }))}
//     />
//     <OutlinedInput
//       label="Description"
//       value={currentRole.description}
//       onChange={(value: string) => setCurrentRole(prev => ({ ...prev, description: value }))}
//     />
//     <div className="flex justify-end space-x-2 mt-4">
//       <Button 
//         size="sm"
//         variant="solid" 
//         onClick={() => setIsAddRoleDialogOpen(false)}
//       >
//         Cancel
//       </Button>
//       <Button 
//         size="sm"
//         variant="solid" 
//         onClick={handleAddRole}
//         disabled={!currentRole.name}
//       >
//        Confirm
//       </Button>
//     </div>
//   </div>
// </Dialog>
    
//           {/* Edit Role Dialog */}
//           <Dialog
//   isOpen={isEditRoleDialogOpen}
//   onClose={() => setIsEditRoleDialogOpen(false)}
// >
// <h5 className='mb-4'>Edit Roles</h5>
//   <div className="space-y-4">
//     <OutlinedInput
//       label="Role Name"
//       value={currentRole.name}
//       onChange={(value: string) => setCurrentRole(prev => ({ ...prev, name: value }))}
//     />
//     <OutlinedInput
//       label="Description"
//       value={currentRole.description}
//       onChange={(value: string) => setCurrentRole(prev => ({ ...prev, description: value }))}
//     />
//     <div className="flex justify-end space-x-2 mt-4">
//       <Button 
//         size="sm"
//         variant="solid" 
//         onClick={() => setIsEditRoleDialogOpen(false)}
//       >
//         Cancel
//       </Button>
//       <Button 
//         size="sm"
//         variant="solid" 
//         onClick={handleEditRole}
//         disabled={!currentRole.name}
//       >Confirm
//       </Button>
//     </div>
//   </div>
// </Dialog>
    
//           {/* Modify Module Access Dialog */}
//           <Dialog
//             isOpen={isModifyAccessDialogOpen}
//             onClose={() => setIsModifyAccessDialogOpen(false)}
//           >
//             <div className="space-y-4">
//               <div className="font-semibold">Role: {currentRole.name}</div>
//               <Select
//                 isMulti
//                 placeholder="Select Modules"
//                 value={selectedModules}
//                 options={moduleOptions}
//                 onChange={(selectedOptions: Module[]) => setSelectedModules(selectedOptions)}
//               />
//               <div className="flex justify-end space-x-2 mt-4">
//                 <Button 
//                   size="sm"
//                   variant="solid" 
//                   onClick={() => setIsModifyAccessDialogOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button 
//                   size="sm"
//                   variant="solid" 
//                   onClick={handleUpdateModuleAccess}
//                 >
//                   Update Access
//                 </Button>
//               </div>
//             </div>
//           </Dialog>
//         </div>
//       );
//     };
    
//     export default Roles;

// import React, { useState, useMemo } from 'react';
// import { ColumnDef } from '@/components/shared/DataTable';
// import DataTable from '@/components/shared/DataTable';
// import { Button, Tooltip, Dialog, Input, Select, Badge, Checkbox } from '@/components/ui';
// import { MdEdit } from 'react-icons/md';
// import { FiTrash } from 'react-icons/fi';
// import { HiOutlinePlusCircle, HiPlusCircle } from 'react-icons/hi';
// import OutlinedInput from '@/components/ui/OutlinedInput';

// interface Role {
//   id: string;
//   name: string;
//   description: string;
//   accessedModules: string[];
//   isListing: boolean;
//   isEdit: boolean;
//   isDelete: boolean;
//   isCreate: boolean;
// }

// interface Module {
//   value: string;
//   label: string;
//   color?: string;
// }

// const Roles = () => {
//   // Predefined modules
//   const moduleOptions: Module[] = [
//     { value: '1', label: 'View', color: '#00B8D9' },
//     { value: '2', label: 'Add', color: '#0052CC' },
//     { value: '3', label: 'Edit', color: '#5243AA' },
//     { value: '4', label: 'Delete', color: '#FF5630' },
//   ];

//   const [roles, setRoles] = useState<Role[]>([
//     { id: '1', name: 'CEO', description: 'Chief Executive Officer', accessedModules: ['1', '2', '3', '4', '5'], isListing: false, isEdit: false, isDelete: false, isCreate: false },
//     { id: '2', name: 'Manager', description: 'Department Manager', accessedModules: ['1', '2', '3'], isListing: false, isEdit: false, isDelete: false, isCreate: false },
//     { id: '3', name: 'HR Specialist', description: 'Human Resources Specialist', accessedModules: ['4', '3'], isListing: false, isEdit: false, isDelete: false, isCreate: false },
//     { id: '4', name: 'Developer', description: 'Software Developer', accessedModules: ['1', '3'], isListing: false, isEdit: false, isDelete: false, isCreate: false }
//   ]);

//   const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
//   const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
//   const [isModifyAccessDialogOpen, setIsModifyAccessDialogOpen] = useState(false);
//   const [currentRole, setCurrentRole] = useState<Role>({ id: '', name: '', description: '', accessedModules: [], isListing: false, isEdit: false, isDelete: false, isCreate: false });
//   const [selectedModules, setSelectedModules] = useState<Module[]>([]);

//   const handleAddRole = () => {
//     const newRole = {
//       id: (roles.length + 1).toString(),
//       name: currentRole.name,
//       description: currentRole.description,
//       accessedModules: [],
//       isListing: currentRole.isListing,
//       isEdit: currentRole.isEdit,
//       isDelete: currentRole.isDelete,
//       isCreate: currentRole.isCreate
//     };
//     setRoles([...roles, newRole]);
//     setCurrentRole({ id: '', name: '', description: '', accessedModules: [], isListing: false, isEdit: false, isDelete: false, isCreate: false });
//     setIsAddRoleDialogOpen(false);
//   };

//   const handleEditRole = () => {
//     const updatedRoles = roles.map(role => 
//       role.id === currentRole.id ? currentRole : role
//     );
//     setRoles(updatedRoles);
//     setIsEditRoleDialogOpen(false);
//   };

//   const handleDeleteRole = (id: string) => {
//     const updatedRoles = roles.filter(role => role.id !== id);
//     setRoles(updatedRoles);
//   };

//   const handleOpenModifyAccess = (role: Role) => {
//     const currentRoleModules = role.accessedModules.map(
//       moduleId => moduleOptions.find(m => m.value === moduleId)
//     ).filter(Boolean) as Module[];

//     setCurrentRole(role);
//     setSelectedModules(currentRoleModules);
//     setIsModifyAccessDialogOpen(true);
//   };

//   const handleUpdateModuleAccess = () => {
//     const updatedRoles = roles.map(role =>
//       role.id === currentRole.id
//         ? { ...role, accessedModules: selectedModules.map(m => m.value) }
//         : role
//     );
//     setRoles(updatedRoles);
//     setIsModifyAccessDialogOpen(false);
//   };

//   const columns: ColumnDef<Role>[] = useMemo(
//     () => [
//       {
//         header: 'Role Name',
//         accessorKey: 'name',
//         cell: (props) => (
//           <Tooltip title={props.getValue() as string}>
//             <div className="w-32 truncate">{props.getValue()}</div>
//           </Tooltip>
//         ),
//       },
//       // {
//       //   header: 'Description',
//       //   accessorKey: 'description',
//       //   cell: (props) => (
//       //     <Tooltip title={props.getValue() as string}>
//       //       <div className="w-48 truncate">{props.getValue()}</div>
//       //     </Tooltip>
//       //   ),
//       // },
//       {
//         header: 'View',
//         accessorKey: 'isListing',
//         cell: (props) => (
//           <Checkbox
//             checked={props.getValue() as boolean}
//             onChange={(value) => {
//               const updatedRoles = roles.map(role =>
//                 role.id === props.row.original.id
//                   ? { ...role, isListing: value }
//                   : role
//               );
//               setRoles(updatedRoles);
//             }}
//           />
//         )
//       },
//       {
//         header: 'Edit',
//         accessorKey: 'isEdit',
//         cell: (props) => (
//           <Checkbox
//             checked={props.getValue() as boolean}
//             onChange={(value) => {
//               const updatedRoles = roles.map(role =>
//                 role.id === props.row.original.id
//                   ? { ...role, isEdit: value }
//                   : role
//               );
//               setRoles(updatedRoles);
//             }}
//           />
//         )
//       },
//       {
//         header: 'Delete',
//         accessorKey: 'isDelete',
//         cell: (props) => (
//           <Checkbox
//             checked={props.getValue() as boolean}
//             onChange={(value) => {
//               const updatedRoles = roles.map(role =>
//                 role.id === props.row.original.id
//                   ? { ...role, isDelete: value }
//                   : role
//               );
//               setRoles(updatedRoles);
//             }}
//           />
//         )
//       },
//       {
//         header: 'Create',
//         accessorKey: 'isCreate',
//         cell: (props) => (
//           <Checkbox
//             checked={props.getValue() as boolean}
//             onChange={(value) => {
//               const updatedRoles = roles.map(role =>
//                 role.id === props.row.original.id
//                   ? { ...role, isCreate: value }
//                   : role
//               );
//               setRoles(updatedRoles);
//             }}
//           />
//         )
//       },
//       {
//         header: 'Actions',
//         id: 'actions',
//         cell: ({ row }) => (
//           <div className="flex gap-2">
//             <Tooltip title="Edit Role">
//               <Button
//                 size="sm"
//                 icon={<MdEdit />}
//                 onClick={() => {
//                   setCurrentRole(row.original);
//                   setIsEditRoleDialogOpen(true);
//                 }}
//               />
//             </Tooltip>
//             <Tooltip title="Delete Role">
//               <Button
//                 size="sm"
//                 color="red"
//                 className="text-red-500"
//                 icon={<FiTrash />}
//                 onClick={() => handleDeleteRole(row.original.id)}
//               />
//             </Tooltip>
//           </div>
//         ),
//       },
//     ],
//     [moduleOptions, roles]
//   );

//   return (
//     <div className="p-8">
//       <div className="flex justify-between items-center mb-12">
//         <h3 className="text-2xl font-bold">Roles Management</h3>
//         <Button
//           size="sm"
//           variant="solid"
//           icon={<HiPlusCircle />}
//           onClick={() => {
//             setCurrentRole({ id: '', name: '', description: '', accessedModules: [], isListing: false, isEdit: false, isDelete: false, isCreate: false });
//             setIsAddRoleDialogOpen(true);
//           }}
//         >
//           Add Role
//         </Button>
//       </div>

//       <DataTable
//         columns={columns}
//         data={roles}
//         pagingData={{
//           total: roles.length,
//           pageIndex: 1,
//           pageSize: 10,
//         }}
//       />

//       {/* Add Role Dialog */}
// <Dialog isOpen={isAddRoleDialogOpen} onClose={() => setIsAddRoleDialogOpen(false)}>
//   <h5 className="mb-4">Add Roles</h5>
//   <div className="space-y-4">
//     <OutlinedInput
//       label="Role Name"
//       value={currentRole.name}
//       onChange={(value: string) => setCurrentRole(prev => ({ ...prev, name: value }))}
//     />
//     <OutlinedInput
//       label="Description"
//       value={currentRole.description}
//       onChange={(value: string) => setCurrentRole(prev => ({ ...prev, description: value }))}
//     />
//     <div className="flex justify-end space-x-2 mt-4">
//       <Button size="sm" variant="solid" onClick={() => setIsAddRoleDialogOpen(false)}>
//         Cancel
//       </Button>
//       <Button
//         size="sm"
//         variant="solid"
//         onClick={handleAddRole}
//         disabled={!currentRole.name}
//       >
//         Confirm
//       </Button>
//     </div>
//   </div>
// </Dialog>

//       {/* Edit Role Dialog */}
//       <Dialog isOpen={isEditRoleDialogOpen} onClose={() => setIsEditRoleDialogOpen(false)}>
//         <h5 className="mb-4">Edit Roles</h5>
//         <div className="space-y-4">
//           <OutlinedInput
//             label="Role Name"
//             value={currentRole.name}
//             onChange={(value: string) => setCurrentRole(prev => ({ ...prev, name: value }))}
//           />
//           <OutlinedInput
//             label="Description"
//             value={currentRole.description}
//             onChange={(value: string) => setCurrentRole(prev => ({ ...prev, description: value }))}
//           />
//           <div className="flex justify-end space-x-2 mt-4">
//             <Button size="sm" variant="solid" onClick={() => setIsEditRoleDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               size="sm"
//               variant="solid"
//               onClick={handleEditRole}
//               disabled={!currentRole.name}
//             >
//               Confirm
//             </Button>
//           </div>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default Roles;

import React, { useState, useMemo, useEffect } from 'react';
import { ColumnDef } from '@/components/shared/DataTable';
import DataTable from '@/components/shared/DataTable';
import { Button, Tooltip, Dialog, Input, Select } from '@/components/ui';
import { MdEdit } from 'react-icons/md';
import { FiTrash } from 'react-icons/fi';
import { HiPlusCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import OutlinedInput from '@/components/ui/OutlinedInput';
import httpClient from '@/api/http-client';
import { endpoints } from '@/api/endpoint';
    
interface Role {
  id: string;
  name: string;
  description: string;
  accessedModules: string[];
}

const Roles = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState<Role[]>([
    { id: '1', name: 'CEO', description: 'Chief Executive Officer', accessedModules: ['1', '2', '3', '4', '5'] },
    { id: '2', name: 'Manager', description: 'Department Manager', accessedModules: ['1', '2', '3'] },
    { id: '3', name: 'HR Specialist', description: 'Human Resources Specialist', accessedModules: ['4', '3'] },
    { id: '4', name: 'Developer', description: 'Software Developer', accessedModules: ['1', '3'] }
  ]);

  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role>({ id: '', name: '', description: '', accessedModules: [] });

  const handleAddRole = () => {
    const newRole = {
      id: (roles.length + 1).toString(),
      name: currentRole.name,
      description: currentRole.description,
      accessedModules: []
    };
    setRoles([...roles, newRole]);
    setCurrentRole({ id: '', name: '', description: '', accessedModules: [] });
    setIsAddRoleDialogOpen(false);
  };

  const handleEditRole = () => {
    const updatedRoles = roles.map(role => 
      role.id === currentRole.id ? currentRole : role
    );
    setRoles(updatedRoles);
    setIsEditRoleDialogOpen(false);
  };

  const handleDeleteRole = (id: string) => {
    const updatedRoles = roles.filter(role => role.id !== id);
    setRoles(updatedRoles);
  };

  const handleNavigateToPermissions = (role: Role) => {
    navigate(`/roles/permissions/${role.id}`, { state: { role } });
  };

  const columns: ColumnDef<Role>[] = useMemo(
    () => [
      {
        header: 'Role Name',
        accessorKey: 'name',
        cell: (props) => (
          <Tooltip title={props.getValue() as string}>
            <div className="w-32 truncate">{props.getValue()}</div>
          </Tooltip>
        ),
      },
      {
        header: 'Description',
        accessorKey: 'description',
        cell: (props) => (
          <Tooltip title={props.getValue() as string}>
            <div className="w-48 truncate">{props.getValue()}</div>
          </Tooltip>
        ),
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Tooltip title="Edit Role">
              <Button
                size="sm"
                icon={<MdEdit />}
                onClick={() => {
                  setCurrentRole(row.original);
                  setIsEditRoleDialogOpen(true);
                }}
              />
            </Tooltip>
            <Tooltip title="Permissions">
              <Button
                size="sm"
                icon={<HiPlusCircle />}
                // onClick={() => handleNavigateToPermissions(row.original)}
                onClick={() => navigate('/permission')}
              >
              </Button>
            </Tooltip>
            <Tooltip title="Delete Role">
              <Button
                size="sm"
                color="red"
                className="text-red-500"
                icon={<FiTrash />}
                onClick={() => handleDeleteRole(row.original.id)}
              />
            </Tooltip>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-12">
        <h3 className="text-2xl font-bold">Roles Management</h3>
        <Button
          size="sm"
          variant="solid"
          icon={<HiPlusCircle />}
          onClick={() => {
            setCurrentRole({ id: '', name: '', description: '', accessedModules: [] });
            setIsAddRoleDialogOpen(true);
          }}
        >
          Add Role
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={roles}
        pagingData={{
          total: roles.length,
          pageIndex: 1,
          pageSize: 10,
        }}
      />

      {/* Add Role Dialog */}
      <Dialog
        height={250}
        isOpen={isAddRoleDialogOpen}
        onClose={() => setIsAddRoleDialogOpen(false)}
      >
        <h5 className='mb-4'>Add Roles</h5>
        <div className="space-y-4">
          <OutlinedInput
            label="Role Name"
            value={currentRole.name}
            onChange={(value: string) => setCurrentRole(prev => ({ ...prev, name: value }))}
          />
          <OutlinedInput
            label="Description"
            value={currentRole.description}
            onChange={(value: string) => setCurrentRole(prev => ({ ...prev, description: value }))}
          />
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              size="sm"
              variant="solid" 
              onClick={() => setIsAddRoleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              variant="solid" 
              onClick={handleAddRole}
              disabled={!currentRole.name}
            >
             Confirm
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog
        isOpen={isEditRoleDialogOpen}
        onClose={() => setIsEditRoleDialogOpen(false)}
      >
        <h5 className='mb-4'>Edit Roles</h5>
        <div className="space-y-4">
          <OutlinedInput
            label="Role Name"
            value={currentRole.name}
            onChange={(value: string) => setCurrentRole(prev => ({ ...prev, name: value }))}
          />
          <OutlinedInput
            label="Description"
            value={currentRole.description}
            onChange={(value: string) => setCurrentRole(prev => ({ ...prev, description: value }))}
          />
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              size="sm"
              variant="solid" 
              onClick={() => setIsEditRoleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              variant="solid" 
              onClick={handleEditRole}
              disabled={!currentRole.name}
            >Confirm
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Roles;