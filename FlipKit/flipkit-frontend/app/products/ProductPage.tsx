"use client";
import React, { useEffect, useState, useMemo } from "react";
import ProductCard from "./components/ProductCard";
import Banner from "./components/Banner";

// Icons (inline SVG components)
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const RefreshIcon = ({ spinning }: { spinning?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    style={{
      animation: spinning ? "spin 1s linear infinite" : "none",
    }}
  >
    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
  </svg>
);

const ChevronDownIcon = ({ rotated }: { rotated?: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    style={{
      transform: rotated ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.2s",
    }}
  >
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const THEME = {
  colors: {
    background: "#0F172A",
    backgroundAlt: "#1E1B4B",
    backgroundDeep: "#2D1B69",
    surface: "#21262d",
    border: "#374151",
    borderLight: "rgba(55, 65, 81, 0.3)",
    text: {
      primary: "#ffffff",
      secondary: "#9CA3AF",
    },
    accent: "#39FF14",
  },
  gradients: {
    radial: "radial-gradient(circle at 50% 0%, rgba(57, 255, 20, 0.15), transparent 50%)",
    purple: "linear-gradient(to right, #0F172A, #1E1B4B, #2D1B69)",
  },
};

const SORT_OPTIONS = [
  { value: "recent", label: "Recently Listed", icon: ClockIcon },
  { value: "popular", label: "Most Popular", icon: TrendingUpIcon },
  { value: "price-low", label: "Price: Low to High", icon: StarIcon },
  { value: "price-high", label: "Price: High to Low", icon: StarIcon },
];

const CATEGORIES = [
  { value: "skincare", label: "Skincare" },
  { value: "fashion", label: "Fashion" },
  { value: "fragrances", label: "Fragrances" },
  { value: "pets", label: "Pets" },
  { value: "necklace", label: "Necklace" },
];

interface Product {
  itemId: string;
  title: string;
  imageUrl: string;
  priceText: string;
  shipping: string;
  url: string;
  viewCount?: number;
  listingDate: string;
}

const normalizeProduct = (item: any): Product => {
  return {
    itemId: item.itemId || item.item_id || item.id || "",
    title: item.title || item.name || "",
    imageUrl: item.imageUrl || item.image_url || item.image || item.thumbnail || "",
    priceText: item.priceText || item.price_text || item.price || "",
    shipping: item.shipping || item.shipping_cost || "",
    url: item.url || item.link || item.productUrl || "",
    viewCount: item.viewCount || item.view_count || item.views || 0,
    listingDate: item.listingDate || item.listing_date || item.created_at || new Date().toISOString(),
  };
};

const ProductPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [showFilters, setShowFilters] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("necklace");

  const filteredProducts = useMemo<Product[]>(() => {
    const list = Array.isArray(products) ? products : [];
    let filtered = [...list];
    
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.itemId.includes(searchQuery)
      );
    }

    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
      case "price-low":
        filtered.sort(
          (a, b) =>
            parseFloat(a.priceText.replace(/[^0-9.]/g, "")) -
            parseFloat(b.priceText.replace(/[^0-9.]/g, ""))
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) =>
            parseFloat(b.priceText.replace(/[^0-9.]/g, "")) -
            parseFloat(a.priceText.replace(/[^0-9.]/g, ""))
        );
        break;
      case "recent":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.listingDate).getTime() -
            new Date(a.listingDate).getTime()
        );
        break;
    }

    return filtered;
  }, [searchQuery, sortBy, products, selectedCategory]);

  useEffect(() => {
    const endpoint = selectedCategory === "all" 
      ? "http://localhost:8000/products/"
      : `http://localhost:8000/products/${selectedCategory}`;
    
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        const list = Array.isArray(data) ? data : (Array.isArray(data?.products) ? data.products : []);
        console.log("Parsed products:", list);
        
        if (list.length > 0) {
          console.log("First product fields:", Object.keys(list[0]));
          console.log("First product sample:", list[0]);
        }
        
        const normalizedProducts = list.map(normalizeProduct);
        console.log("Normalized first product:", normalizedProducts[0]);
        
        setProducts(normalizedProducts);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setProducts([]);
      });
  }, [selectedCategory]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    const endpoint = selectedCategory === "all" 
      ? "http://localhost:8000/products"
      : `http://localhost:8000/products/${selectedCategory}`;
    
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        console.log("Refresh API Response:", data);
        const list = Array.isArray(data) ? data : (Array.isArray(data?.products) ? data.products : []);
        console.log("Refreshed products:", list);
        
        const normalizedProducts = list.map(normalizeProduct);
        
        setProducts(normalizedProducts);
        setIsRefreshing(false);
      })
      .catch((err) => {
        console.error("Refresh error:", err);
        setIsRefreshing(false);
      });
  };
  
  const currentSort = SORT_OPTIONS.find((opt) => opt.value === sortBy);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "black" }}>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .filter-bar {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          width: 100%;
        }

        @media (max-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .page-container {
            padding: 20px 16px !important;
          }

          .filter-bar {
            flex-direction: column;
            gap: 12px;
          }

          .filter-section {
            margin-bottom: 24px !important;
          }

          .category-dropdown,
          .search-input-wrapper,
          .sort-dropdown,
          .refresh-button {
            width: 100% !important;
            min-width: 100% !important;
          }

          .products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .results-bar {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 12px;
          }

          .empty-state {
            padding: 64px 20px !important;
          }

          .empty-state-icon {
            width: 60px !important;
            height: 60px !important;
          }

          .empty-state-title {
            font-size: 20px !important;
          }

          .empty-state-text {
            font-size: 14px !important;
            padding: 0 16px;
          }
        }

        @media (max-width: 480px) {
          .page-container {
            padding: 16px 12px !important;
          }

          .products-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .filter-button,
          .dropdown-button {
            font-size: 13px !important;
            padding: 10px 16px !important;
          }

          .search-input {
            font-size: 13px !important;
            padding: 10px 12px 10px 44px !important;
          }

          .results-count {
            font-size: 13px !important;
          }

          .empty-state {
            padding: 48px 16px !important;
          }

          .empty-state-icon {
            width: 50px !important;
            height: 50px !important;
            margin-bottom: 16px !important;
          }

          .empty-state-title {
            font-size: 18px !important;
            margin-bottom: 6px !important;
          }

          .empty-state-text {
            font-size: 13px !important;
            margin-bottom: 16px !important;
          }
        }
      `}</style>

      <Banner />

      <div className="page-container" style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px" }}>
        {/* Search and Filters Bar */}
        <div className="filter-section" style={{ marginBottom: "32px" }}>
          <div className="filter-bar">
            {/* Category Dropdown */}
            <div style={{ position: "relative", flex: "0 0 auto" }}>
              <button
                className="category-dropdown dropdown-button"
                onClick={() => setShowCategories(!showCategories)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 20px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(75, 85, 99, 0.3)",
                  borderRadius: "12px",
                  color: "#fff",
                  cursor: "pointer",
                  minWidth: "160px",
                  justifyContent: "space-between",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor =
                    "rgba(75, 85, 99, 0.6)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor =
                    "rgba(75, 85, 99, 0.3)")
                }
              >
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  {CATEGORIES.find(c => c.value === selectedCategory)?.label || "Categories"}
                </span>
                <ChevronDownIcon rotated={showCategories} />
              </button>

              {showCategories && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    width: "100%",
                    minWidth: "200px",
                    backgroundColor: "black",
                    border: "1px solid rgb(15, 23, 42)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    zIndex: 10,
                    backdropFilter: "blur(16px)",
                  }}
                >
                  {CATEGORIES.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => {
                        setSelectedCategory(category.value);
                        setShowCategories(false);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        padding: "12px 16px",
                        backgroundColor: selectedCategory === category.value 
                          ? "rgba(30, 27, 75)" 
                          : "transparent",
                        color: "#fff",
                        border: "none",
                        textDecoration: "none",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedCategory !== category.value) {
                          e.currentTarget.style.backgroundColor = "rgba(30, 27, 75, 0.5)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 
                          selectedCategory === category.value 
                            ? "rgba(30, 27, 75)" 
                            : "transparent";
                      }}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search */}
            <div className="search-input-wrapper" style={{ flex: 1, minWidth: "250px", position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9CA3AF",
                }}
              >
                <SearchIcon />
              </div>
              <input
                className="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                style={{
                  width: "100%",
                  paddingLeft: "48px",
                  paddingRight: "16px",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgb(15, 23, 42)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "rgb(15, 23, 42)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgb(15, 23, 42)")
                }
              />
            </div>

            {/* Sort Dropdown */}
            <div style={{ position: "relative", flex: "0 0 auto" }}>
              <button
                className="sort-dropdown dropdown-button"
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgb(15, 23, 42)",
                  borderRadius: "12px",
                  color: "#fff",
                  cursor: "pointer",
                  minWidth: "200px",
                  justifyContent: "space-between",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor =
                    "rgb(15, 23, 42)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor =
                    "rgb(15, 23, 42)")
                }
              >
                {currentSort && (
                  <>
                    <div style={{ color: "#9CA3AF" }}>
                      <currentSort.icon />
                    </div>
                    <span style={{ flex: 1, textAlign: "left", fontSize: "14px" }}>
                      {currentSort.label}
                    </span>
                    <ChevronDownIcon rotated={showFilters} />
                  </>
                )}
              </button>

              {showFilters && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: "100%",
                    backgroundColor: "#000",
                    border: "1px solid rgb(15, 23, 42)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    zIndex: 10,
                    backdropFilter: "blur(16px)",
                  }}
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setShowFilters(false);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        backgroundColor:
                          sortBy === option.value
                            ? "rgb(30, 27, 75)"
                            : "transparent",
                        color: sortBy === option.value ? "#fff" : "#fff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (sortBy !== option.value) {
                          e.currentTarget.style.backgroundColor =
                            "rgba(255, 255, 255, 0.05)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (sortBy !== option.value) {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }
                      }}
                    >
                      <option.icon />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <button
              className="refresh-button filter-button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                background: THEME.gradients.purple,
                border: `1px solid ${THEME.colors.border}`,
                borderRadius: "12px",
                color: THEME.colors.text.primary,
                fontSize: "14px",
                fontWeight: "600",
                cursor: isRefreshing ? "not-allowed" : "pointer",
                opacity: isRefreshing ? 0.5 : 1,
                transition: "all 0.2s",
                flex: "0 0 auto",
              }}
              onMouseEnter={(e) => {
                if (!isRefreshing) {
                  e.currentTarget.style.opacity = "0.8";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = isRefreshing ? "0.5" : "1";
              }}
            >
              <RefreshIcon spinning={isRefreshing} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Results Count */}
          <div
            className="results-bar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "16px",
            }}
          >
            <p className="results-count" style={{ color: "#9CA3AF", fontSize: "14px", margin: 0 }}>
              {filteredProducts.length} product
              {filteredProducts.length === 1 ? "" : "s"} found
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "#fff",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <XIcon />
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div
              key={product.itemId}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div
            className="empty-state"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "96px 0",
            }}
          >
            <div
              className="empty-state-icon"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "rgba(30, 27, 75, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
              }}
            >
              <SearchIcon />
            </div>
            <h3
              className="empty-state-title"
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#fff",
                marginBottom: "8px",
              }}
            >
              No Products Found
            </h3>
            <p
              className="empty-state-text"
              style={{
                color: "#9CA3AF",
                textAlign: "center",
                maxWidth: "400px",
                marginBottom: "24px",
              }}
            >
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term.`
                : "No products available at the moment."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#fff",
                  border: "1px solid rgba(30, 27, 75, 0.3)",
                  borderRadius: "12px",
                  color: "#000",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.9)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "#fff")
                }
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;