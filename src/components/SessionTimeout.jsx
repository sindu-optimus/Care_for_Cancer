import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import ConfirmModal from "./ui/ConfirmModal";

import { refreshTokenApi } from "../services/authService";

export default function SessionTimeout() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const warningTimerRef = useRef(null);
  const logoutTimerRef = useRef(null);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const startSessionTimer = () => {
    const tokenExpiry = Number(
      localStorage.getItem("tokenExpiry")
    );

    if (!tokenExpiry) return;

    const timeUntilExpiry = tokenExpiry - Date.now();

    // Show popup 10 seconds before expiry
    const warningTime = timeUntilExpiry - 10000;
    // const warningTime = 5000;

    if (warningTime <= 0) {
      setIsModalOpen(true);
      return;
    }

    warningTimerRef.current = setTimeout(() => {
      setIsModalOpen(true);

      logoutTimerRef.current = setTimeout(() => {
        logout();
      }, 10000);
    }, warningTime);
  };

  const handleContinue = async () => {
    try {
      const refreshToken =
        localStorage.getItem("refreshToken");

      const response = await refreshTokenApi(
        refreshToken
      );

      localStorage.setItem(
        "token",
        response.data.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        response.data.refreshToken
      );

      localStorage.setItem(
        "tokenExpiry",
        Date.now() +
          response.data.expiresInSeconds * 1000
      );

      clearTimeout(logoutTimerRef.current);

      setIsModalOpen(false);

      startSessionTimer();
    } catch (error) {
      logout();
    }
  };

  const handleCancel = () => {
    logout();
  };

  useEffect(() => {
    startSessionTimer();

    return () => {
      clearTimeout(warningTimerRef.current);
      clearTimeout(logoutTimerRef.current);
    };
  }, []);

  return (
    <>
      {isModalOpen && (
        <ConfirmModal
            title="Session Expiring"
            message="Your session will expire in 10 seconds. Do you want to continue?"
            confirmText="Continue"
            cancelText="Cancel"
            onConfirm={handleContinue}
            onClose={handleCancel}
        />
      )}
    </>
  );
}