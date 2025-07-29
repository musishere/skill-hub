'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { AuthGuard } from '../../components/AuthGuard';
import DataTable from '../../components/Admin/DataTable';
import DashboardCard from '../../components/Admin/DashboardCard';
import SearchBar from '../../components/Admin/Searchbar';
import { toast } from 'react-hot-toast';

interface UserStats {
  total: number;
  active: number;
  instructors: number;
  students: number;
  growth: {
    user: number;
    active: number;
    instructor: number;
    student: number;
  };
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
}

function UsersPageContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'instructor' | 'student'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    instructors: 0,
    students: 0,
    growth: {
      user: 0,
      active: 0,
      instructor: 0,
      student: 0
    }
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiFetch("/api/admin/users");

        // Transform users data to match frontend expectations
        const transformedUsers = (data.users || []).map((user: any) => ({
          id: user.id,
          name: user.full_name || user.fullName || 'Unknown',
          email: user.email,
          role: user.role,
          joined: new Date(user.created_at).toLocaleDateString(),
          status: user.is_active ? 'Active' : 'Inactive',
          ipInfo: 'N/A', // Backend doesn't provide this
          tags: user.role === 'admin' ? 'Admin' : user.role === 'instructor' ? 'Instructor' : 'Student'
        }));

        setUsers(transformedUsers);
        setFilteredUsers(transformedUsers);

        // Map stats from backend response
        if (data.stats) {
          setStats({
            total: data.stats.totals?.users || transformedUsers.length,
            active: data.stats.totals?.active || 0,
            instructors: data.stats.totals?.instructors || 0,
            students: data.stats.totals?.students || 0,
            growth: {
              user: data.stats.growth?.user || 0,
              active: data.stats.growth?.active || 0,
              instructor: data.stats.growth?.instructor || 0,
              student: data.stats.growth?.student || 0,
            }
          });
        } else {
          // Fallback stats calculation from users data
          const instructors = transformedUsers.filter(u => u.role === 'instructor').length;
          const students = transformedUsers.filter(u => u.role === 'student').length;
          const active = transformedUsers.filter(u => u.status === 'Active').length;

          setStats({
            total: transformedUsers.length,
            active,
            instructors,
            students,
            growth: { user: 0, active: 0, instructor: 0, student: 0 }
          });
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, roleFilter, statusFilter, users]);

  const exportUsers = () => {
    // Create CSV content
    const headers = ['User ID', 'Name', 'Email', 'Role', 'Status', 'Joined Date', 'Tags']
    const csvContent = [
      headers.join(','),
      ...filteredUsers.map(user => [
        `"${user.id}"`,
        `"${user.name}"`,
        `"${user.email}"`,
        `"${user.role}"`,
        `"${user.status}"`,
        `"${user.joined}"`,
        `"${user.tags}"`
      ].join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast.success('Users exported successfully!')
  }

  const formatPercentage = (value: number) => {
    if (value === 0) return '+0%';
    const rounded = Math.round(value);
    const sign = value > 0 ? '+' : '';
    return `${sign}${rounded}%`;
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <h2 className="font-bold">Error loading users</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-100 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Users"
          value={stats.total.toString()}
          change={formatPercentage(stats.growth.user)}
          isPositive={stats.growth.user >= 0}
        />
        <DashboardCard
          title="Active Users (24h)"
          value={stats.active.toString()}
          change={formatPercentage(stats.growth.active)}
          isPositive={stats.growth.active >= 0}
        />
        <DashboardCard
          title="Instructors"
          value={stats.instructors.toString()}
          change={formatPercentage(stats.growth.instructor)}
          isPositive={stats.growth.instructor >= 0}
        />
        <DashboardCard
          title="Students"
          value={stats.students.toString()}
          change={formatPercentage(stats.growth.student)}
          isPositive={stats.growth.student >= 0}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <SearchBar
              placeholder="Search users..."
              onSearch={(term: string) => setSearchQuery(term)}
            />

            {/* Role Filter Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  roleFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Roles
              </button>
              <button
                onClick={() => setRoleFilter('admin')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  roleFilter === 'admin'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Admins
              </button>
              <button
                onClick={() => setRoleFilter('instructor')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  roleFilter === 'instructor'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Instructors
              </button>
              <button
                onClick={() => setRoleFilter('student')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  roleFilter === 'student'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Students
              </button>
            </div>

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
                All Status
              </button>
              <button
                onClick={() => setStatusFilter('Active')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  statusFilter === 'Active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('Inactive')}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  statusFilter === 'Inactive'
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
              onClick={exportUsers}
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
        ) : (
          <>
            {users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No users found</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                >
                  Refresh Data
                </button>
              </div>
            ) : (
              <DataTable
                headers={['USER', 'EMAIL', 'ROLE', 'JOINED', 'STATUS', 'IP INFO', 'TAGS']}
                data={filteredUsers}
                keys={['name', 'email', 'role', 'joined', 'status', 'ipInfo', 'tags']}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function UsersPage() {
  return (
    <AuthGuard>
      <UsersPageContent />
    </AuthGuard>
  );
}
