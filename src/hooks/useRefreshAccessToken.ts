import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { REFRESH_ACCESS_TOKEN } from '@/graphql/refreshAccessToken.mutation';
import { useLogout } from '@/hooks/useLogout';
import client from "../apolloClient";

export const useRefreshAccessToken = () => {
  const logout = useLogout();
  const [refreshAccessTokenMutation] = useMutation(REFRESH_ACCESS_TOKEN, {
    client,
  });

  const refreshAccessToken = async (): Promise<{ success: boolean, message?: string }> => {
    try {
      const { data } = await refreshAccessTokenMutation();

      if (data?.refreshAccessToken?.accessToken) {
        localStorage.setItem('access_token', data.refreshAccessToken.accessToken);
        return { success: true };
      } else {
        handleTokenFailure();
        return { success: false, message: "Unknown error occurred" };
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to refresh access token";
      handleTokenFailure();
      return { success: false, message: errorMessage };
    }
  };
  const handleTokenFailure = () => {
    logout(); 
  };

  return refreshAccessToken;
};
