'use client'

import { useQuery } from "@apollo/client";
import DeckTree from "./FCDeckTree";
import client from "@/apolloClient";
import { CHECK_AUTHORIZATION } from "@/graphql/checkAuthorizated.query";
import { useRefreshAccessToken } from "@/hooks/useRefreshAccessToken";
import { useEffect, useState } from "react";
import Link from "next/link";
import { dbDeck, Deck } from "@/db/deck.db";
import { DeckSynchronizationIn } from "@/services/deckSyncIn";

const FCDeck = () => {
  const refreshAccessToken = useRefreshAccessToken();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(true);

  const { loading, error, data, refetch } = useQuery(CHECK_AUTHORIZATION, {
    client,
    onError: async (error) => {
      if (error?.message.includes("Unauthorized")) {
        const { success, message } = await refreshAccessToken();
        if (success) refetch();
        else {
          setErrorMessage(message || 'An unknown error occurred. Please try again.');
        }
      }
    },
  });

  useEffect(() => {
    const fetchDeckData = async () => {
      if (data && data.isAuthorizated) {
        const existingDecks = await dbDeck.deck.toArray();
        if (existingDecks.length === 0) {
          setIsSyncing(true);
          const syncSuccess = await DeckSynchronizationIn();
          if (syncSuccess) {
            const syncedDecks = await dbDeck.deck.toArray();
            setDecks(syncedDecks);
          } else {
            setErrorMessage('Failed to sync decks. Please try again later.');
          }
          setIsSyncing(false); 
        } else {
          setDecks(existingDecks);
          setIsSyncing(false); 
        }
      }
    };
    fetchDeckData();
  }, [data]);

  if (loading || isSyncing) return <p>Loading...</p>;
  if (error) return (
    <div className="responsive-font-small">
      <span>{errorMessage}</span>
      <Link href="/signin" className="underline hover:text-primary"> Continue </Link>
    </div>
  );
  // enum DeckStatus {
  //   SYNCHRONIZED = 'synchronized',
  //   UPDATED = 'updated',
  //   MODIFIED = 'modified',
  //   DELETED = 'deleted',
  //   DEFAULT = 'default'
  // }
  // const deckss: Deck[] = [
  //   {
  //     deck_id: '1',
  //     deck_path: 'deck1',
  //     parent_deck_path: null,
  //     deck_name: 'Deck 1',
  //     new_count: 5,
  //     learning_count: 10,
  //     review_count: 15,
  //     total_cards: 30,
  //     status: DeckStatus.DEFAULT,
  //   },
  //   {
  //     deck_id: '2',
  //     deck_path: 'deck1::deck2',
  //     parent_deck_path: 'deck1',
  //     deck_name: 'Deck 2',
  //     new_count: 2,
  //     learning_count: 7,
  //     review_count: 8,
  //     total_cards: 17,
  //     status: DeckStatus.DEFAULT,
  //   },
  //   {
  //     deck_id: '3',
  //     deck_path: 'deck1::deck3',
  //     parent_deck_path: 'deck1',
  //     deck_name: 'Deck 3',
  //     new_count: 3,
  //     learning_count: 6,
  //     review_count: 12,
  //     total_cards: 21,
  //     status: DeckStatus.DEFAULT,
  //   },
  //   {
  //     deck_id: '4',
  //     deck_path: 'deck1::deck3::deck4',
  //     parent_deck_path: 'deck1::deck3',
  //     deck_name: 'Deck 4',
  //     new_count: 1,
  //     learning_count: 2,
  //     review_count: 4,
  //     total_cards: 7,
  //     status: DeckStatus.DEFAULT,
  //   },
  //   {
  //     deck_id: '5',
  //     deck_path: 'deck1::deck5',
  //     parent_deck_path: 'deck1',
  //     deck_name: 'Deck 5',
  //     new_count: 4,
  //     learning_count: 5,
  //     review_count: 9,
  //     total_cards: 18,
  //     status: DeckStatus.DEFAULT,
  //   },
  //   {
  //     deck_id: '6',
  //     deck_path: 'deck2',
  //     parent_deck_path: null,
  //     deck_name: 'Deck 6',
  //     new_count: 6,
  //     learning_count: 9,
  //     review_count: 11,
  //     total_cards: 26,
  //     status: DeckStatus.DEFAULT,
  //   },
  //   {
  //     deck_id: '7',
  //     deck_path: 'deck2::deck7',
  //     parent_deck_path: 'deck2',
  //     deck_name: 'Deck 7',
  //     new_count: 2,
  //     learning_count: 3,
  //     review_count: 5,
  //     total_cards: 10,
  //     status: DeckStatus.DEFAULT,
  //   },
  //   {
  //     deck_id: '8',
  //     deck_path: 'deck2::deck8',
  //     parent_deck_path: 'deck2',
  //     deck_name: 'Deck 8',
  //     new_count: 7,
  //     learning_count: 8,
  //     review_count: 6,
  //     total_cards: 21,
  //     status: DeckStatus.DEFAULT,
  //   },
  //   {
  //     deck_id: '9',
  //     deck_path: 'deck3',
  //     parent_deck_path: null,
  //     deck_name: 'Deck 9',
  //     new_count: 3,
  //     learning_count: 7,
  //     review_count: 10,
  //     total_cards: 20,
  //     status: DeckStatus.DEFAULT,
  //   },
  //   {
  //     deck_id: '10',
  //     deck_path: 'deck3::deck10',
  //     parent_deck_path: 'deck3',
  //     deck_name: 'Deck 10',
  //     new_count: 8,
  //     learning_count: 9,
  //     review_count: 11,
  //     total_cards: 28,
  //     status: DeckStatus.DEFAULT,
  //   },
  // ];
  
  return <DeckTree decks={decks} />;
}


export default FCDeck;
