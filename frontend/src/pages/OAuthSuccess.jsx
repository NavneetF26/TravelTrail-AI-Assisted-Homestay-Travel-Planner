import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Toast } from "../components/ui";
import { useAuth } from "../context/AuthContext";

const API = `${import.meta.env.VITE_API_URL}/api`;

function OAuthSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "error",
  });

  useEffect(() => {
    (async () => {
      const token = new URLSearchParams(window.location.search).get("token");
      const fail = (message) => {
        setToast({ show: true, message, variant: "error" });
        setTimeout(() => navigate("/login"), 1500);
      };
      if (!token) return fail("Google login failed.");
      try {
        const res = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Unable to fetch user.");
        login(data, token);
        window.location.replace("/dashboard");
      } catch (err) {
        fail(err.message);
      }
    })();
  }, [login, navigate]);

  return (
    <>
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader text="Signing you in with Google..." />
      </div>
      {toast.show && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast((p) => ({ ...p, show: false }))}
        />
      )}
    </>
  );
}

export default OAuthSuccess;
