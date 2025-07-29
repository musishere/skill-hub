"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";
import { AuthGuard } from "../components/AuthGuard";
import DashboardCard from "../components/Admin/DashboardCard";
import DataTable from "../components/Admin/DataTable";
import SearchBar from "../components/Admin/Searchbar"; // Update path as needed
import Pagination from "../components/Admin/Pagination"; // Update path as needed

type DashboardStats = {
  users: {
    total: number;
    active: number;
    growth: number;
    activeGrowth: number;
  };
  content: {
    total: number;
    published: number;
    growth: number;
  };
};

type Transaction = {
  id: string;
  name: string;
  amount: string;
  date: string;
  nextBill: string;
  method: string;
  status: string;
  view: string;
};

function AdminDashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    users: {
      total: 0,
      active: 0,
      growth: 0,
      activeGrowth: 0,
    },
    content: {
      total: 0,
      published: 0,
      growth: 0,
    },
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching admin dashboard data...");
        const data = await apiFetch("/api/admin/dashboard-overview");
        console.log("Dashboard data received:", data);

        // Fix the data structure - stats should be the whole object, not just users
        setStats({
          users: data.users || {
            total: 0,
            active: 0,
            growth: 0,
            activeGrowth: 0,
          },
          content: data.content || {
            total: 0,
            published: 0,
            growth: 0,
          },
        });

        // Ensure transactions is always an array
        const transactionsData = Array.isArray(data.transactions) ? data.transactions : [];
        console.log("Transactions data:", transactionsData);
        setTransactions(transactionsData);
        setLoading(false);
      } catch (error: unknown) {
        console.error("Failed to load dashboard data:", error.message);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Users"
          value={(stats.users?.total ?? 0).toLocaleString()}
          change={`${(stats.users?.growth ?? 0) >= 0 ? "+" : ""}${stats.users?.growth ?? 0}%`}
          isPositive={(stats.users?.growth ?? 0) >= 0}
        />
        <DashboardCard
          title="Active Users (24h)"
          value={(stats.users?.active ?? 0).toLocaleString()}
          change={`${(stats.users?.activeGrowth ?? 0) >= 0 ? "+" : ""}${stats.users?.activeGrowth ?? 0}%`}
          isPositive={(stats.users?.activeGrowth ?? 0) >= 0}
        />
        <DashboardCard
          title="Published Items"
          value={(stats.content?.published ?? 0).toLocaleString()}
          change={`${(stats.content?.growth ?? 0) >= 0 ? "+" : ""}${stats.content?.growth ?? 0}%`}
          isPositive={(stats.content?.growth ?? 0) >= 0}
        />
        <DashboardCard
          title="Total Content"
          value={(stats.content?.total ?? 0).toLocaleString()}
          change={`${(stats.content?.growth ?? 0) >= 0 ? "+" : ""}${stats.content?.growth ?? 0}%`}
          isPositive={(stats.content?.growth ?? 0) >= 0}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <SearchBar placeholder="Search Transactions..." onSearch={setSearch} />
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gray-100 rounded-md">Filter</button>
            <button className="px-4 py-2 bg-gray-100 rounded-md">Export</button>
          </div>
        </div>

        {loading ? (
          <p>Loading transactions...</p>
        ) : (
          <DataTable
            headers={['BILLING ID', 'NAME', 'AMOUNT', 'DATE', 'NEXT BILL', 'METHOD', 'STATUS', 'VIEW']}
            data={transactions}
            keys={['id', 'name', 'amount', 'date', 'nextBill', 'method', 'status', 'view']}
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
  );
}

export default function AdminDashboard() {
  return (
    <AuthGuard>
      <AdminDashboardContent />
    </AuthGuard>
  );
}
