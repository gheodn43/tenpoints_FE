'use client';

import client from "../apolloClient";
import { GET_PROFILE } from "@/graphql/getFrofile.query";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useRefreshAccessToken } from '@/hooks/useRefreshAccessToken';
import Link from "next/link";

const Profile = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const refreshAccessToken = useRefreshAccessToken();
  const { data, loading, error, refetch } = useQuery(GET_PROFILE, {
    client,
    onError: async (error) => {
      if (error?.message.includes("Unauthorized")) {
        const { success, message } = await refreshAccessToken();
        if(success) refetch();
        else setErrorMessage(message || 'An unknown error occurred. Please try again.');
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
      {errorMessage && (
        <div className="responsive-font-small">
          <span>{errorMessage}</span>
          <Link href="/signin" className="underline hover:text-primary"> Continue </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;
