import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Inventory from './pages/Inventory';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Coupons from './pages/Coupons';
import Reviews from './pages/Reviews';
import Settings from './pages/Settings';

// Wrapper component for protected routes with layout
const AdminLayout = ({ children, darkMode, setDarkMode, toggleSidebar, sidebarOpen, setSidebarOpen }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Hidden by default on mobile

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public route */}
          <Route 
            path="/login" 
            element={
              <Login onSuccess={() => window.location.href = '/'} />
            } 
          />
          
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  toggleSidebar={toggleSidebar}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                >
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <AdminLayout
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  toggleSidebar={toggleSidebar}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                >
                  <Categories />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <AdminLayout
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  toggleSidebar={toggleSidebar}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                >
                  <Products />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/add"
            element={
              <ProtectedRoute>
                <AdminLayout
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  toggleSidebar={toggleSidebar}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                >
                  <AddProduct />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <AdminLayout
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  toggleSidebar={toggleSidebar}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                >
                  <Orders />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <AdminLayout
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  toggleSidebar={toggleSidebar}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                >
                  <OrderDetails />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <AdminLayout
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  toggleSidebar={toggleSidebar}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                >
                  <Inventory />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <AdminLayout
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  toggleSidebar={toggleSidebar}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                >
                  <Users />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
<Route
  path="/users/:id"
  element={
    <ProtectedRoute>
      <AdminLayout
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        toggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      >
        <UserDetail onBack={() => window.history.back()} />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
          <Route
            path="/coupons"
            element={
              <ProtectedRoute>
                <AdminLayout
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  toggleSidebar={toggleSidebar}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                >
                  <Coupons />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reviews"
            element={
              <ProtectedRoute>
                <AdminLayout
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  toggleSidebar={toggleSidebar}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                >
                  <Reviews />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AdminLayout
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  toggleSidebar={toggleSidebar}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                >
                  <Settings />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect any unknown paths to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;