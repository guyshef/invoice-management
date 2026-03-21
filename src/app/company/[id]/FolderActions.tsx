'use client'

import { useState } from 'react'
import { Edit2, Trash2, X, Check } from 'lucide-react'
import { renameFolder, deleteFolder } from './actions'
import { useRouter } from 'next/navigation'

export function FolderActions({ companyId, folderId, currentName }: { companyId: string, folderId: string, currentName: string }) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(currentName)
  const router = useRouter()

  const handleRename = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newName || newName === currentName) {
      setIsRenaming(false)
      return
    }
    const formData = new FormData()
    formData.append('name', newName)
    await renameFolder(companyId, folderId, formData)
    setIsRenaming(false)
  }

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${currentName}" and ALL its invoices? This cannot be undone.`)) {
      await deleteFolder(companyId, folderId)
      router.push(`/company/${companyId}`)
    }
  }

  if (isRenaming) {
    return (
      <form onSubmit={handleRename} className="flex items-center gap-2">
        <input 
          autoFocus
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="bg-slate-800 border border-slate-600 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary h-8"
        />
        <button type="submit" className="p-1.5 rounded-md bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
          <Check className="w-4 h-4" />
        </button>
        <button type="button" onClick={() => { setIsRenaming(false); setNewName(currentName); }} className="p-1.5 rounded-md bg-slate-700/50 text-slate-400 hover:bg-slate-700 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </form>
    )
  }

  return (
    <div className="flex items-center gap-2 ml-4">
      <button 
        onClick={() => setIsRenaming(true)}
        title="Rename Folder"
        className="p-1.5 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button 
        onClick={handleDelete}
        title="Delete Folder"
        className="p-1.5 rounded-md text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
