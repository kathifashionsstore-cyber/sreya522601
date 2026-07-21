import { useMemo, useState } from 'react'
import { Download, MessageCircle, Search, Trash2 } from 'lucide-react'
import { Button } from '../components/shared/Button'
import { ConfirmDialog } from '../components/shared/ConfirmDialog'
import { Input, Select } from '../components/shared/Input'
import { useToast } from '../components/shared/Toast'
import { useDebounce } from '../hooks/useDebounce'
import { removeDocument, updateDocument, useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { downloadTextFile, toCsv } from '../lib/seo'

export default function AdminContacts() {
  const contacts = useFirestoreCollection('contacts', [], 'createdAt').data
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [deleteId, setDeleteId] = useState(null)
  const { push } = useToast()
  const debounced = useDebounce(search).toLowerCase()

  const filtered = useMemo(
    () => contacts.filter((item) => {
      const matchesType = type === 'all' || item.type === type
      const haystack = `${item.name} ${item.phone} ${item.email} ${item.message}`.toLowerCase()
      return matchesType && haystack.includes(debounced)
    }),
    [contacts, type, debounced],
  )

  async function markRead(item) {
    try {
      await updateDocument('contacts', item.id, { read: !item.read })
      push(item.read ? 'Marked unread.' : 'Marked read.', 'success')
    } catch (error) {
      push(error.message, 'error')
    }
  }

  async function confirmDelete() {
    try {
      await removeDocument('contacts', deleteId)
      push('Contact deleted.', 'success')
      setDeleteId(null)
    } catch (error) {
      push(error.message, 'error')
    }
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-brand-navy">Contacts</h1>
          <p className="mt-2 text-sm text-slate-600">Unread badge, reply via WhatsApp, filtering, deletion, and CSV export.</p>
        </div>
        <Button type="button" variant="secondary" onClick={() => downloadTextFile('contacts.csv', toCsv(filtered), 'text/csv')}><Download className="size-4" /> Export CSV</Button>
      </div>
      <div className="flex flex-wrap gap-3 rounded-lg bg-white p-4 shadow-soft">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search contacts" className="pl-9" />
        </label>
        <Select value={type} onChange={(event) => setType(event.target.value)} className="w-48">
          <option value="all">All types</option>
          <option value="general">General</option>
          <option value="appointment">Appointment</option>
          <option value="feedback">Feedback</option>
        </Select>
      </div>
      <div className="grid gap-3">
        {filtered.map((item) => (
          <div key={item.id} className="rounded-lg bg-white p-4 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-black text-brand-navy">{item.name}</h2>
                  {!item.read ? <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-black text-rose-700">Unread</span> : null}
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{item.type}</span>
                </div>
                <p className="mt-2 text-sm font-bold text-slate-600">{item.phone} {item.email ? `· ${item.email}` : ''}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{item.message}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary" onClick={() => markRead(item)}>{item.read ? 'Unread' : 'Read'}</Button>
                <Button as="a" href={`https://wa.me/${String(item.phone || '').replace(/\D/g, '')}`} variant="secondary"><MessageCircle className="size-4" /></Button>
                <Button type="button" variant="danger" onClick={() => setDeleteId(item.id)}><Trash2 className="size-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ConfirmDialog open={Boolean(deleteId)} title="Delete contact" message="Delete this contact message?" onCancel={() => setDeleteId(null)} onConfirm={confirmDelete} />
    </section>
  )
}
