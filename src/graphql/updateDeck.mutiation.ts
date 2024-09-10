import { gql } from '@apollo/client';

export const UPDATE_DECK = gql`
  mutation UpdateDeck($updatedDeckInput: CreateDeckInput!) {
    updateDeck(updatedDeckInput: $updatedDeckInput)
  }
`;
