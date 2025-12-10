"use client";
import React, { useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import PurchaseCard, { Purchase } from "./components/PurchaseCard";
import Banner from "./components/Banner";

/* Mock data */
const mockPurchases: Purchase[] = [
  {
    id: "p-001",
    type: "product",
    title: "FairPods 2 — Wireless Earbuds",
    imageUrl: "https://via.placeholder.com/300x300?text=Earbuds",
    date: "2025-11-18T10:22:00Z",
    unitPrice: 29.99,
    quantity: 1,
    totalPrice: 29.99,
    status: "delivered",
    meta: "Amazon",
  },
  {
    id: "p-002",
    type: "supplier",
    title: "FairPods Vendor — Bulk Stock",
    imageUrl: "https://via.placeholder.com/300x300?text=Vendor",
    date: "2025-10-04T12:10:00Z",
    unitPrice: 9.99,
    quantity: 50,
    totalPrice: 499.5,
    status: "delivered",
    meta: "Supplier",
  },
  {
    id: "p-003",
    type: "product",
    title: "Silicone Case for FairPods",
    imageUrl: "https://via.placeholder.com/300x300?text=Case",
    date: "2025-11-01T14:00:00Z",
    unitPrice: 7.5,
    quantity: 2,
    totalPrice: 15.0,
    status: "processing",
    meta: "eBay",
  },
  {
    id: "p-004",
    type: "product",
    title: "Fast Charger — 18W",
    imageUrl: "https://via.placeholder.com/300x300?text=Charger",
    date: "2025-09-20T09:12:00Z",
    unitPrice: 12.0,
    quantity: 1,
    totalPrice: 12.0,
    status: "refunded",
    meta: "Store",
  },
];

function Sparkline({ values = [10, 18, 12, 22, 32, 28, 40] }: { values?: number[] }) {
  const width = 200;
  const height = 48;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    })
    .join(" ");
  const path = `M ${points.split(" ").join(" L ")}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id="sparkG" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(57,255,20,0.16)" />
          <stop offset="100%" stopColor="rgba(57,255,20,0.02)" />
        </linearGradient>
      </defs>
      <path d={path} stroke="#2D1B69" strokeWidth={2.2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={points} fill="url(#sparkG)" stroke="none" opacity={0.14} />
    </svg>
  );
}

function SummaryCard({ title, value, children }: { title: string; value: string; children?: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        background: "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))",
        border: "1px solid rgba(75,85,99,0.3)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 180,
      }}
    >
      <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: "#FFF" }}>{value}</div>
      <div>{children}</div>
    </div>
  );
}

export default function PurchasesPage() {
  const [tab, setTab] = useState<"all" | "products" | "suppliers">("all");
  const [query, setQuery] = useState("");
  const purchases = mockPurchases;

  const filtered = useMemo(() => {
    const byTab = purchases.filter((p) => (tab === "all" ? true : tab === "products" ? p.type === "product" : p.type === "supplier"));
    if (!query.trim()) return byTab;
    return byTab.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()) || (p.meta || "").toLowerCase().includes(query.toLowerCase()));
  }, [tab, query, purchases]);

  const totalSpent = purchases.reduce((s, p) => s + p.totalPrice, 0);
  const totalOrders = purchases.length;
  const last30 = [10, 18, 12, 22, 32, 28, 40];

  // Quick changed: blur the entire page content and show a centered "Coming Soon..." message
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", color: "#fff", paddingBottom: 48, position: "relative" }}>
      {/* The real page content is wrapped in a container that will be blurred */}
      <div style={{ filter: "blur(6px)", WebkitFilter: "blur(6px)", pointerEvents: "none" }}>
        <Banner />

        <main
          style={{
            maxWidth: 1200,
            margin: "28px auto",
            padding: "0 20px",
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 24,
          }}
        >
          {/* Left column */}
          <section>
            {/* Header / controls */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>Your purchases</h1>
                <div style={{ color: "#9CA3AF", fontSize: 13, marginTop: 6 }}>All orders, invoices & supplier buys in one place</div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["all", "products", "suppliers"] as const).map((t) => {
                    const active = tab === t;
                    const label = t === "all" ? "All" : t === "products" ? "Products" : "Suppliers";
                    return (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 10,
                          border: active ? "1px solid rgba(75,85,99,0.36)" : "1px solid rgba(255,255,255,0.02)",
                          background: active ? "linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(45,27,105,0.85) 100%)" : "transparent",
                          color: active ? "#FFF" : "#fff",
                          fontWeight: 800,
                          cursor: "pointer",
                          transition: "all 0.16s ease",
                        }}
                        onMouseEnter={(e) => {
                          const b = e.currentTarget;
                          if (!active) b.style.background = "rgba(255,255,255,0.02)";
                          b.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          const b = e.currentTarget;
                          if (!active) b.style.background = "transparent";
                          b.style.transform = "translateY(0)";
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Search / filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by title, source or invoice id..."
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.03)",
                  background: "rgba(255,255,255,0.02)",
                  color: "#fff",
                  outline: "none",
                  transition: "box-shadow 0.12s ease",
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLInputElement).style.boxShadow = "0 10px 30px rgba(57,255,20,0.04)";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLInputElement).style.boxShadow = "none";
                }}
              />

              <select
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.03)",
                  color: "#fff",
                  cursor: "pointer",
                }}
                defaultValue="all"
              >
                <option value="all">All statuses</option>
                <option value="delivered">Delivered</option>
                <option value="processing">Processing</option>
                <option value="refunded">Refunded</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Purchases list */}
            <div style={{ display: "grid", gap: 12 }}>
              {filtered.length === 0 ? (
                <div
                  style={{
                    padding: 28,
                    borderRadius: 12,
                    border: "1px dashed rgba(255,255,255,0.03)",
                    color: "#9CA3AF",
                    background: "linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0.35))",
                  }}
                >
                  No purchases match your search.
                </div>
              ) : (
                filtered.map((p) => <PurchaseCard key={p.id} p={p} />)
              )}
            </div>
          </section>

          {/* Right column - Analytics / quick filters */}
          <aside style={{ position: "sticky", top: 28, alignSelf: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <SummaryCard title="Total spent" value={`$${totalSpent.toFixed(2)}`}>
                <div style={{ marginTop: 6 }}>
                  <Sparkline values={last30} />
                </div>
              </SummaryCard>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <SummaryCard title="Orders" value={`${totalOrders}`} />
                <SummaryCard title="Suppliers" value={`${mockPurchases.filter((x) => x.type === "supplier").length}`} />
              </div>

              <div
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid rgba(75,85,99,0.3)",
                  background: "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))",
                }}
              >
                <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 700 }}>Quick actions</div>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(75,85,99,0.36)",
                      background: "linear-gradient(180deg, #0F172A 0%, #1E1B4B 50%, #2D1B69 100%)",
                      color: "#fff",
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "transform 0.12s ease",
                    }}
                    onMouseEnter={(e) => {
                      const b = e.currentTarget;
                      b.style.transform = "translateY(-3px) scale(1.02)";
                      b.style.background = "rgba(255,255,255,0.04)";
                      b.style.borderColor = "rgba(75,85,99,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      const b = e.currentTarget;
                      b.style.transform = "translateY(0) scale(1)";
                      b.style.background = "linear-gradient(180deg, #0F172A 0%, #1E1B4B 50%, #2D1B69 100%)";
                      b.style.borderColor = "rgba(75,85,99,0.36)";
                    }}
                  >
                    Export CSV
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.02)",
                      background: "transparent",
                      color: "#fff",
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "background 0.12s ease, transform 0.12s ease",
                    }}
                    onMouseEnter={(e) => {
                      const b = e.currentTarget;
                      b.style.background = "rgba(255,255,255,0.02)";
                      b.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      const b = e.currentTarget;
                      b.style.background = "transparent";
                      b.style.transform = "translateY(0)";
                    }}
                  >
                    Help
                  </button>
                </div>
              </div>

              <div
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: "1px solid rgba(75,85,99,0.3)",
                  background: "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.35))",
                }}
              >
                <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 700, marginBottom: 8 }}>Recent invoices</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <a
                    href="#"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#fff",
                      textDecoration: "none",
                      padding: "8px 10px",
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.01)",
                    }}
                  >
                    <span style={{ color: "#9CA3AF" }}>INV-2025-0912</span>
                    <span style={{ color: "#FFF", fontWeight: 800 }}>$499.50</span>
                  </a>

                  <a
                    href="#"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      color: "#fff",
                      textDecoration: "none",
                      padding: "8px 10px",
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.01)",
                    }}
                  >
                    <span style={{ color: "#9CA3AF" }}>INV-2025-1118</span>
                    <span style={{ color: "#FFF", fontWeight: 800 }}>$29.99</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>

      {/* Overlay that displays the centered "Coming Soon..." message (appears above the blurred content) */}
      <div
        aria-hidden={false}
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          pointerEvents: "none", // prevents blocking page unless you want it to block interactions
        }}
      >
        <div
          style={{
            pointerEvents: "auto",
            padding: "28px 36px",
            borderRadius: 12,
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            textAlign: "center",
            transform: "translateY(-10px)",
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 900, color: "#FFFFFF", lineHeight: 1 }}>Coming Soon...</div>
          <div style={{ marginTop: 8, fontSize: 14, color: "#9CA3AF" }}>We're making this page ready for launch.</div>
        </div>
      </div>
    </div>
  );
}