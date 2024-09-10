import { gql } from '@apollo/client';

export const CREATE_DECK = gql`
  mutation CreateDeck($createDeckInput: CreateDeckInput!) {
    createDeck(createDeckInput: $createDeckInput)
  }
`;
