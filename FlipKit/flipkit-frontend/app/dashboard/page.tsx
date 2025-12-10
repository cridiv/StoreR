"use client"; // If using Next.js App Router

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "./Dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    // Check for token in URL (from Google OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // Store the token
      localStorage.setItem('auth_token', token);
      
      // Clean up URL (remove ?token=...)
      window.history.replaceState({}, document.title, window.location.pathname);
      
      console.log('Token saved successfully');
    }
    
    // Check if user is authenticated
    const storedToken = localStorage.getItem('auth_token');
    
    if (!storedToken) {
      // No token found, redirect to login
      router.push('/'); // or wherever your login page is
    } else {
      setIsAuthenticating(false);
    }
  }, [router]);

if (isAuthenticating) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#000',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid rgba(99, 102, 241, 0.2)',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#9CA3AF' }}>Authenticating...</p>
      </div>
    </div>
  );
}

  return (
    <div>
      <Dashboard />
    </div>
  );
}