"use client";

import { useEffect } from "react";

interface Props {
  onRate: (rate: number) => void;
}

export default function ExchangeRateClient({ onRate }: Props) {
  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((r) => r.json())
      .then((data) => {
        if (data?.rates?.NGN) {
          onRate(data.rates.NGN);
        }
      })
      .catch(() => onRate(1500)); // fallback
  }, [onRate]);

  return null; // renders nothing
}