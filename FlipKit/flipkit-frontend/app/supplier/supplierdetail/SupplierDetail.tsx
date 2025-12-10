"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CheckoutButton from "../../components/Payment";

/* Icons */
const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const ShoppingCartIcon = ({ count }: { count: number }) => (
  <div style={{ position: "relative", display: "inline-block" }}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
    {count > 0 && (
      <span
        style={{
          position: "absolute",
          top: "-6px",
          right: "-8px",
          backgroundColor: "#39FF14",
          color: "black",
          fontSize: "10px",
          fontWeight: 700,
          borderRadius: 10,
          padding: "2px 6px",
          minWidth: 16,
          textAlign: "center",
        }}
      >
        {count}
      </span>
    )}
  </div>
);

type Supplier = {
  id: string;
  name: string;
  price: string;
  contact?: string;
  picture?: string;
  res_time?: string;
  ratings?: string;
  category?: string;
  avg_price?: string;
  tot_prod?: string;
};

export default function SupplierDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supplierId = searchParams.get("id");

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState<boolean>(!!supplierId);
  const [quantity, setQuantity] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [cartCount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(1500);

  useEffect(() => {
    if (!supplierId) {
      return;
    }

    fetch(`https://storer-xd46.onrender.com/vendors/${supplierId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Vendor not found');
        }
        return res.json();
      })
      .then((data) => {
        console.log("vendor detail payload:", data);
        setSupplier(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then((res) => res.json())
      .then((data) => {
        if (data.rates && data.rates.NGN) {
          setExchangeRate(data.rates.NGN);
        }
      })
      .catch((err) => {
        console.error('Exchange rate fetch failed:', err);
      });
  }, [supplierId]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#060606", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 18, color: "#9CA3AF" }}>Loading...</div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#060606", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ fontSize: 18, color: "#9CA3AF" }}>Supplier not found</div>
        <button
          onClick={() => router.back()}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            backgroundColor: "#39FF14",
            border: "none",
            color: "#000",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  const Price = supplier.price ? parseFloat(supplier.price.replace(/[^0-9.]/g, '')) : 9.99;
  const totalPrice = Number((Price * Math.max(1, quantity)).toFixed(2));
  const totalPriceNGN = Math.round(totalPrice * exchangeRate);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060606", color: "#fff", paddingBottom: 48 }}>
      <style jsx>{`
        @media (max-width: 1024px) {
          .main-layout {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          
          .purchase-panel {
            position: relative !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 600px !important;
            margin: 0 auto !important;
          }
        }

        @media (max-width: 768px) {
          .header-container {
            padding: 12px 16px !important;
          }
          
          .header-title {
            font-size: 14px !important;
          }
          
          .header-supplier-name {
            display: none !important;
          }
          
          .main-layout {
            margin: 16px auto !important;
            padding: 0 16px !important;
          }
          
          .supplier-card-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          
          .avg-price-box {
            align-self: flex-start !important;
            min-width: auto !important;
          }
          
          .product-image-container {
            height: 240px !important;
            padding: 20px !important;
          }
          
          .stats-row {
            flex-direction: column !important;
            gap: 8px !important;
            align-items: flex-start !important;
          }
          
          .purchase-panel {
            width: 100% !important;
            padding: 16px !important;
          }
          
          .total-display {
            font-size: 24px !important;
          }
          
          .unit-price-display {
            font-size: 14px !important;
          }
        }

        @media (max-width: 480px) {
          .supplier-card {
            border-radius: 12px !important;
          }
          
          .supplier-card-header {
            padding: 14px 16px !important;
          }
          
          .supplier-title {
            font-size: 18px !important;
          }
          
          .supplier-description {
            font-size: 12px !important;
          }
          
          .avg-price-box {
            padding: 8px 12px !important;
          }
          
          .avg-price-label {
            font-size: 11px !important;
          }
          
          .avg-price-value {
            font-size: 18px !important;
          }
          
          .product-image-container {
            height: 200px !important;
            padding: 16px !important;
          }
          
          .image-box {
            width: 70% !important;
          }
          
          .footer-content {
            padding: 14px 16px 18px 16px !important;
          }
          
          .action-buttons {
            flex-direction: column !important;
            width: 100% !important;
            gap: 8px !important;
          }
          
          .action-buttons > * {
            width: 100% !important;
          }
          
          .total-display {
            font-size: 22px !important;
          }
          
          .quantity-controls {
            flex-wrap: wrap !important;
          }
        }
      `}</style>

      {/* Top bar */}
      <header
        className="header-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 28px",
          borderBottom: "1px solid #374151",
          background: "linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4))",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => router.back()}
            aria-label="Back"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: "rgba(30, 27, 75, 0.3)",
              border: "1px solid #374151",
              color: "#fff",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#4B5563";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(255,255,255,0.03)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#374151";
            }}
          >
            <ArrowLeftIcon />
          </button>

          <h1 className="header-title" style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Vendors</h1>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div className="header-supplier-name" style={{ fontSize: 13, color: "#9CA3AF" }}>{supplier.name}</div>
          <button
            aria-label="Cart"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.02)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <ShoppingCartIcon count={cartCount} />
          </button>
        </div>
      </header>

      {/* Main layout */}
      <main
        className="main-layout"
        style={{
          maxWidth: 1100,
          margin: "28px auto",
          padding: "0 20px",
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Left: Supplier Card */}
        <div
          className="supplier-card"
          style={{
            borderRadius: 16,
            border: "1px solid #374151",
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(18px)",
            overflow: "hidden",
            transition: "all 0.25s ease",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 40px rgba(55,65,81,0.3)";
            (e.currentTarget as HTMLDivElement).style.borderColor = "#4B5563";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            (e.currentTarget as HTMLDivElement).style.borderColor = "#374151";
          }}
        >
          {/* Header area */}
          <div className="supplier-card-header" style={{ display: "flex", justifyContent: "space-between", padding: "18px 20px", alignItems: "center" }}>
            <div>
              <h2 className="supplier-title" style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{supplier.name}</h2>
              <p className="supplier-description" style={{ margin: "6px 0 0 0", color: "#9CA3AF", fontSize: 13 }}>
                {supplier.category || "Premium quality products at competitive prices"}
              </p>
            </div>

            <div
              className="avg-price-box"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: "rgba(30, 27, 75, 0.3)",
                border: "1px solid #374151",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                minWidth: 96,
              }}
            >
              <div className="avg-price-label" style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600 }}>Avg price</div>
              <div className="avg-price-value" style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginTop: 6 }}>
                {supplier.avg_price || `$${Price.toFixed(2)}`}
              </div>
            </div>
          </div>

          {/* Image area */}
          <div
            className="product-image-container"
            style={{
              height: 320,
              padding: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              background: "#0a0a0a",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "radial-gradient(circle at 30% 40%, rgba(55,65,81,0.2), transparent 40%)",
                pointerEvents: "none",
              }}
            />
            <div
              className="image-box"
              style={{
                width: "56%",
                aspectRatio: "1",
                backgroundColor: "#000",
                borderRadius: 14,
                overflow: "hidden",
                border: "6px solid rgba(55,65,81,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={supplier.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supplier.id}`}
                alt={supplier.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", padding: 10 }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/400";
                }}
              />
            </div>
          </div>

          {/* Footer content */}
          <div className="footer-content" style={{ padding: "18px 20px 22px 20px" }}>
            {/* Stats row */}
            <div className="stats-row" style={{ display: "flex", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
              {supplier.ratings && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, color: "#9CA3AF" }}>Rating:</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#FFD700" }}>
                    {parseFloat(supplier.ratings).toFixed(1)} ★
                  </span>
                </div>
              )}
              {supplier.tot_prod && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, color: "#9CA3AF" }}>Products:</span>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{parseInt(supplier.tot_prod).toLocaleString()}</span>
                </div>
              )}
              {supplier.res_time && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, color: "#9CA3AF" }}>Response:</span>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{supplier.res_time}</span>
                </div>
              )}
              {supplier.contact && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, color: "#9CA3AF" }}>Contact:</span>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{supplier.contact}</span>
                </div>
              )}
            </div>

            <div className="action-buttons" style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
              <div
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  backgroundColor: "rgba(30, 27, 75, 0.3)",
                  color: "#FFF",
                  fontWeight: 800,
                  fontSize: 12,
                  border: "1px solid #374151",
                }}
              >
                In Stock
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  aria-label="Add to cart"
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "linear-gradient(180deg, rgb(15, 23, 42) 0%, rgb(30, 27, 75) 50%, rgb(45, 27, 105) 100%)",
                    border: "none",
                    color: "#FFF",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Purchase panel */}
        <aside
          className="purchase-panel"
          style={{
            position: "sticky",
            top: 28,
            alignSelf: "start",
          }}
        >
          <div
            style={{
              width: 360,
              borderRadius: 16,
              border: "1px solid #374151",
              backgroundColor: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(14px)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>Total (USD)</div>
                <div className="total-display" style={{ fontSize: 28, fontWeight: 900, color: "#FFF" }}>${totalPrice}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                  ≈ ₦{totalPriceNGN.toLocaleString()} NGN
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, color: "#9CA3AF" }}>Unit Price</div>
                <div className="unit-price-display" style={{ fontSize: 16, fontWeight: 800 }}>${Price.toFixed(2)}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                  ≈ ₦{Math.round(Price * exchangeRate).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="quantity-controls" style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ fontSize: 13, color: "#9CA3AF", minWidth: 70 }}>Quantity</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid #374151",
                    color: "#fff",
                    fontSize: 18,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  −
                </button>

                <input
                  aria-label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
                  style={{
                    width: 68,
                    padding: "10px 12px",
                    borderRadius: 10,
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid #374151",
                    color: "#fff",
                    fontWeight: 700,
                    textAlign: "center",
                    outline: "none",
                  }}
                />

                <button
                  aria-label="Increase quantity"
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid #374151",
                    color: "#fff",
                    fontSize: 18,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>
                Email <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid #374151",
                  color: "#fff",
                  outline: "none",
                }}
              />
            </div>

            {/* Username */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="JohnDoe"
                style={{
                  padding: "12px 14px",
                  borderRadius: 10,
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid #374151",
                  color: "#fff",
                  outline: "none",
                }}
              />
            </div>

            {/* Terms */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 13,
                color: "#9CA3AF",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "#39FF14", cursor: "pointer" }}
              />
              <span>
                Agree to the stores terms <span style={{ color: "#EF4444" }}>*</span>
              </span>
            </label>

            {/* Payment info box */}
            <div style={{ 
              padding: "12px 14px", 
              borderRadius: 10, 
              backgroundColor: "rgba(57, 255, 20, 0.05)", 
              border: "1px solid rgba(57, 255, 20, 0.2)",
              marginBottom: 8
            }}>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 4 }}>
                You'll be charged in Nigerian Naira (NGN)
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#39FF14" }}>
                ₦{totalPriceNGN.toLocaleString()} NGN
              </div>
              <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                at exchange rate: ₦{exchangeRate.toFixed(2)}/USD
              </div>
            </div>

            {/* Action button */}
            <CheckoutButton
              email={email}
              username={username}
              agreedToTerms={agreedToTerms}
              totalPrice={totalPrice}
              totalPriceNGN={totalPriceNGN}
            />
          </div>
        </aside>
      </main>
    </div>
  );
}