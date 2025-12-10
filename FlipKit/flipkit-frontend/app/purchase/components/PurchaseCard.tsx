"use client";
import React from "react";

export type Purchase = {
  id: string;
  type: "product" | "supplier";
  title: string;
  imageUrl?: string;
  date: string; // ISO
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  status: "delivered" | "processing" | "refunded" | "cancelled";
  meta?: string;
};

const StatusPill = ({ status }: { status: Purchase["status"] }) => {
  const map: Record<
    Purchase["status"],
    { background: string; color: string; border?: string; boxShadow?: string; text: string }
  > = {
    delivered: {
      background: "rgba(30, 27, 75, 0.3)",
      color: "#FFF",
      border: "1px solid rgba(57,255,20,0.12)",
      boxShadow: "0 6px 14px rgba(57,255,20,0.04)",
      text: "Delivered",
    },
    processing: {
      background: "rgba(30, 27, 75, 0.3)",
      color: "#fff",
      border: "1px solid rgba(75,85,99,0.3)",
      boxShadow: "0 6px 14px rgba(0,0,0,0.4)",
      text: "Processing",
    },
    refunded: {
      background: "linear-gradient(90deg, rgba(255,107,0,0.16), rgba(255,255,255,0.02))",
      color: "#fff",
      border: "1px solid rgba(255,107,0,0.26)",
      boxShadow: "0 6px 14px rgba(255,107,0,0.08)",
      text: "Refunded",
    },
    cancelled: {
      background: "linear-gradient(90deg, rgba(239,68,68,0.12), rgba(255,255,255,0.02))",
      color: "#fff",
      border: "1px solid rgba(239,68,68,0.18)",
      boxShadow: "0 6px 14px rgba(239,68,68,0.06)",
      text: "Cancelled",
    },
  };

  const s = map[status];

  return (
    <div
      style={{
        padding: "6px 12px",
        borderRadius: 20,
        background: s.background,
        color: s.color,
        fontWeight: 800,
        fontSize: 12,
        border: s.border,
        boxShadow: s.boxShadow,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {s.text}
    </div>
  );
};

export default function PurchaseCard({ p }: { p: Purchase }) {
  const isSupplier = p.type === "supplier";
  const date = new Date(p.date).toLocaleString();

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        display: "flex",
        gap: 16,
        padding: 18,
        borderRadius: 16,
        border: "1px solid rgba(75, 85, 99, 0.3)",
        background: "black",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.28s cubic-bezier(0.4,0,0.2,1)",
      }}
      onMouseEnter={(e) => {
        const t = e.currentTarget;
        t.style.transform = "translateY(-8px)";
        t.style.boxShadow = "0 20px 40px rgba(75, 85, 99, 0.3)";
        t.style.borderColor = "rgba(75,85,99,0.36)";
      }}
      onMouseLeave={(e) => {
        const t = e.currentTarget;
        t.style.transform = "translateY(0)";
        t.style.boxShadow = "none";
        t.style.borderColor = "rgba(75, 85, 99, 0.3)";
      }}
    >
      {/* Top-right small tags (type + status) */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          display: "flex",
          gap: 8,
          zIndex: 10,
          alignItems: "center",
        }}
      >
        <div
          style={{
            padding: "6px 10px",
            fontSize: 11,
            fontWeight: 700,
            borderRadius: 20,
            background: "rgba(255,255,255,0.02)",
            color: "#fff",
            border: "1px solid rgba(75,85,99,0.2)",
            backdropFilter: "blur(6px)",
          }}
        >
          {isSupplier ? "Supplier" : "Product"}
        </div>
        <StatusPill status={p.status} />
      </div>

      {/* Image / thumbnail */}
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 12,
          overflow: "hidden",
          background: "rgba(255,255,255,0.02)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "6px solid rgba(255,255,255,0.03)",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.04) 0%, transparent 50%)",
          }}
        />
        <img
          src={p.imageUrl || "https://via.placeholder.com/300"}
          alt={p.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "relative", zIndex: 1 }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/300";
          }}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase" }}>
                {isSupplier ? "Supplier" : "Product"}
              </div>
              <div
                style={{
                  padding: "6px 10px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.02)",
                  fontSize: 12,
                  color: "#fff",
                  fontWeight: 800,
                }}
              >
                {p.meta || ""}
              </div>
            </div>

            <h3
              style={{
                margin: "8px 0 0 0",
                fontSize: 16,
                fontWeight: 800,
                color: "#fff",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.4,
              }}
            >
              {p.title}
            </h3>

            <div style={{ marginTop: 6, fontSize: 13, color: "#9CA3AF" }}>{date}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <div style={{ fontSize: 13, color: "#9CA3AF" }}>Qty {p.quantity}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#FFF" }}>
              ${p.totalPrice.toFixed(2)}
            </div>
            {/* small duplicate of status for accessibility on narrow screens */}
            <div style={{ display: "none" }}>
              <StatusPill status={p.status} />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            marginTop: 6,
          }}
        />

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <a
            href="#"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(75,85,99,0.18)",
              background: "linear-gradient(180deg, #0F172A 0%, #1E1B4B 50%, #2D1B69 100%)",
              color: "#fff",
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.18s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              const a = e.currentTarget;
              a.style.background = "rgba(255,255,255,0.06)";
              a.style.transform = "scale(1.02)";
              a.style.borderColor = "rgba(75,85,99,0.3)";
            }}
            onMouseLeave={(e) => {
              const a = e.currentTarget;
              a.style.background = "linear-gradient(180deg, #0F172A 0%, #1E1B4B 50%, #2D1B69 100%)";
              a.style.transform = "scale(1)";
              a.style.borderColor = "rgba(75,85,99,0.18)";
            }}
          >
            View receipt
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          <button
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.02)",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
              transition: "all 0.12s ease",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget;
              b.style.background = "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.04))";
              b.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget;
              b.style.background = "rgba(255,255,255,0.03)";
              b.style.transform = "translateY(0)";
            }}
          >
            Reorder
          </button>
        </div>
      </div>
    </div>
  );
}