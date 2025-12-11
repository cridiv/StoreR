'use client'
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import SupplierCard from "./components/SupplierCard";


const Banner = dynamic(() => import("./components/Banner"), {
  ssr: false,
  loading: () => (
    <div style={{ 
      height: "200px", 
      background: "linear-gradient(to bottom right, #111827, #000000, #111827)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{ color: "#9CA3AF" }}>Loading...</div>
    </div>
  ),
});

type Supplier = {
  id: string;
  supplierId: string;
  name: string;
  url: string;
  tot_prod: string;
  contact?: string;
  picture?: string;
  res_time?: string;
  ratings?: string;
  category?: string;
  avg_price?: string;
};

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://storer-xd46.onrender.com/vendors")
      .then((res) => res.json())
      .then((data) => {
        console.log("vendors payload:", data);
        const list =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.vendors)
            ? data.vendors
            : Array.isArray(data?.data)
            ? data.data
            : [];

        setSuppliers(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "black" }}>
      <style jsx>{`
        .supplier-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          width: 100%;
        }

        @media (max-width: 1024px) {
          .supplier-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }

        @media (max-width: 640px) {
          .supplier-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .supplier-container {
            padding: 16px !important;
          }
        }
      `}</style>

      <Banner />

      <div className="supplier-container" style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px" }}>
        <div className="supplier-grid">
          {suppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={{
                supplierId: supplier.id,
                name: supplier.name,
                url: supplier.url,
                logoUrl: supplier.picture,
                rating: supplier.ratings ? parseFloat(supplier.ratings) : undefined,
                totalProducts: supplier.tot_prod ? parseInt(supplier.tot_prod) : undefined,
                responseTime: supplier.res_time,
                avgOrder: supplier.avg_price,
                category: supplier.category,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}