"use client";

import axios from "axios";
import React from "react";

export default function CheckoutButton(props: {
  email: string;
  username: string;
  agreedToTerms: boolean;
  totalPrice: number;
  totalPriceNGN: number;
}) {
  const { email, username, agreedToTerms, totalPrice, totalPriceNGN } = props;
  const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";

  const handlePay = async () => {
    if (typeof window === "undefined") return; // 🔥 absolute safety

    if (!key) {
      alert("Missing Paystack public key");
      return;
    }
    if (!email || !username || !agreedToTerms) return;

    // 🔥 load Paystack ONLY in the browser
    const PaystackPop = (await import("@paystack/inline-js")).default;

    const paystack = new PaystackPop();

    paystack.newTransaction({
      key,
      email,
      amount: Math.round(totalPriceNGN * 100),

      onSuccess: async (res: any) => {
        alert(`Payment successful! Reference: ${res.reference}`);

        try {
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
      onClick={handlePay}
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
    >
      Complete Purchase — ${totalPrice}
    </button>
  );
}
