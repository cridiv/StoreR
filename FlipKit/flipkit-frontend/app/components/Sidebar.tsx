'use client'
import React, { useState } from "react";
import AccountModal from "./AccountModal";

// Simple Icon Components
const PackageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const TruckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13"/>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const CartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v6m0 6v6m-5-5l5-5 5 5M7 17l5 5 5-5"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedItem: string;
  setSelectedItem: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, selectedItem, setSelectedItem }) => {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const topMenuItems = [
    { id: "products", name: "Products", icon: PackageIcon, path: "/products" },
    { id: "supplier", name: "Vendors", icon: TruckIcon, path: "/supplier" },
    { id: "purchases", name: "Purchases", icon: CartIcon },
  ];

  const bottomMenuItems = [
    { id: "settings", name: "Settings", icon: SettingsIcon },
    { id: "account", name: "Account", icon: UserIcon },
  ];

  const handleMenuClick = (itemId: string) => {
    if (itemId === "account") {
      setShowAccountModal(true);
      return;
    }

    setSelectedItem(itemId);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          onClick={onToggle}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 40,
          }}
        />
      )}

      {/* Mobile toggle button (only visible when sidebar is closed) */}
      {isMobile && !isOpen && (
        <button
          onClick={onToggle}
          style={{
            position: "fixed",
            left: "16px",
            top: "16px",
            zIndex: 60,
            background: "black",
            border: "1px solid rgba(75, 85, 99, 0.5)",
            borderRadius: "8px",
            padding: "12px",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Open sidebar"
        >
          <ChevronRightIcon />
        </button>
      )}

      <div
        style={{
          width: isMobile ? "256px" : (isOpen ? "256px" : "80px"),
          height: "100vh",
          background: "black",
          borderRight: "1px solid rgba(75, 85, 99, 0.3)",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s ease, width 0.3s ease",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 50,
          transform: isMobile && !isOpen ? "translateX(-100%)" : "translateX(0)",
        }}
      >
        {/* Toggle Button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
          }}
        >
          <div style={{ minWidth: 0 }}>
            {(isOpen || isMobile) && (
              <span
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "18px",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                StoreRadar
              </span>
            )}
          </div>
          <button
            onClick={onToggle}
            style={{
              color: "#fff",
              background: "transparent",
              border: "none",
              padding: "8px",
              borderRadius: "6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            {(isOpen || isMobile) ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </button>
        </div>

        <div style={{ borderTop: "1px solid rgba(75, 85, 99, 0.3)", marginBottom: "16px" }} />

        {/* Top Menu Items */}
        <nav style={{ flex: 1, padding: "0 8px" }}>
          {topMenuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: (isOpen || isMobile) ? "flex-start" : "center",
                  gap: "12px",
                  padding: "12px 16px",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  background: isSelected ? "linear-gradient(90deg, #0F172A 0%, #1E1B4B 50%, #2D1B69 100%)" : "transparent",
                  color: "#fff",
                  border: isSelected ? "1px solid rgba(75, 85, 99, 0.5)" : "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Icon />
                {(isOpen || isMobile) && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>

        <div style={{ borderTop: "1px solid rgba(75, 85, 99, 0.3)", margin: "16px 0" }} />

        {/* Bottom Menu Items */}
        <nav style={{ padding: "0 8px 16px 8px" }}>
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: (isOpen || isMobile) ? "flex-start" : "center",
                  gap: "12px",
                  padding: "12px 16px",
                  marginBottom: "8px",
                  borderRadius: "8px",
                  background: isSelected ? "linear-gradient(90deg, #0F172A 0%, #1E1B4B 50%, #2D1B69 100%)" : "transparent",
                  color: "#fff",
                  border: isSelected ? "1px solid rgba(75, 85, 99, 0.5)" : "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Icon />
                {(isOpen || isMobile) && <span>{item.name}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Account Modal */}
      <AccountModal isOpen={showAccountModal} onClose={() => setShowAccountModal(false)} />
    </>
  );
};

export default Sidebar;
