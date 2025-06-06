import React, { useEffect, useState } from 'react';
import useAuth from './useAuth';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

const Dashboard = ({ code }) => {
  const accessToken = useAuth(code);
  const [userId, setUserId] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user's Spotify profile to get user ID
  useEffect(() => {
    if (!accessToken) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setUserId(res.data.id);
      } catch (err) {
        console.error("Error fetching user info:", err);
        setError("Failed to fetch user info.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [accessToken]);

  // Fetch playlists using the user ID
  useEffect(() => {
    if (!accessToken || !userId) return;

    const fetchPlaylists = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://api.spotify.com/v1/users/me/playlists`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setPlaylists(res.data.items);
        setError(null);
      } catch (err) {
        console.error("Error fetching playlists:", err);
        setError("Failed to fetch playlists.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [accessToken, userId]);

  if (loading) return <LoadingSpinner message="Loading..." />;
  if (error) return <LoadingSpinner error={error} />;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">User Playlists</h1>
      {!playlists.length ? (
        <p className="text-center text-gray-400">No playlists found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-300"
            >
              {playlist.images?.[0]?.url && (
                <img
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold truncate">{playlist.name}</h2>
                <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                  {playlist.description || "No description"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
