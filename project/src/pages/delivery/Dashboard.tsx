import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function DeliveryDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Delivery Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back, {user?.name}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Placeholder for assigned tasks */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Assigned Tasks</h3>
                <p className="mt-1 text-sm text-gray-500">View your current delivery assignments</p>
              </div>
            </div>

            {/* Placeholder for earnings */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Earnings</h3>
                <p className="mt-1 text-sm text-gray-500">Track your earnings and payouts</p>
              </div>
            </div>

            {/* Placeholder for performance */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Performance</h3>
                <p className="mt-1 text-sm text-gray-500">View your delivery statistics</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}