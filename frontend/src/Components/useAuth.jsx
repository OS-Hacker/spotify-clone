import axios from 'axios';
import { useEffect, useState } from 'react';

const useAuth = (code) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);
  const [expiresIn, setExpiresIn] = useState(localStorage.getItem("expiresIn") || null);
  // Get new token using code
  useEffect(() => {
    if (!code || accessToken) return;
    axios
      .post("http://localhost:3000/login", { code })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);

        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("expiresIn", res.data.expiresIn);
      })
      .catch(() => {
        window.location = "/";
      });
  }, [code]);

  // Refresh access token
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const interval = setInterval(() => {
      axios
        .post("https://spotify-clone-jet-psi.vercel.app/refresh", { refreshToken })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);

          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("expiresIn", res.data.expiresIn);
        })
        .catch(() => {
          window.location = "/";
        });
    }, (expiresIn - 60) * 1000); // refresh 1 min before expiration

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
};

export default useAuth;

// change