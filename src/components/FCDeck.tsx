'use client'

import { GET_DECKS } from "@/graphql/getDecks.query";
import { useQuery } from "@apollo/client";
import DeckTree from "./FCDeckTree";
import client from "@/apolloClient";
import { refreshAccessToken } from "@/services/authService";
import { DeckSynchronizationIn } from "@/services/deckSyncIn";

const FCDeck = () =>{
  const { loading, error, data, refetch } = useQuery(GET_DECKS, {
    client,
    onError: async (error) => {
      if (error?.message.includes("Unauthorized")) {
        const refreshed = await refreshAccessToken();
        if(refreshed) {
          refetch();
          DeckSynchronizationIn();
        }
      }
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <DeckTree decks={data.getDecksByUserId.decks} />;
}
export default FCDeck;
