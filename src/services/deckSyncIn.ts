import client from '@/apolloClient';
import { GET_DECKS } from "@/graphql/getDecks.query";
import { dbDeck, DeckStatus } from "@/db/deck.db";

export const DeckSynchronizationIn = async (): Promise<boolean> => {
  try {
      const { data } = await client.query({
        query: GET_DECKS,
      });
      if (data && data.getDecksByUserId.decks) {
        const decks = data.getDecksByUserId.decks;
        await dbDeck.transaction('rw', dbDeck.deck, async () => {
          await dbDeck.deck.clear();
          for (const deck of decks) {
            await dbDeck.deck.add({
              deck_path: deck.deck_path,
              parent_deck_path: deck.parent_deck_path,
              deck_name: deck.deck_name,
              new_count: deck.new_count,
              learning_count: deck.learning_count,
              review_count: deck.review_count,
              total_cards: deck.total_cards,
              status: DeckStatus.SYNCHRONIZED,
            });
          }
        });
        return true;
      } else {
        return false;
    }
  } catch (error) {
    return false;
  }
};
