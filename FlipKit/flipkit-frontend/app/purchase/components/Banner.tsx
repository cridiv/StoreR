"use client";
import React from "react";
import { motion } from "framer-motion";
import "@fontsource/quantico/700.css";



const ShoppingCartIcon: React.FC<{ count?: number } & React.HTMLAttributes<HTMLDivElement>> = ({ count, className, style, ...rest }) => (
  <div
    style={{ position: "relative", display: "inline-block", ...(style as React.CSSProperties) }}
    className={className}
    {...rest}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
    {count && count > 0 && (
      <span
        style={{
          position: "absolute",
          top: -6,
          right: -8,
          backgroundColor: "#2D1B69",
          color: "#000",
          fontSize: 11,
          fontWeight: 800,
          borderRadius: 12,
          padding: "2px 6px",
        }}
      >
        {count}
      </span>
    )}
  </div>
);


export default function Banner() {
  return (
    <div className="relative pt-10 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mt-2 rounded-2xl mb-2 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4"
        >
          <h1
            style={{ fontFamily: "quantico, sans-serif" }}
            className="text-3xl flex gap-3 md:text-3xl font-bold text-white mb-3"
          >
            <ShoppingCartIcon className="w-10 h-10" style={{ color: "rgba(45, 27, 105)" }} />
            Purchase
          </h1>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2"></div>
            <p className="text-gray-400">
              Discover quality products at the best prices. Track trends, compare marketplaces, and find items worth flipping.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-1/2 left-10 w-20 h-20 bg-pink-500/10 rounded-full animate-pulse"></div>
      <div className="absolute top-1/4 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-bounce"></div>
      <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-green-500/10 rounded-full animate-pulse"></div>
    </div>
  );
};