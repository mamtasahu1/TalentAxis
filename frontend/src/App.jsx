import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Companies from './pages/Companies';
import JobDetails from './pages/JobDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview';
import AdminJobs from './pages/admin/AdminJobs';
import AdminCreateJob from './pages/admin/AdminCreateJob';
import AdminEditJob from './pages/admin/AdminEditJob';
import AdminApplications from './pages/admin/AdminApplications';
import AdminUsers from './pages/admin/AdminUsers';
import AdminContacts from './pages/admin/AdminContacts';

import NotFound from './pages/NotFound';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Student Protected Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/applications"
              element={
                <ProtectedRoute allowedRole="student">
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRole="student">
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Student Legacy Aliases for Seamless URL Navigation */}
            <Route path="/student-dashboard" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="/my-applications" element={<Navigate to="/student/applications" replace />} />
            <Route path="/profile" element={<Navigate to="/student/profile" replace />} />

            {/* Admin Protected Routes with Dedicated Left Sidebar Layout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminOverview />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="jobs/create" element={<AdminCreateJob />} />
              <Route path="jobs/:id/edit" element={<AdminEditJob />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="contact" element={<Navigate to="/admin/contacts" replace />} />
            </Route>

            {/* Admin Legacy Aliases for Seamless URL Navigation */}
            <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

