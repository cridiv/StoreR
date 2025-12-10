import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("auth_token", token);
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, []);

  return <div>Redirecting...</div>;
}
