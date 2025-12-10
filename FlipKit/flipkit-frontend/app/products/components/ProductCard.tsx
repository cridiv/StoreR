"use client";
import React from "react";

type Product = {
  itemId: string;
  title: string;
  imageUrl: string;
  priceText: string;
  shipping?: string;
  url: string;
  viewCount?: number;
  listingDate?: string;
};

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isPopular = product.viewCount && product.viewCount > 1000;
  const isNew =
    product.listingDate &&
    new Date().getTime() - new Date(product.listingDate).getTime() <
      7 * 24 * 60 * 60 * 1000;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "300px",
        display: "flex",
        flexDirection: "column",
        borderRadius: "16px",
        border: "1px solid rgba(75, 85, 99, 0.3)",
        background: "black",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.borderColor = "rgba(75, 85, 99, 0.3)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(75, 85, 99, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(75, 85, 99, 0.4)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Tags - Positioned over image */}
      {(isPopular || isNew) && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            display: "flex",
            gap: "6px",
            zIndex: 10,
          }}
        >
          {isNew && (
            <span
              style={{
                padding: "6px 12px",
                fontSize: "11px",
                fontWeight: "600",
                borderRadius: "20px",
                background: "rgba(30, 27, 75, 0.3)",
                color: "#fff",
                border: "1px solid rgba(75, 85, 99, 0.3)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              NEW
            </span>
          )}
          {isPopular && (
            <span
              style={{
                padding: "6px 12px",
                fontSize: "11px",
                fontWeight: "600",
                borderRadius: "20px",
                backgroundColor: "rgba(255, 107, 0, 0.9)",
                color: "#fff",
                border: "none",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 12px rgba(255, 107, 0, 0.3)",
              }}
            >
              🔥 HOT
            </span>
          )}
        </div>
      )}

      {/* Image Container */}
      <div
        style={{
          height: "220px",
          width: "100%",
          padding: "0px",
          background: "rgba(0, 0, 0, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)",
          }}
        />
        <img
          src={product.imageUrl}
          alt={product.title}
          style={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            position: "relative",
            zIndex: 1,
            filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))",
          }}
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/300";
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          flexGrow: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Title */}
        <h3
          style={{
            fontSize: "15px",
            fontWeight: "600",
            color: "#fff",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: "1.5",
            minHeight: "45px",
          }}
        >
          {product.title}
        </h3>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
          }}
        />

        {/* Price Section */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
            <p
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#fff",
                letterSpacing: "-0.5px",
              }}
            >
              {product.priceText}
            </p>
          </div>
          {product.shipping && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <p
                style={{
                  fontSize: "13px",
                  color: "#9CA3AF",
                  fontWeight: "500",
                }}
              >
                {product.shipping}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Button */}
      <div style={{ padding: "0 20px 20px 20px" }}>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            padding: "14px",
            background: "linear-gradient(180deg, #0F172A 0%, #1E1B4B 50%, #2D1B69 100%)",
            border: "1px solid rgba(75, 85, 99, 0.3)",
            borderRadius: "10px",
            color: "#fff",
            fontSize: "14px",
            fontWeight: "600",
            textAlign: "center",
            textDecoration: "none",
            transition: "all 0.3s ease",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
            e.currentTarget.style.borderColor = "rgba(75, 85, 99, 0.3)";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "linear-gradient(180deg, #0F172A 0%, #1E1B4B 50%, #2D1B69 100%)";
            e.currentTarget.style.borderColor = "rgba(75, 85, 99, 0.3)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          View Details
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default ProductCard;