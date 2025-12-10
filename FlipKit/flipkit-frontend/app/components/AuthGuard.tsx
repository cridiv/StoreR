import LandingPage from "./LandingPage"
import React, { JSX } from "react"

interface Props {
  children: JSX.Element;
}

export default function AuthGuard({ children }: Props) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <LandingPage />;
  }

  return children;
}
