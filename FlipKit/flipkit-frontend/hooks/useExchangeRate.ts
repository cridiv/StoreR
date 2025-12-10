"use client";

import { useState, useEffect } from "react";

export function useExchangeRate(defaultRate = 1500) {
  const [rate, setRate] = useState(defaultRate);

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        if (data.rates?.NGN) {
          setRate(data.rates.NGN);
        }
      })
      .catch((err) => {
        console.error("Exchange rate fetch failed", err);
        // Keep fallback
      });
  }, []);

  return rate;
}