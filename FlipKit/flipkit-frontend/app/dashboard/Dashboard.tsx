'use client'
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ProductsPage from "../products/ProductPage";
import SupplierPage from "../supplier/SupplierPage";
import PurchasePage from "../purchase/PurchasePage";

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState("products");
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      // Optional: Auto-collapse sidebar on mobile (recommended)
      if (mobile) {
        setSidebarOpen(false); // Start collapsed on mobile
      } else {
        setSidebarOpen(true);  // Default open on desktop
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Function to render content based on selected menu item
  const renderContent = () => {
    switch (selectedItem) {
      case "products":
        return <ProductsPage />;

      case "supplier":
        return <SupplierPage />;

      case "purchases":
        return <PurchasePage />;

      case "settings":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Settings
            </h1>
            <p className="text-gray-400 text-lg">
              Settings page coming soon...
            </p>
          </div>
        );

      case "account":
        return (
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Account
            </h1>
            <p className="text-gray-400 text-lg">
              Account details are shown in the modal
            </p>
          </div>
        );

      default:
        return (
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Welcome to StoreRadar
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar - Mobile slide-in, Desktop fixed */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />

      {/* Main Content */}
      <main
        className={`
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? "w-full px-4 pt-20" 
            : sidebarOpen 
              ? "ml-64" 
              : "ml-20"
          }
        `}
        style={{
          // Mobile: full width, top padding for safe area
          paddingTop: isMobile ? "1.5rem" : "2rem",
          paddingLeft: isMobile ? "1rem" : "2rem",
          paddingRight: isMobile ? "1rem" : "2rem",
          paddingBottom: "2rem",
          minHeight: "100vh",
        }}
      >
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Optional: Mobile top bar spacer if you add a header later */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 pointer-events-none z-30" />
      )}
    </div>
  );
};

export default Dashboard;