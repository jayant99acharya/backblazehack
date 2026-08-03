import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Gallery from '../components/Gallery'
import Loader from '../components/Loader'
import { fetchMediaGallery, deleteFromStorage } from '../services/api'
import { useAuth } from '../hooks/useAuth'

export default function GalleryPage() {
  const { user } = useAuth()
  const [activeFilter, setActiveFilter] = useState('all')
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    fetchMediaGallery(user?.user_id || null)
      .then((data) => {
        if (isMounted) {
          setItems(data.files || [])
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message)
          setIsLoading(false)
        }
      })
    return () => {
      isMounted = false
    }
  }, [user?.user_id])

  const handleDeleteItem = async (fileKey) => {
    try {
      await deleteFromStorage(fileKey)
      setItems((prev) => prev.filter((item) => item.file_key !== fileKey && item.file_id !== fileKey))
    } catch (err) {
      alert(`Failed to delete asset: ${err.message}`)
    }
  }

  const handleRenameItem = (oldKey, newName) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.file_key === oldKey) {
          const dirPath = item.file_key.substring(0, item.file_key.lastIndexOf('/'))
          const newKey = dirPath ? `${dirPath}/${newName}` : `outputs/${newName}`
          return {
            ...item,
            file_name: newName,
            file_key: newKey,
          }
        }
        return item
      })
    )
  }

  const displayedItems = items.filter((item) => {
    if (activeFilter === 'all') return true
    return item.media_type === activeFilter
  })

  return (
    <div class="space-y-6 py-4">
      <div class="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Left Sidebar Filters */}
        <Sidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {/* Main Vault Gallery Content */}
        <main class="flex-1 w-full min-w-0">
          {isLoading ? (
            <Loader text="Loading stored media from Backblaze B2..." />
          ) : error ? (
            <div class="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              Failed to load assets: {error}
            </div>
          ) : (
            <Gallery
              items={displayedItems}
              onDeleteItem={handleDeleteItem}
              onRenameItem={handleRenameItem}
            />
          )}
        </main>


      </div>
    </div>
  )
}
