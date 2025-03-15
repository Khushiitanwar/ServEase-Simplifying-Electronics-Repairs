import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function ShopkeeperDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Shop Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back, {user?.name}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Placeholder for service management */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Manage Services</h3>
                <p className="mt-1 text-sm text-gray-500">Add, edit, or remove services</p>
              </div>
            </div>

            {/* Placeholder for pending requests */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Pending Requests</h3>
                <p className="mt-1 text-sm text-gray-500">View and manage incoming service requests</p>
              </div>
            </div>

            {/* Placeholder for delivery personnel */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Delivery Personnel</h3>
                <p className="mt-1 text-sm text-gray-500">Assign and manage delivery staff</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}