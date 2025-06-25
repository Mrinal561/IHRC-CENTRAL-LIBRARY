// components/AuditTrackerDialog.tsx
import React, { useState } from 'react'
import { Dialog, Button, Checkbox } from '@/components/ui'

interface AuditTrackerDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selection: 'custom' | 'compliance' | 'both') => void
}

const AuditTrackerDialog: React.FC<AuditTrackerDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  const [selection, setSelection] = useState<'custom' | 'compliance' | 'both' | null>(null)

  return (
    <Dialog isOpen={isOpen} onClose={onClose} width={500}>
      <h5 className="mb-4">Audit Tracker Options</h5>
      <div className="space-y-3">
        <Checkbox
          checked={selection === 'custom'}
          onChange={() => setSelection('custom')}
        >
          Custom Checklist
        </Checkbox>
        <Checkbox
          checked={selection === 'compliance'}
          onChange={() => setSelection('compliance')}
        >
          Compliance Checklist
        </Checkbox>
        <Checkbox
          checked={selection === 'both'}
          onChange={() => setSelection('both')}
        >
          Both Checklists
        </Checkbox>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="plain" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="solid"
          onClick={() => {
            if (selection) {
              onConfirm(selection)
              onClose()
            }
          }}
          disabled={!selection}
        >
          Confirm
        </Button>
      </div>
    </Dialog>
  )
}

export default AuditTrackerDialog