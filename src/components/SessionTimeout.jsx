import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";

import ConfirmModal from "./ui/ConfirmModal";
import { refreshTokenApi } from "../services/authService";

export default function SessionTimeout() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshTimerRef = useRef(null);
  const logoutTimerRef = useRef(null);

  const logout = () => {
    clearTimeout(refreshTimerRef.current);
    clearTimeout(logoutTimerRef.current);

    localStorage.clear();
    navigate("/");
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }

    const response = await refreshTokenApi(refreshToken);

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
  };

  const scheduleTokenRefresh = () => {
    const tokenExpiry = Number(
      localStorage.getItem("tokenExpiry")
    );

    if (!tokenExpiry) return;

    const timeUntilExpiry = tokenExpiry - Date.now();

    const refreshTime = Math.max(
      timeUntilExpiry - 10000,
      0
    );

    clearTimeout(refreshTimerRef.current);

    refreshTimerRef.current = setTimeout(
      async () => {
        try {
          await refreshAccessToken();
          scheduleTokenRefresh();
        } catch {
          logout();
        }
      },
      refreshTime
    );
  };

  const handleIdle = () => {
    clearTimeout(logoutTimerRef.current);

    setIsModalOpen(true);

    logoutTimerRef.current = setTimeout(() => {
      logout();
    }, 30000);
  };

  const { reset } = useIdleTimer({
    timeout: 10 * 60 * 1000,
    onIdle: handleIdle
  });

  const handleContinue = () => {
    clearTimeout(logoutTimerRef.current);

    setIsModalOpen(false);

    reset();
  };

  const handleCancel = () => {
    logout();
  };

  useEffect(() => {
    scheduleTokenRefresh();

    return () => {
      clearTimeout(refreshTimerRef.current);
      clearTimeout(logoutTimerRef.current);
    };
  }, []);

  return (
    <>
      {isModalOpen && (
        <ConfirmModal
          title="Session Timeout"
          message="You have been inactive for 10 minutes. Do you want to continue your session?"
          confirmText="Continue"
          cancelText="Logout"
          onConfirm={handleContinue}
          onClose={handleCancel}
        />
      )}
    </>
  );
}