import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from './hooks/useAuth';

// Lazy load components
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const CustomerDashboard = React.lazy(() => import('./pages/customer/Dashboard'));
const ShopkeeperDashboard = React.lazy(() => import('./pages/shopkeeper/Dashboard'));
const DeliveryDashboard = React.lazy(() => import('./pages/delivery/Dashboard'));

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <Router>
      <React.Suspense
        fallback={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        }
      >
        <Routes>
          {!user ? (
            <Route path="*" element={<AuthPage />} />
          ) : (
            <>
              {user.role === 'customer' && (
                <Route path="/*" element={<CustomerDashboard />} />
              )}
              {user.role === 'shopkeeper' && (
                <Route path="/*" element={<ShopkeeperDashboard />} />
              )}
              {user.role === 'delivery' && (
                <Route path="/*" element={<DeliveryDashboard />} />
              )}
            </>
          )}
        </Routes>
      </React.Suspense>
    </Router>
  );
}

export default App;