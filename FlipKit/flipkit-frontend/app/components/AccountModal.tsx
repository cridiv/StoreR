"use client";
import React, { useEffect, useRef, useState } from "react";

type AccountModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type UserInfo = {
  name: string;
  email: string;
  joined: string;
  profileImageUrl?: string;
};

// Icon Components
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);


const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  const generateAvatarUrl = (name: string) => {
    const seed = encodeURIComponent(name.toLowerCase().replace(/\s+/g, ""));
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=6366f1,818cf8,a5b4fc&radius=50`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isOpen) return;

      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setError("You are not logged in");
          setIsLoading(false);
          return;
        }

        const response = await fetch("https://storer-xd46.onrender.com/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();

        const name =
          [data.firstName, data.lastName].filter(Boolean).join(" ").trim() ||
          "Unknown User";

        const joinedDate = new Date(
          data.createdAt ?? Date.now()
        ).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        setUserInfo({
          name,
          email: data.email ?? "",
          joined: joinedDate,
          profileImageUrl: data.picture ?? undefined,
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load user data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div
        ref={modalRef}
        style={{
          backgroundColor: "black",
          backdropFilter: "blur(16px)",
          borderRadius: "12px",
          border: "1px solid rgba(75, 85, 99, 0.3)",
          width: "100%",
          maxWidth: "448px",
          padding: "24px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#fff" }}>
            Account
          </h2>
          <button
            onClick={onClose}
            style={{
              color: "#9CA3AF",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
          >
            <XIcon />
          </button>
        </div>

        {isLoading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 0",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                border: "3px solid rgba(99, 102, 241, 0.2)",
                borderTopColor: "#6366f1",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: "16px",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ color: "#9CA3AF", fontSize: "14px" }}>
              Loading user data...
            </p>
          </div>
        ) : error ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 0",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "16px",
              }}
            >
              <XIcon />
            </div>
            <p
              style={{
                color: "#ef4444",
                fontSize: "14px",
                textAlign: "center",
                marginBottom: "16px",
              }}
            >
              Failed to load user data
            </p>
            <p
              style={{
                color: "#6B7280",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          </div>
        ) : userInfo ? (
          <>
            {/* User Profile Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div style={{ position: "relative" }}>
                {!avatarError && userInfo.profileImageUrl ? (
                  <img
                    src={userInfo.profileImageUrl}
                    alt={userInfo.name}
                    style={{
                      width: "96px",
                      height: "96px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid rgba(99, 102, 241, 0.5)",
                    }}
                    onError={() => setAvatarError(true)}
                  />
                ) : !avatarError ? (
                  <img
                    src={generateAvatarUrl(userInfo.name)}
                    alt={userInfo.name}
                    style={{
                      width: "96px",
                      height: "96px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid rgba(99, 102, 241, 0.5)",
                    }}
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div
                    style={{
                      width: "96px",
                      height: "96px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "32px",
                      fontWeight: "600",
                      border: "2px solid rgba(99, 102, 241, 0.5)",
                    }}
                  >
                    {getInitials(userInfo.name)}
                  </div>
                )}
              </div>

              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#fff",
                  }}
                >
                  {userInfo.name}
                </h3>
              </div>
            </div>

            {/* User Info Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              {/* Email */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  background: "linear-gradient(90deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 27, 75, 0.5) 50%, rgba(45, 27, 105, 0.5) 100%)",
                  border: "1px solid rgba(75, 85, 99, 0.3)",
                }}
              >
                <div style={{ color: "#818cf8", display: "flex" }}>
                  <MailIcon />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "12px", color: "#9CA3AF" }}>Email</p>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#fff",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {userInfo.email}
                  </p>
                </div>
              </div>

              {/* Joined Date */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  background: "linear-gradient(90deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 27, 75, 0.5) 50%, rgba(45, 27, 105, 0.5) 100%)",
                  border: "1px solid rgba(75, 85, 99, 0.3)",
                }}
              >
                <div style={{ color: "#818cf8", display: "flex" }}>
                  <CalendarIcon />
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "#9CA3AF" }}>Joined</p>
                  <p style={{ fontSize: "14px", color: "#fff" }}>
                    {userInfo.joined}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default AccountModal;