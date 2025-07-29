'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { AuthGuard } from '../../components/AuthGuard';
import DashboardCard from '../../components/Admin/DashboardCard';
import SearchBar from '../../components/Admin/Searchbar';
import { toast } from 'react-hot-toast';

interface Item {
  id: string;
  type: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

function ItemsPageContent() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const data = await apiFetch(`/api/admin/items?${params.toString()}`);
      setItems(data.items || []);

      // Calculate dynamic stats from the data
      const totalItems = data.items?.length || 0;
      const activeItems = data.items?.filter((item: any) => item.status === 'active').length || 0;
      const inactiveItems = data.items?.filter((item: any) => item.status === 'inactive').length || 0;

      setStats({
        total: totalItems,
        published: activeItems,
        draft: inactiveItems,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateItemStatus = async (id: string, status: 'active' | 'inactive') => {
    try {
      await apiFetch(`/api/admin/items/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      fetchItems(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const createItem = async () => {
    setCreating(true);
    try {
      await apiFetch(`/api/admin/items`, {
        method: 'POST',
        body: JSON.stringify({ title: newItemTitle }),
      });
      setNewItemTitle('');
      setShowCreateModal(false);
      fetchItems();
      toast.success('Item created successfully!');
    } catch (err) {
      console.error('Error creating item:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast.error('Error creating item: ' + errorMessage);
    } finally {
      setCreating(false);
    }
  };

  const exportItems = () => {
    // Create CSV content
    const headers = ['Type', 'Status', 'Created Date', 'Updated Date'];
    const csvContent = [
      headers.join(','),
      ...items.map(item => [
        `"${item.type}"`,
        `"${item.status}"`,
        `"${item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}"`,
        `"${item.updated_at ? new Date(item.updated_at).toLocaleDateString() : 'N/A'}"`
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `items-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Items exported successfully!');
  };

  useEffect(() => {
    fetchItems();
  }, [search, statusFilter]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Items Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="All Items" value={String(stats.total)} change="+5.2%" isPositive />
        <DashboardCard title="Active Items" value={String(stats.published)} change="+3.8%" isPositive />
        <DashboardCard title="Inactive Items" value={String(stats.draft)} change="-1.5%" isPositive={false} />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <SearchBar placeholder="Search Items..." onSearch={(term) => setSearch(term)} />

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
                onClick={() => setStatusFilter('active')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  statusFilter === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('inactive')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  statusFilter === 'inactive'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          <div className="flex space-x-2">
            {/* Export Button */}
            <button
              onClick={() => exportItems()}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export</span>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Item
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No items found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => updateItemStatus(item.id, item.status === 'active' ? 'inactive' : 'active')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {item.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Item Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Create New Item</h3>
            <input
              type="text"
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Item title"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={createItem}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ItemsPage() {
  return (
    <AuthGuard>
      <ItemsPageContent />
    </AuthGuard>
  );
}
