import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Toast } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const API = "http://127.0.0.1:8000/api";

function OAuthSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "error",
  });

  useEffect(() => {
    async function completeLogin() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setToast({
          show: true,
          message: "Google login failed.",
          variant: "error",
        });

        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      try {
        const response = await fetch(`${API}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Unable to fetch user.");
        }

        login(data, token);

        navigate("/dashboard");
      } catch (err) {
        setToast({
          show: true,
          message: err.message,
          variant: "error",
        });

        setTimeout(() => navigate("/login"), 1500);
      }
    }

    completeLogin();
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
          onClose={() =>
            setToast((prev) => ({
              ...prev,
              show: false,
            }))
          }
        />
      )}
    </>
  );
}

export default OAuthSuccess;
