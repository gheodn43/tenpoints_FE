import { gql } from '@apollo/client';

export const CHECK_AUTH_QUERY = gql`
  query CheckAuth {
    isAuthenticated {
      is_authenticated
      username
    }
  }
`;
