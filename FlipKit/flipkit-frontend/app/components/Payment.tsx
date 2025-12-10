"use client";

// @ts-expect-error: no declaration file for '@paystack/inline-js'
import PaystackPop from "@paystack/inline-js";
import axios from "axios";
import React from "react";

export default function CheckoutButton({
  email,
  username,
  agreedToTerms,
  totalPrice,
  totalPriceNGN,
}: {
  email: string;
  username: string;
  agreedToTerms: boolean;
  totalPrice: number;
  totalPriceNGN: number;
}) {
  const key: string = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";

  const handlePay = async () => {
    if (!key) {
      alert("Missing Paystack public key");
      return;
    }
    if (!email || !username || !agreedToTerms) return;

    const paystack = new PaystackPop();

    paystack.newTransaction({
      key,
      email,
      amount: Math.round(totalPriceNGN * 100), // Paystack uses kobo

      onSuccess: async (res: any) => {
        alert(`Payment successful! Reference: ${res.reference}`);

        try {
          // 🔥 BACKEND VERIFICATION
          const verify = await axios.post(
            "https://storer-xd46.onrender.com/paystack/verify",
            {
              reference: res.reference,
              email,
              amount: Math.round(totalPriceNGN * 100),
            }
          );

          console.log("VERIFIED:", verify.data);
          alert("Payment verified & recorded!");
        } catch (err) {
          console.error(err);
          alert("Payment succeeded but verification failed!");
        }
      },

      onCancel: () => {
        alert("Payment canceled");
      },
    });
  };

  return (
    <button
      disabled={!email || !username || !agreedToTerms}
      style={{
        marginTop: 6,
        padding: "14px 16px",
        borderRadius: 12,
        border: "none",
        backgroundColor:
          email && username && agreedToTerms
            ? "#2D1B69"
            : "rgba(45, 27, 105, 0.3)",
        color: email && username && agreedToTerms ? "#fff" : "#9CA3AF",
        fontWeight: 900,
        cursor:
          email && username && agreedToTerms ? "pointer" : "not-allowed",
        transition: "transform 0.12s ease",
      }}
      onMouseEnter={(e) => {
        if (email && username && agreedToTerms) {
          (e.currentTarget as HTMLButtonElement).style.transform =
            "scale(1.02)";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
      onClick={handlePay}
    >
      Complete Purchase — ${totalPrice}
    </button>
  );
}
