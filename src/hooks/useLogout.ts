import { useMutation } from "@apollo/client";
import { LOGOUT_MUTATION } from '@/graphql/logout.mutation';
import client from "../apolloClient";
import { dbDeck } from "@/db/deck.db";

export const useLogout = () => {
  const [logoutMutation] = useMutation(LOGOUT_MUTATION, {
    client,
  });
  const clearIndexedDB = async () => {
    try {
      await dbDeck.transaction('rw', dbDeck.deck, async () => {
        await dbDeck.deck.clear(); 
      });
      console.log('IndexedDB cleared successfully.');
    } catch (error) {
      console.error('Error clearing IndexedDB:', error);
    }
  };
  const logout = async () => {
    try {
      const { data } = await logoutMutation();
      if (data && data.logout) {
        await clearIndexedDB();
        localStorage.removeItem('username');
        localStorage.removeItem('access_token');
        return true;
      } else {
        console.error('Logout failed: Server returned false');
        return false;
      }
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  return logout;
};
