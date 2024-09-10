import { useMutation } from "@apollo/client";
import { LOGOUT_MUTATION } from '@/graphql/logout.mutation';
import client from "../apolloClient";
import { dbDeck } from "@/db/deck.db";

export const useLogout = () => {
  const [logoutMutation] = useMutation(LOGOUT_MUTATION, {
    client,
  });
  const clearIndexedDB = async () => {
    await dbDeck.transaction('rw', dbDeck.deck, async () => {
      await dbDeck.deck.clear();
    });
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
        return false;
      }
    } catch (error) {
      return false;
    }
  };
  return logout;
};
