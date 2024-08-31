'use client';

import client from "../apolloClient";
import { GET_PROFILE } from "@/graphql/getFrofile.query";
import { refreshAccessToken } from "@/services/authService";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";


const Profile = () => {
  const [username, setUsername] = useState<string | null>(null);
  const { data, loading, error, refetch } = useQuery(GET_PROFILE, {
    client,
    onError: async (error) => {
      if (error?.message.includes("Unauthorized")) {
        const refreshed = await refreshAccessToken();
        if(refreshed) refetch();
      }
    },
  });

  useEffect(() => {
    if (data && data.getMe) {
      setUsername(data.getMe.name);
    }
  }, [data]);


  return (
    <div>
      <h2>Welcome, {username}</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default Profile;
