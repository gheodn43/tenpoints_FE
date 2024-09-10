import { gql } from '@apollo/client';

export const DELETE_DECK = gql`
  mutation DeleteDeck($deck_id: String!) {
    deleteDeck(deck_id: $deck_id)
  }
`;
