import { gql } from '@apollo/client';

export const REFRESH_ACCESS_TOKEN = gql`
  mutation RefreshAccessToken {
    refreshAccessToken {
      accessToken
    }
  }
`;