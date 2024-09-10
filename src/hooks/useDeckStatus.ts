import { useState, useEffect } from 'react';
import { dbDeck, DeckStatus, Deck } from '@/db/deck.db';
import client from '@/apolloClient';
import { CREATE_DECK } from '@/graphql/createDeck.mutation';
import { UPDATE_DECK } from '@/graphql/updateDeck.mutiation';
import { DELETE_DECK } from '@/graphql/deleteDeck.mutation';

const useDeckStatus = () => {
  const [decks, setDecks] = useState<Deck[]>([]);

  // Fetch decks from IndexedDB on mount
  useEffect(() => {
    const fetchDecks = async () => {
      const allDecks = await dbDeck.deck.toArray();
      setDecks(allDecks);
    };

    fetchDecks();
  }, []);

  // Update deck name and handle status change
  const updateDeckName = async (UpdatedDeck: Deck) => {
    const deck = await dbDeck.deck.get(UpdatedDeck.deck_id);
    if (deck) {
      if (deck.status === DeckStatus.SYNCHRONIZED) {
        deck.status = DeckStatus.MODIFIED;
      } else if (deck.status === DeckStatus.DEFAULT) {
        deck.status = DeckStatus.UPDATED;
      }
      deck.deck_name = UpdatedDeck.deck_name;
      deck.deck_path = UpdatedDeck.deck_path;
      deck.parent_deck_path = UpdatedDeck.parent_deck_path;
      await dbDeck.deck.put(deck);
      setDecks((prev) => prev.map((d) => (d.deck_id === UpdatedDeck.deck_id ? deck : d)));
    }
  };


  // Delete deck and handle status change
  const deleteDeck = async (deck_id: string) => {
    const deck = await dbDeck.deck.get(deck_id);
    if (deck) {
      // Handle status change when deleting
      if (deck.status === DeckStatus.MODIFIED || deck.status === DeckStatus.SYNCHRONIZED) {
        deck.status = DeckStatus.DELETED;
        await dbDeck.deck.put(deck);
      } else if (deck.status === DeckStatus.UPDATED || deck.status === DeckStatus.DEFAULT) {
        await dbDeck.deck.delete(deck_id);
      }
      setDecks((prev) => prev.filter((d) => d.deck_id !== deck_id));
    }
  };

  // Sync decks with the main DB
  const syncDecks = async () => {
    const updatedDecks = decks.filter((deck) => deck.status === DeckStatus.UPDATED);
    const modifiedDecks = decks.filter((deck) => deck.status === DeckStatus.MODIFIED);
    const deletedDecks = decks.filter((deck) => deck.status === DeckStatus.DELETED);

    try {
      // Sync UPDATED decks
      for (const deck of updatedDecks) {
        await client.mutate({
          mutation: CREATE_DECK,
          variables: {
            createDeckInput: {
              deck_name: deck.deck_name,
              deck_path: deck.deck_path,
              parent_deck_path: deck.parent_deck_path,
              new_count: deck.new_count,
              learning_count: deck.learning_count,
              review_count: deck.review_count,
              total_cards: deck.total_cards,
            },
          },
        });
        // Mark deck as SYNCHRONIZED
        deck.status = DeckStatus.SYNCHRONIZED;
        await dbDeck.deck.put(deck);
      }

      // Sync MODIFIED decks
      for (const deck of modifiedDecks) {
        await client.mutate({
          mutation: UPDATE_DECK,
          variables: {
            updateDeckInput: {
              id: deck.deck_id,
              deck_name: deck.deck_name,
            },
          },
        });
        // Mark deck as SYNCHRONIZED
        deck.status = DeckStatus.SYNCHRONIZED;
        await dbDeck.deck.put(deck);
      }

      // Sync DELETED decks
      for (const deck of deletedDecks) {
        await client.mutate({
          mutation: DELETE_DECK,
          variables: {
            id: deck.deck_id,
          },
        });
        // Remove deck from IndexedDB
        await dbDeck.deck.delete(deck.deck_id);
      }

      // Refresh decks after sync
      const allDecks = await dbDeck.deck.toArray();
      setDecks(allDecks);
    } catch (error) {
      console.error('Error syncing decks:', error);
    }
  };

  return {
    decks,
    updateDeckName,
    deleteDeck,
    syncDecks,
  };
};

export default useDeckStatus;
