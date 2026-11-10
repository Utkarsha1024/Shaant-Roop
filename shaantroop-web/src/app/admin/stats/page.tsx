"use client";

import { useEffect, useState } from "react";
import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/apiFetch";
import type { DashboardStatsResponseDTO } from "@/lib/types";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = ['#234A31', '#F4C130', '#3b82f6', '#ef4444', '#8b5cf6', '#10b981'];

export default function AdminStatsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStatsResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading || !user) return;
    
    api
      .get<DashboardStatsResponseDTO>("/api/admin/dashboard/stats")
      .then((data) => setStats(data))
      .catch((err) => setError("Failed to fetch dashboard statistics: " + err.message))
      .finally(() => setIsLoading(false));
  }, [user, authLoading]);

  // Convert object maps to arrays for Recharts and Lists
  const ageData = stats?.ageDemographics
    ? Object.entries(stats.ageDemographics).map(([name, value]) => ({ name, value }))
    : [];

  const stateData = stats?.stateDistribution
    ? Object.entries(stats.stateDistribution)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
    : [];

  return (
    <AdminDashboardLayout title="Analytics & Statistics">
      <div className="p-6 max-w-7xl mx-auto font-sans">
        
        {/* Loading / Error States */}
        {isLoading || authLoading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-[#234A31] rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-red-600 bg-red-50 rounded-lg shadow-sm border border-red-100">{error}</div>
        ) : stats ? (
          <div className="space-y-8">
            {/* ROW 1: KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Total Orders
                </p>
                <p className="text-3xl font-bold" style={{ color: "#234A31" }}>
                  {stats.totalOrders?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Total Products
                </p>
                <p className="text-3xl font-bold" style={{ color: "#234A31" }}>
                  {stats.totalProducts?.toLocaleString() || "0"}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Total Categories
                </p>
                <p className="text-3xl font-bold" style={{ color: "#234A31" }}>
                  {stats.totalCategories?.toLocaleString() || "0"}
                </p>
              </div>
            </div>

            {/* ROW 2: Trends & Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Trend Line Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-6" style={{ color: "#234A31" }}>
                  Sales Trends Over Time
                </h2>
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={stats.salesOverTime}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} tickFormatter={(val) => `₹${val}`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => [`₹${Number(value || 0).toFixed(2)}`, "Revenue"]}
                        labelStyle={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="#F4C130" strokeWidth={3} dot={{ r: 4, fill: "#F4C130", strokeWidth: 0 }} activeDot={{ r: 6, fill: "#234A31", stroke: "#fff", strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Categorical Distribution Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold mb-6" style={{ color: "#234A31" }}>
                  Category Performance (Revenue)
                </h2>
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.categoryMetrics}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                      <YAxis dataKey="categoryName" type="category" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
                      <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`₹${Number(value || 0).toFixed(2)}`, "Revenue"]} />
                      <Bar dataKey="totalRevenue" fill="#234A31" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* ROW 3: Pie Chart Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Selling Products */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
                <h2 className="text-lg font-semibold w-full text-left mb-6" style={{ color: "#234A31" }}>
                  Top Selling Products
                </h2>
                <div className="w-full h-64">
                  {stats.topSellingProducts && stats.topSellingProducts.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.topSellingProducts}
                          dataKey="quantitySold"
                          nameKey="productName"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label={({ name, percent }: any) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                        >
                          {stats.topSellingProducts.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">No product sales data available.</div>
                  )}
                </div>
              </div>

              {/* Age Group Breakdown */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
                <h2 className="text-lg font-semibold w-full text-left mb-6" style={{ color: "#234A31" }}>
                  Age Demographics
                </h2>
                <div className="w-full h-64">
                  {ageData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ageData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          fill="#8884d8"
                          paddingAngle={5}
                          label
                        >
                          {ageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">No demographic data available.</div>
                  )}
                </div>
              </div>
            </div>

            {/* ROW 4: Geographic Leaderboard */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold mb-6" style={{ color: "#234A31" }}>
                Top Geographic Regions (Order Volume)
              </h2>
              {stateData.length > 0 ? (
                <div className="overflow-hidden bg-white border border-gray-100 rounded-lg">
                  <ul className="divide-y divide-gray-100">
                    {stateData.map((state, idx) => (
                      <li key={state.name} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-400 w-6">{idx + 1}.</span>
                          <span className="font-medium text-gray-700">{state.name}</span>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#f0fdf4] text-[#166534]">
                          {state.value} Orders
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  No geographic data available.
                </div>
              )}
            </div>

          </div>
        ) : null}
      </div>
    </AdminDashboardLayout>
  );
}
