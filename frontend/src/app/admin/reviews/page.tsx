'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api-client'
import { AuthGuard } from '../../components/AuthGuard'
import DashboardCard from '../../components/Admin/DashboardCard'
import DataTable from '../../components/Admin/DataTable'
import SearchBar from '../../components/Admin/Searchbar'
import toast from 'react-hot-toast'

interface Review {
  id: string
  item: string
  rating: number
  comment: string
  date: string
  status: string
  rawDate: string
}

function ReviewsPageContent() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Published' | 'Rejected' | 'Pending'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    rejected: 0,
    pending: 0,
    publishedPercent: 0,
    rejectedPercent: 0,
    pendingPercent: 0,
  })

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchReviews()
    }, 300)
    return () => clearTimeout(debounce)
  }, [search])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await apiFetch('/api/admin/reviews')

      const formatted = (data.reviews || []).map((r: any) => ({
        id: r.id,
        item: r.item?.type || r.item?.title || 'Course',
        rating: r.rating || 0,
        comment: r.comment || r.review_text || '',
        status: r.status || 'Pending',
        rawDate: r.created_at,
        date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      }))

      setReviews(formatted)
      setStats(data.stats || {})
    } catch (err) {
      console.error('Failed to fetch reviews:', err)
      setError(err instanceof Error ? err.message : 'Failed to load reviews')
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  // Filter reviews based on search and status
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.item.toLowerCase().includes(search.toLowerCase()) ||
                         review.comment.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const exportReviews = () => {
    // Create CSV content
    const headers = ['Review ID', 'Item', 'Rating', 'Comment', 'Status', 'Date']
    const csvContent = [
      headers.join(','),
      ...filteredReviews.map(review => [
        `"${review.id}"`,
        `"${review.item}"`,
        `"${review.rating}"`,
        `"${review.comment.replace(/"/g, '""')}"`, // Escape quotes in comments
        `"${review.status}"`,
        `"${review.date}"`
      ].join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reviews-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast.success('Reviews exported successfully!')
  }

  const moderateReview = async (reviewId: string, action: 'approve' | 'reject') => {
    try {
      await apiFetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          action,
          status: action === 'approve' ? 'Published' : 'Rejected'
        }),
      })

      toast.success(`Review ${action === 'approve' ? 'approved' : 'rejected'} successfully`)
      fetchReviews() // Refresh the list
    } catch (err) {
      console.error('Failed to moderate review:', err)
      toast.error('Failed to moderate review')
    }
  }

  // Use backend-calculated stats
  const { total, published, rejected, pending, publishedPercent, rejectedPercent, pendingPercent } = stats

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <h2 className="font-bold">Error loading reviews</h2>
        <p>{error}</p>
        <button
          onClick={() => fetchReviews()}
          className="mt-2 px-4 py-2 bg-red-100 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reviews Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="All Reviews" value={`${total}`} change={`${publishedPercent}%`} isPositive />
        <DashboardCard title="Published" value={`${published}`} change={`${publishedPercent}%`} isPositive />
        <DashboardCard title="Rejected" value={`${rejected}`} change={`${rejectedPercent}%`} isPositive={false} />
        <DashboardCard title="Pending" value={`${pending}`} change={`${pendingPercent}%`} isPositive={false} />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <SearchBar placeholder="Filter reviews..." onSearch={setSearch} />

            {/* Status Filter Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  statusFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('Published')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  statusFilter === 'Published'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setStatusFilter('Rejected')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  statusFilter === 'Rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Rejected
              </button>
              <button
                onClick={() => setStatusFilter('Pending')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  statusFilter === 'Pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Pending
              </button>
            </div>
          </div>

          <div className="flex space-x-2">
            {/* Export Button */}
            <button
              onClick={exportReviews}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No reviews found</p>
            <button
              onClick={() => fetchReviews()}
              className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            >
              Refresh Data
            </button>
          </div>
        ) : (
          <DataTable
            headers={['REVIEW ID', 'ITEM', 'RATING', 'COMMENT', 'DATE', 'STATUS', 'ACTIONS']}
            data={filteredReviews}
            keys={['id', 'item', 'rating', 'comment', 'date', 'status']}
            renderCell={{
              rating: (value) => (
                <div className="flex items-center">
                  {value}
                  <svg className="w-4 h-4 text-yellow-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              ),
              status: (value) => (
                <span className={`px-2 py-1 rounded text-xs ${
                  value === 'Published' ? 'bg-green-100 text-green-800' :
                  value === 'Rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {value}
                </span>
              ),
              actions: (value, row) => (
                <div className="flex space-x-2">
                  {row.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => moderateReview(row.id, 'approve')}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => moderateReview(row.id, 'reject')}
                        className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              )
            }}
          />
        )}
      </div>
    </div>
  )
}

export default function ReviewsPage() {
  return (
    <AuthGuard>
      <ReviewsPageContent />
    </AuthGuard>
  )
}
