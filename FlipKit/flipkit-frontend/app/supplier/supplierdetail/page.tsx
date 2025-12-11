import { Suspense } from "react";
import SupplierDetail from "./SupplierDetail";

export default function Details() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SupplierDetail />
    </Suspense>
  );
}