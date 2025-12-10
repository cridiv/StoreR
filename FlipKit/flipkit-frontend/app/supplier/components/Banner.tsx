"use client";
import React from "react";
import { motion } from "framer-motion";
import "@fontsource/quantico/700.css";

const PackageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
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
            <PackageIcon className="w-10 h-10" style={{ color: "rgba(15, 23, 42)" }} />
            Vendors
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