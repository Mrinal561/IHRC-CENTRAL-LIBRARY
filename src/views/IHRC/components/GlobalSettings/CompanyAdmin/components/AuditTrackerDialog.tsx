// // components/AuditTrackerDialog.tsx
// import React, { useState, useEffect } from 'react'
// import { Dialog, Button, Checkbox } from '@/components/ui'

// interface AuditTrackerDialogProps {
//   isOpen: boolean
//   onClose: () => void
//   onConfirm: (selection: 'custom' | 'compliance' | 'both') => void
// }

// const AuditTrackerDialog: React.FC<AuditTrackerDialogProps> = ({ 
//   isOpen, 
//   onClose, 
//   onConfirm 
// }) => {
//   const [selection, setSelection] = useState<'custom' | 'compliance' | 'both' | null>(null)

//   // Reset selection when dialog opens
//   useEffect(() => {
//     if (isOpen) {
//       setSelection(null)
//     }
//   }, [isOpen])

//   const handleSelectionChange = (newSelection: 'custom' | 'compliance' | 'both') => {
//     setSelection(newSelection)
//   }

//   const handleConfirm = () => {
//     if (selection) {
//       onConfirm(selection)
//       setSelection(null) // Reset after confirmation
//     }
//   }

//   const handleClose = () => {
//     setSelection(null)
//     onClose()
//   }

//   return (
//     <Dialog isOpen={isOpen} onClose={handleClose} width={500}>
//       <h5 className="mb-4">Audit Tracker Options</h5>
//       <p className="text-gray-600 mb-4 text-sm">
//         Please select which checklist type you want to use for Audit Tracker:
//       </p>
//       <div className="space-y-3">
//         <div className="flex items-center p-2 border rounded hover:bg-gray-50">
//           <Checkbox
//             checked={selection === 'custom'}
//             onChange={() => handleSelectionChange('custom')}
//             className="mr-3"
//           />
//           <div>
//             <div className="font-medium">Custom Checklist</div>
//             <div className="text-sm text-gray-500">Use your own custom audit checklist</div>
//           </div>
//         </div>
        
//         <div className="flex items-center p-2 border rounded hover:bg-gray-50">
//           <Checkbox
//             checked={selection === 'compliance'}
//             onChange={() => handleSelectionChange('compliance')}
//             className="mr-3"
//           />
//           <div>
//             <div className="font-medium">Compliance Checklist</div>
//             <div className="text-sm text-gray-500">Use standard compliance audit checklist</div>
//           </div>
//         </div>
        
//         <div className="flex items-center p-2 border rounded hover:bg-gray-50">
//           <Checkbox
//             checked={selection === 'both'}
//             onChange={() => handleSelectionChange('both')}
//             className="mr-3"
//           />
//           <div>
//             <div className="font-medium">Both Checklists</div>
//             <div className="text-sm text-gray-500">Use both custom and compliance checklists</div>
//           </div>
//         </div>
//       </div>

//       {/* Debug info - remove in production */}
//       <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
//         <strong>Debug:</strong> Current selection: {selection || 'none'}
//       </div>

//       <div className="flex justify-end gap-2 mt-4">
//         <Button variant="plain" onClick={handleClose}>
//           Cancel
//         </Button>
//         <Button
//           variant="solid"
//           onClick={handleConfirm}
//           disabled={!selection}
//         >
//           Confirm
//         </Button>
//       </div>
//     </Dialog>
//   )
// }

// export default AuditTrackerDialog







import React, { useState, useEffect } from 'react';
import { Dialog, Button, Checkbox } from '@/components/ui';

interface AuditTrackerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selection: 'custom' | 'compliance' | 'both') => void;
  initialSelection?: 'custom' | 'compliance' | 'both' | null;
}

const AuditTrackerDialog: React.FC<AuditTrackerDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  initialSelection = null
}) => {
  const [selection, setSelection] = useState<'custom' | 'compliance' | 'both' | null>(initialSelection);

  // Reset selection when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelection(initialSelection || null);
    }
  }, [isOpen, initialSelection]);

  const handleSelectionChange = (newSelection: 'custom' | 'compliance' | 'both') => {
    setSelection(newSelection);
  };

   const handleConfirm = () => {
    if (selection) {
      onConfirm(selection);
      onClose(); // Move onClose here to ensure it's called after onConfirm
    }
  };

  const handleClose = () => {
    setSelection(null);
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} width={500}>
      <h5 className="mb-4">Audit Tracker Options</h5>
      <p className="text-gray-600 mb-4 text-sm">
        Please select which checklist type you want to use for Audit Tracker:
      </p>
      <div className="space-y-3">
        <div className="flex items-center p-2 border rounded hover:bg-gray-50">
          <Checkbox
            checked={selection === 'custom'}
            onChange={() => handleSelectionChange('custom')}
            className="mr-3"
          />
          <div>
            <div className="font-medium">Custom Checklist</div>
            <div className="text-sm text-gray-500">Use your own custom audit checklist</div>
          </div>
        </div>
        
        <div className="flex items-center p-2 border rounded hover:bg-gray-50">
          <Checkbox
            checked={selection === 'compliance'}
            onChange={() => handleSelectionChange('compliance')}
            className="mr-3"
          />
          <div>
            <div className="font-medium">Compliance Checklist</div>
            <div className="text-sm text-gray-500">Use standard compliance audit checklist</div>
          </div>
        </div>
        
        <div className="flex items-center p-2 border rounded hover:bg-gray-50">
          <Checkbox
            checked={selection === 'both'}
            onChange={() => handleSelectionChange('both')}
            className="mr-3"
          />
          <div>
            <div className="font-medium">Both Checklists</div>
            <div className="text-sm text-gray-500">Use both custom and compliance checklists</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="plain" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="solid"
          onClick={handleConfirm}
          disabled={!selection}
        >
          Confirm
        </Button>
      </div>
    </Dialog>
  );
};

export default AuditTrackerDialog;