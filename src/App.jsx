import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import DirectoryPage from '@/pages/DirectoryPage';
import MembershipPage from '@/pages/MembershipPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import AdminPage from '@/pages/AdminPage';
import EventsPage from '@/pages/EventsPage';
import BlogPage from '@/pages/BlogPage';
import CommunityPage from '@/pages/CommunityPage';
import MessagesPage from '@/pages/MessagesPage';
import ComingSoonPage from '@/pages/ComingSoonPage';
import WaitlistPage from '@/pages/WaitlistPage';
import MakeMeAdmin from '@/pages/MakeMeAdmin';
import ContactPage from '@/pages/ContactPage';
import FreeRegistrationPage from '@/pages/FreeRegistrationPage';
import ThankYouPage from '@/pages/ThankYouPage';

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>BizLink Alliance - Sacramento Business Networking Platform</title>
        <meta name="description" content="Connect with Sacramento's premier business network. Find service providers, build partnerships, and grow your business through BizLink Alliance." />
      </Helmet>
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/directory" element={<DirectoryPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/messages/:recipientId" element={<MessagesPage />} />
          <Route path="/waitlist" element={<WaitlistPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/register/free" element={<FreeRegistrationPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/make-me-admin" element={<MakeMeAdmin />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;