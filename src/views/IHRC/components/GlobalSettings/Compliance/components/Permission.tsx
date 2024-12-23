import React, { useState, useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Table } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { HiOutlinePlusCircle, HiOutlineMinusCircle } from 'react-icons/hi';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
} from '@tanstack/react-table';

const { Tr, Th, Td, THead, TBody } = Table;

const Permission = () => {
  const { id } = useParams();
  const location = useLocation();
  const role = location.state?.role;

  // Initial permissions data structure
  const [permissions, setPermissions] = useState([
    {
      id: 1,
      menu: 'Remittance Tracker',
      subRows: [
        {
          id: 11,
          menu: 'PF Tracker',
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
        {
          id: 12,
          menu: 'ESI Tracker',
          view: false,
          create: false,
          edit: false,
          delete: false,
        },
        {
          id: 13,
          menu: 'LWF Tracker',
          view: false,
          create: false,
          edit: false,
          delete: false,
        }
      ]
    }
  ]);

  const [expanded, setExpanded] = useState({});

  const handleCheckboxChange = (rowId, permission, value) => {
    setPermissions(current => {
      const updatePermission = (items) => {
        return items.map(item => {
          if (item.id === rowId) {
            return { ...item, [permission]: value };
          }
          if (item.subRows) {
            return { ...item, subRows: updatePermission(item.subRows) };
          }
          return item;
        });
      };
      return updatePermission(current);
    });
  };

  const columns = useMemo(
    () => [
      {
        id: 'expander',
        header: 'Menu',
        cell: ({ row }) => (
          <div className="flex items-center">
            {row.getCanExpand() ? (
              <button
                className="text-xl mr-2"
                onClick={row.getToggleExpandedHandler()}
              >
                {row.getIsExpanded() ? (
                  <HiOutlineMinusCircle className="h-5 w-5" />
                ) : (
                  <HiOutlinePlusCircle className="h-5 w-5" />
                )}
              </button>
            ) : null}
            {row.original.menu}
          </div>
        ),
      },
      {
        header: 'View',
        accessorKey: 'view',
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.view || false}
            onChange={(checked) => 
              handleCheckboxChange(row.original.id, 'view', checked)
            }
          />
        ),
      },
      {
        header: 'Create',
        accessorKey: 'create',
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.create || false}
            onChange={(checked) => 
              handleCheckboxChange(row.original.id, 'create', checked)
            }
          />
        ),
      },
      {
        header: 'Edit',
        accessorKey: 'edit',
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.edit || false}
            onChange={(checked) => 
              handleCheckboxChange(row.original.id, 'edit', checked)
            }
          />
        ),
      },
      {
        header: 'Delete',
        accessorKey: 'delete',
        cell: ({ row }) => (
          <Checkbox
            checked={row.original.delete || false}
            onChange={(checked) => 
              handleCheckboxChange(row.original.id, 'delete', checked)
            }
          />
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: permissions,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Permissions</h2>
      <div className="rounded-md border">
        <Table>
          <THead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id} colSpan={header.colSpan}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </THead>
          <TBody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </Td>
                ))}
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
};

export default Permission;