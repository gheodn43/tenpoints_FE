import { gql } from "@apollo/client";

export const GET_DECKS = gql`
query GetDecks{
    getDecksByUserId{
        decks {
          user_id
          deck_path
          deck_id
          parent_deck_path
          deck_name
          new_count
          learning_count
          review_count
          total_cards
        }
    }
}
`;