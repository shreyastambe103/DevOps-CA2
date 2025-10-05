import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_BASE = "http://localhost:5000/api";

export default function GoogleOAuth() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // useCallback ensures the function is stable → fixes missing dependency warning
  const handleGoogleLogin = useCallback(async (response) => {
    try {
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.user, data.token);
        navigate("/dashboard");
      } else {
        alert("Google login failed: " + data.msg);
      }
    } catch (err) {    // renamed `error` → `err` and actually used it
      console.error("Google login error:", err);
      alert("Network error during Google login");
    }
  }, [login, navigate]);

  useEffect(() => {
    const initGoogle = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        {
          theme: "outline",
          size: "large",
          text: "signin_with",
          width: "300"
        }
      );
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.head.appendChild(script);
    } else {
      initGoogle();
    }
  }, [handleGoogleLogin]);

  return <div id="google-signin-button"></div>;
}
