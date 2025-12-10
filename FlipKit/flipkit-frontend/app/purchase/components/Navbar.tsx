"use client";
import React from "react";


const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="6" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);


const ShoppingCartIcon = ({ count }: { count?: number }) => (
  <div style={{ position: "relative", display: "inline-block" }}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
    {count && count > 0 && (
      <span
        style={{
          position: "absolute",
          top: -6,
          right: -8,
          backgroundColor: "#39FF14",
          color: "#000",
          fontSize: 11,
          fontWeight: 800,
          borderRadius: 12,
          padding: "2px 6px",
        }}
      >
        {count}
      </span>
    )}
  </div>
);

export default function Navbar({ cartCount = 0 }: { cartCount?: number }) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 28px",
        borderBottom: "1px solid rgba(57,255,20,0.06)",
        background: "linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4))",
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ fontWeight: 900, color: "#39FF14", letterSpacing: 0.6 }}>FairMart</span>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>Purchases</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.02)",
          }}
        >
          <SearchIcon />
          <input
            placeholder="Search purchases, vendors, invoices..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              width: 320,
              fontSize: 14,
            }}
          />
        </div>

        <button
          title="Cart"
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.02)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <ShoppingCartIcon count={cartCount} />
        </button>
      </div>
    </header>
  );
}