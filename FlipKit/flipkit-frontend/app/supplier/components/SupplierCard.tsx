"use client";
import { useRouter } from "next/navigation";
import React from "react";

type Supplier = {
  supplierId: string;
  name: string;
  logoUrl?: string;
  rating?: number;
  totalProducts?: number;
  responseTime?: string;
  avgOrder?: string;
  url: string;
  category?: string;
};

type SupplierCardProps = {
  supplier: Supplier;
};

const SupplierCard: React.FC<SupplierCardProps> = ({ supplier }) => {
  const router = useRouter();
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "380px",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        border: "1px solid rgba(75, 85, 99, 0.3)",
        backgroundColor: "black",
        backdropFilter: "blur(20px)",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.borderColor = "rgba(75, 85, 99, 0.3)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(75, 85, 99, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(75, 85, 99, 0.3)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <style>{`
        @media (max-width: 640px) {
          .supplier-card-container {
            max-width: 100% !important;
            border-radius: 12px !important;
          }
          .supplier-logo-section {
            height: 140px !important;
          }
          .supplier-name {
            font-size: 18px !important;
            bottom: 12px !important;
            left: 16px !important;
            right: 16px !important;
          }
          .supplier-content {
            padding: 16px !important;
            gap: 12px !important;
          }
          .supplier-category-badge {
            padding: 4px 10px !important;
            font-size: 11px !important;
          }
          .supplier-stats-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .supplier-stat-item {
            padding: 12px !important;
          }
          .supplier-stat-label {
            font-size: 10px !important;
          }
          .supplier-stat-value {
            font-size: 16px !important;
          }
          .supplier-button-container {
            padding: 0 16px 16px 16px !important;
          }
          .supplier-view-button {
            padding: 12px !important;
            font-size: 13px !important;
          }
        }
        
        @media (max-width: 480px) {
          .supplier-logo-section {
            height: 120px !important;
          }
          .supplier-name {
            font-size: 16px !important;
          }
          .supplier-content {
            padding: 12px !important;
            gap: 10px !important;
          }
          .supplier-stat-item {
            padding: 10px !important;
          }
          .supplier-stat-label {
            font-size: 9px !important;
          }
          .supplier-stat-value {
            font-size: 14px !important;
          }
        }
      `}</style>

      {/* Logo and Name Section */}
      <div
        className="supplier-logo-section"
        style={{
          width: "100%",
          height: "180px",
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid rgba(75, 85, 99, 0.3)",
        }}
      >
        {supplier.logoUrl && (
          <img
            src={supplier.logoUrl}
            alt={supplier.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/380x180/000000/39FF14?text=" + encodeURIComponent(supplier.name);
            }}
          />
        )}
        {/* Dark overlay for better text readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
            zIndex: 1,
          }}
        />
        {/* Text overlay */}
        <h3
          className="supplier-name"
          style={{
            position: "absolute",
            bottom: "16px",
            left: "24px",
            right: "24px",
            fontSize: "20px",
            fontWeight: "700",
            color: "#fff",
            letterSpacing: "-0.3px",
            zIndex: 2,
            textAlign: "left",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          {supplier.name}
        </h3>
      </div>

      {/* Content */}
      <div
        className="supplier-content"
        style={{
          flexGrow: 1,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Category */}
        {supplier.category && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              className="supplier-category-badge"
              style={{
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: "600",
                borderRadius: "6px",
                backgroundColor: "rgba(30, 27, 75, 0.3)",
                color: "#FFFFFF",
                border: "1px solid rgba(75, 85, 99, 0.3)",
              }}
            >
              {supplier.category}
            </span>
          </div>
        )}

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(75, 85, 99, 0.3), transparent)",
          }}
        />

        {/* Stats Grid */}
        <div
          className="supplier-stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "auto auto",
            position: "relative",
          }}
        >
          {/* Vertical divider */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "0",
              bottom: "0",
              width: "1px",
              background: "rgb(15, 23, 42)",
              transform: "translateX(-0.5px)",
            }}
          />
          {/* Horizontal divider */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "0",
              right: "0",
              height: "1px",
              background: "rgb(15, 23, 42)",
              transform: "translateY(-0.5px)",
            }}
          />
          
          {supplier.rating && (
            <div className="supplier-stat-item" style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "6px", 
              padding: "20px",
              alignItems: "flex-start",
              justifyContent: "center"
            }}>
              <span className="supplier-stat-label" style={{ fontSize: "11px", color: "#6B7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Rating
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="supplier-stat-value" style={{ fontSize: "18px", fontWeight: "700", color: "#FFFFFF" }}>
                  {supplier.rating.toFixed(1)}
                </span>
                <span style={{ fontSize: "14px", color: "#FFD700" }}>★</span>
              </div>
            </div>
          )}
          
          {supplier.totalProducts && (
            <div className="supplier-stat-item" style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "6px", 
              padding: "20px",
              alignItems: "flex-end",
              justifyContent: "center"
            }}>
              <span className="supplier-stat-label" style={{ fontSize: "11px", color: "#6B7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Products
              </span>
              <span className="supplier-stat-value" style={{ fontSize: "18px", fontWeight: "700", color: "#FFFFFF" }}>
                {supplier.totalProducts.toLocaleString()}
              </span>
            </div>
          )}
          
          {supplier.responseTime && (
            <div className="supplier-stat-item" style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "6px", 
              padding: "20px",
              alignItems: "flex-start",
              justifyContent: "center"
            }}>
              <span className="supplier-stat-label" style={{ fontSize: "11px", color: "#6B7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Response
              </span>
              <span className="supplier-stat-value" style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>
                {supplier.responseTime}
              </span>
            </div>
          )}
          
          {supplier.avgOrder && (
            <div className="supplier-stat-item" style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: "6px", 
              padding: "20px",
              alignItems: "flex-end",
              justifyContent: "center"
            }}>
              <span className="supplier-stat-label" style={{ fontSize: "11px", color: "#6B7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Avg. Order
              </span>
              <span className="supplier-stat-value" style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>
                {supplier.avgOrder}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Button */}
      <div className="supplier-button-container" style={{ padding: "0 24px 24px 24px" }}>
        <button
          className="supplier-view-button"
          onClick={() => router.push(`/supplier/supplierdetail?id=${supplier.supplierId}`)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            padding: "14px",
            background: "linear-gradient(180deg, rgb(15, 23, 42) 0%, rgb(30, 27, 75) 50%, rgb(45, 27, 105) 100%)",
            border: "1px solid rgba(75, 85, 99, 0.3)",
            borderRadius: "10px",
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: "600",
            textAlign: "center",
            transition: "all 0.3s ease",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "linear-gradient(180deg, rgb(15, 23, 42) 0%, rgb(30, 27, 75) 50%, rgb(45, 27, 105) 100%)";
            e.currentTarget.style.borderColor = "rgba(75, 85, 99, 0.3)";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "linear-gradient(180deg, rgb(15, 23, 42) 0%, rgb(30, 27, 75) 50%, rgb(45, 27, 105) 100%)";
            e.currentTarget.style.borderColor = "rgba(75, 85, 99, 0.3)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          View Supplier
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SupplierCard;