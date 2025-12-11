'use client'
import AuthGuard from "../components/AuthGuard";
import PurchasePage from "./PurchasePage";

export default function Purchase() {
  return (
    <AuthGuard>
      <PurchasePage />
    </AuthGuard>
  );
}