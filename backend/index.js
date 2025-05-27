const express = require("express");
const cors = require("cors");
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();
const path = require("path");
require("dotenv").config(); // Add this for environment variables

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  return res.send("Server Running");
});

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI || "http://127.0.0.1:5173/dashboard",
    clientId:
      process.env.SPOTIFY_CLIENT_ID || "7322e3c6dc2e49749868c347b09f83cf",
    clientSecret:
      process.env.SPOTIFY_CLIENT_SECRET || "7cfa66411fe0420f8781f0309f5f97a1",
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.access_token, // Fixed: should be access_token
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.error("Refresh token error:", err);
      res.status(400).json({ error: "Failed to refresh token" });
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI || "http://127.0.0.1:5173/dashboard",
    clientId:
      process.env.SPOTIFY_CLIENT_ID || "7322e3c6dc2e49749868c347b09f83cf",
    clientSecret:
      process.env.SPOTIFY_CLIENT_SECRET || "7cfa66411fe0420f8781f0309f5f97a1",
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((error) => {
      console.error("Login error:", error);
      res.status(400).json({ error: "Failed to authenticate" });
    });
});

// Deployment setup - FIXED
const dirPath = path.resolve();
if (process.env.NODE_ENV === "production" || true) {
  app.use(express.static(path.join(dirPath, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(dirPath, "../frontend/dist/index.html"));
  });
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running`);
});
