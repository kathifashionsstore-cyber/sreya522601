import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'
import { Modal } from './Modal'

export function ConfirmDialog({ open, title = 'Confirm action', message, onConfirm, onCancel }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <div className="flex gap-4">
        <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-700">
          <AlertTriangle className="size-5" />
        </div>
        <div>
          <p className="text-sm leading-6 text-slate-600">{message}</p>
          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={onConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
