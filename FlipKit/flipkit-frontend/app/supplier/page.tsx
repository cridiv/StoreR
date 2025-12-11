'use client'
import AuthGuard from "../components/AuthGuard";
import SupplierPage from "./SupplierPage";

export default function Supplier() {
  return (
    <AuthGuard>
      <SupplierPage />
    </AuthGuard>
  );
}