import React from 'react';
// change
const Login = () => {
  
  const loginUrl = `https://accounts.spotify.com/authorize?client_id=7322e3c6dc2e49749868c347b09f83cf&redirect_uri=http://127.0.0.1:5173/dashboard&response_type=code&scope=user-read-private%20playlist-read-private%20user-library-read`;

  return (
    <div className="flex justify-center items-center h-screen">
      <a href={loginUrl}>
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Login with Spotify
        </button>
      </a>
    </div>
  );
};

export default Login;
