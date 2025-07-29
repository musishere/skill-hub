'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api-client'
import { AuthGuard } from '../../components/AuthGuard'
import DataTable from '../../components/Admin/DataTable'
import DashboardCard from '../../components/Admin/DashboardCard'
import SearchBar from '../../components/Admin/Searchbar'
import Pagination from '../../components/Admin/Pagination'
import toast from 'react-hot-toast'

interface Transaction {
  id: string
  name: string
  email: string
  address: string
  amount: string
  date: string
  nextBill: string
  method: string
  status: string
  view: string
  rawAmount: number
  rawStatus: string
  rawDate: string
}

function TransactionsPageContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed' | 'pending'>('all')
  const [transactionGrowth, setTransactionGrowth] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTransactions()
    }, 400)
    return () => clearTimeout(delayDebounce)
  }, [search, statusFilter])

  useEffect(() => {
    fetchOverview()
  }, [])

  const fetchOverview = async () => {
    try {
      const data = await apiFetch('/api/admin/dashboard-overview')
      setTransactionGrowth(data?.transactions?.growth ?? 0)
    } catch (err) {
      console.error('Failed to fetch dashboard overview:', err)
    }
  }

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔍 Fetching transactions...')
      console.log('🔍 API URL:', process.env.NEXT_PUBLIC_API_URL)

      // Check if we have a token
      const token = localStorage.getItem('authToken')
      console.log('🔍 Auth token exists:', !!token)
      if (token) {
        console.log('🔍 Token preview:', token.substring(0, 20) + '...')
      }

      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const data = await apiFetch(`/api/admin/transactions?${params.toString()}`)
      console.log('✅ Transactions data received:', data)

      const formatted = (data || []).map((tx: any) => ({
        id: tx.id,
        name: tx.user?.name || tx.user?.full_name || 'Unknown',
        email: tx.user?.email || '',
        address: '—',
        amount: `$${(tx.amount || 0).toFixed(2)}`,
        rawAmount: tx.amount || 0,
        rawStatus: tx.status,
        rawDate: tx.created_at,
        date: new Date(tx.created_at).toLocaleDateString(),
        nextBill: tx.next_billing_date
          ? new Date(tx.next_billing_date).toLocaleDateString()
          : '—',
        method: tx.payment_method || 'N/A',
        status: tx.status,
        view: '🔗',
      }))
      setTransactions(formatted)
    } catch (err) {
      console.error('❌ Failed to fetch transactions:', err)
      setError(err instanceof Error ? err.message : 'Failed to load transactions')
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  // Filter transactions based on search and status
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.name.toLowerCase().includes(search.toLowerCase()) ||
                         transaction.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || transaction.rawStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const exportTransactions = () => {
    // Create CSV content
    const headers = ['Transaction ID', 'Customer Name', 'Email', 'Amount', 'Status', 'Payment Method', 'Date', 'Next Billing']
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(transaction => [
        `"${transaction.id}"`,
        `"${transaction.name}"`,
        `"${transaction.email}"`,
        `"${transaction.amount}"`,
        `"${transaction.status}"`,
        `"${transaction.method}"`,
        `"${transaction.date}"`,
        `"${transaction.nextBill}"`
      ].join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transactions-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast.success('Transactions exported successfully!')
  }

  const changeTransactionStatus = async (transactionId: string, newStatus: string) => {
    try {
      await apiFetch(`/api/admin/transactions/${transactionId}/change-status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      })

      toast.success(`Transaction status updated to ${newStatus}`)
      fetchTransactions() // Refresh the list
    } catch (err) {
      console.error('Failed to update transaction status:', err)
      toast.error('Failed to update transaction status')
    }
  }

  const processRefund = async (transactionId: string) => {
    try {
      await apiFetch(`/api/admin/transactions/${transactionId}/refund`, {
        method: 'POST',
      })

      toast.success('Refund processed successfully')
      fetchTransactions() // Refresh the list
    } catch (err) {
      console.error('Failed to process refund:', err)
      toast.error('Failed to process refund')
    }
  }

  // === Metrics calculation ===
  const totalAmount = transactions.reduce((sum, tx) => sum + tx.rawAmount, 0)
  const totalTransactions = transactions.length

  // Calculate stats from all transactions (not just 7 days)
  const successTx = transactions.filter(tx => tx.rawStatus === 'success')
  const failedTx = transactions.filter(tx => tx.rawStatus === 'failed')
  const pendingTx = transactions.filter(tx => tx.rawStatus === 'pending')

  // Calculate percentages
  const successPercent = totalTransactions > 0 ? Math.round((successTx.length / totalTransactions) * 100) : 0
  const failedPercent = totalTransactions > 0 ? Math.round((failedTx.length / totalTransactions) * 100) : 0
  const pendingPercent = totalTransactions > 0 ? Math.round((pendingTx.length / totalTransactions) * 100) : 0

  const averageOrder = totalTransactions > 0 ? totalAmount / totalTransactions : 0

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <h2 className="font-bold">Error loading transactions</h2>
        <p>{error}</p>
        <button
          onClick={() => fetchTransactions()}
          className="mt-2 px-4 py-2 bg-red-100 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Revenue"
          value={`$${totalAmount.toFixed(2)}`}
          change={`${transactionGrowth >= 0 ? '+' : ''}${transactionGrowth}%`}
          isPositive={transactionGrowth >= 0}
        />
        <DashboardCard
          title="Successful"
          value={String(successTx.length)}
          change={`${successPercent}%`}
          isPositive={true}
        />
        <DashboardCard
          title="Failed"
          value={String(failedTx.length)}
          change={`${failedPercent}%`}
          isPositive={false}
        />
        <DashboardCard
          title="Average Order"
          value={`$${averageOrder.toFixed(2)}`}
          change={`${pendingPercent}%`}
          isPositive={true}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <SearchBar placeholder="Search transactions..." onSearch={setSearch} />

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
                onClick={() => setStatusFilter('success')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  statusFilter === 'success'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Successful
              </button>
              <button
                onClick={() => setStatusFilter('failed')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  statusFilter === 'failed'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Failed
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  statusFilter === 'pending'
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
              onClick={exportTransactions}
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
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions found</p>
            <button
              onClick={() => fetchTransactions()}
              className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            >
              Refresh Data
            </button>
          </div>
        ) : (
          <DataTable
            headers={['BILLING ID', 'NAME', 'AMOUNT', 'DATE', 'NEXT BILL', 'METHOD', 'STATUS', 'ACTIONS']}
            data={filteredTransactions}
            keys={['id', 'name', 'amount', 'date', 'nextBill', 'method', 'status']}
            renderCell={{
              status: (value) => (
                <span className={`px-2 py-1 rounded text-xs ${
                  value === 'success' ? 'bg-green-100 text-green-800' :
                  value === 'failed' ? 'bg-red-100 text-red-800' :
                  value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {value}
                </span>
              ),
              actions: (value, row) => (
                <div className="flex space-x-2">
                  {row.status === 'success' && (
                    <button
                      onClick={() => processRefund(row.id)}
                      className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                    >
                      Refund
                    </button>
                  )}
                  {row.status === 'pending' && (
                    <>
                      <button
                        onClick={() => changeTransactionStatus(row.id, 'success')}
                        className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => changeTransactionStatus(row.id, 'failed')}
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

        <div className="mt-6">
          <Pagination
            currentPage={1}
            totalPages={1}
            itemsPerPage={transactions.length}
            totalItems={transactions.length}
          />
        </div>
      </div>
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <AuthGuard>
      <TransactionsPageContent />
    </AuthGuard>
  )
}
