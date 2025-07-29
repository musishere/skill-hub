"use client";

import { useEffect, useState } from "react";
import { apiFetch } from '@/lib/api-client';
import { AuthGuard } from '../../components/AuthGuard';
import SearchBar from "../../components/Admin/Searchbar";
import DashboardCard from "../../components/Admin/DashboardCard";
import DataTable from "../../components/Admin/DataTable";
import toast from 'react-hot-toast';

interface Collection {
  id: string;
  name: string;
  description: string;
}

function CollectionsPageContent() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filtered, setFiltered] = useState<Collection[]>([]);
  const [query, setQuery] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState<'all' | 'with' | 'without'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollection, setNewCollection] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    withDescription: 0,
    withoutDescription: 0,
    withDescriptionPercent: 0,
    withoutDescriptionPercent: 0,
  })

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiFetch('/api/admin/collections');
      setCollections(data.collections || []);
      setFiltered(data.collections || []);
      setStats(data.stats || {});
    } catch (err) {
      console.error("Failed to fetch collections:", err);
      setError(err instanceof Error ? err.message : 'Failed to load collections');
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async () => {
    if (!newCollection.name.trim()) {
      toast.error('Collection name is required');
      return;
    }
    setCreating(true);
    try {
      await apiFetch('/api/admin/collections', {
        method: 'POST',
        body: JSON.stringify(newCollection),
      });
      toast.success('Collection created successfully');
      setNewCollection({ name: '', description: '' });
      setShowCreateModal(false);
      fetchCollections();
    } catch (err) {
      console.error('Failed to create collection:', err);
      toast.error('Failed to create collection');
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    let filtered = collections;

    // Apply search filter
    if (query.trim() !== "") {
      const lower = query.toLowerCase();
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(lower) ||
        (c.description || '').toLowerCase().includes(lower)
      );
    }

    // Apply description filter
    if (descriptionFilter === 'with') {
      filtered = filtered.filter((c) => c.description && c.description.trim() !== '');
    } else if (descriptionFilter === 'without') {
      filtered = filtered.filter((c) => !c.description || c.description.trim() === '');
    }

    setFiltered(filtered);
  }, [query, descriptionFilter, collections]);

  const exportCollections = () => {
    // Create CSV content
    const headers = ['Collection ID', 'Name', 'Description']
    const csvContent = [
      headers.join(','),
      ...filtered.map(collection => [
        `"${collection.id}"`,
        `"${collection.name}"`,
        `"${(collection.description || '').replace(/"/g, '""')}"` // Escape quotes in description
      ].join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `collections-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast.success('Collections exported successfully!')
  }

  // Use backend-calculated stats
  const { total, withDescription, withoutDescription, withDescriptionPercent, withoutDescriptionPercent } = stats;

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <h2 className="font-bold">Error loading collections</h2>
        <p>{error}</p>
        <button
          onClick={() => fetchCollections()}
          className="mt-2 px-4 py-2 bg-red-100 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Collections Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Total Collections"
          value={String(total)}
          change={total > 0 ? '+100%' : '+0%'}
          isPositive={true}
        />
        <DashboardCard
          title="With Description"
          value={String(withDescription)}
          change={`${withDescriptionPercent}%`}
          isPositive={withDescriptionPercent >= 50}
        />
        <DashboardCard
          title="Without Description"
          value={String(withoutDescription)}
          change={`${withoutDescriptionPercent}%`}
          isPositive={false}
        />
      </div>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <SearchBar placeholder="Search collections..." onSearch={setQuery} />

            {/* Description Filter Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setDescriptionFilter('all')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  descriptionFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDescriptionFilter('with')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  descriptionFilter === 'with'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                With Description
              </button>
              <button
                onClick={() => setDescriptionFilter('without')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  descriptionFilter === 'without'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Without Description
              </button>
            </div>
          </div>

          <div className="flex space-x-2">
            {/* Export Button */}
            <button
              onClick={exportCollections}
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
              Create Collection
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No collections found</p>
            <button
              onClick={() => fetchCollections()}
              className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            >
              Refresh Data
            </button>
          </div>
        ) : (
          <DataTable
            headers={['NAME', 'DESCRIPTION']}
            data={filtered}
            keys={['name', 'description']}
          />
        )}
      </div>
      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Collection</h2>
            <input
              type="text"
              placeholder="Collection Name"
              value={newCollection.name}
              onChange={e => setNewCollection({ ...newCollection, name: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
            />
            <textarea
              placeholder="Description (optional)"
              value={newCollection.description}
              onChange={e => setNewCollection({ ...newCollection, description: e.target.value })}
              className="w-full border rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className="mr-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={createCollection}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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

export default function CollectionsPage() {
  return (
    <AuthGuard>
      <CollectionsPageContent />
    </AuthGuard>
  );
}
