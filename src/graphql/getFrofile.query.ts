import { gql } from '@apollo/client';

export const GET_PROFILE = gql`
query GetMe {
    getMe {
      email
      name
      user_id
    }
}
`;
