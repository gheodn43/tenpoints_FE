import client from '@/apolloClient';
import { REFRESH_ACCESS_TOKEN } from '../graphql/refreshAccessToken.mutation';

export const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const { data } = await client.mutate({
      mutation: REFRESH_ACCESS_TOKEN,
    });

    if (data?.refreshAccessToken?.accessToken) {
      localStorage.setItem('access_token', data.refreshAccessToken.accessToken);
      return true;
    } else {
      console.error("Failed to refresh access token");
      handleTokenFailure();
      return false;
    }
  } catch (error) {
    handleTokenFailure();
    return false;
  }
};

const handleTokenFailure = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('username');
};
