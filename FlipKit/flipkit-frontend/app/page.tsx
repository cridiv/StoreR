'use client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import AuthGuard from "./components/AuthGuard";

import Dashboard from "./dashboard/Dashboard";
import ProductPage from "./products/ProductPage";
import SupplierPage from "./supplier/SupplierPage";
import PurchasePage from "./purchase/PurchasePage";
import SupplierDetails from "./supplier/supplierdetail/SupplierDetail";
import LandingPage from "./components/LandingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/dashboard",
    element: (
      <AuthGuard>
        <Dashboard />
      </AuthGuard>
    ),
  },
  {
    path: "/products",
    element: (
      <AuthGuard>
        <ProductPage />
      </AuthGuard>
    ),
  },
  {
    path: "/supplier",
    element: (
      <AuthGuard>
        <SupplierPage />
      </AuthGuard>
    ),
  },
  {
    path: "/purchase",
    element: (
      <AuthGuard>
        <PurchasePage />
      </AuthGuard>
    ),
  },
  {
    path: "/supplierdetail",
    element: (
      <AuthGuard>
        <SupplierDetails />
      </AuthGuard>
    ),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
