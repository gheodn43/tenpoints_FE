import { gql } from '@apollo/client';

export const CHECK_AUTHORIZATION = gql`
query IsAuthorizated {
  isAuthorizated
}
`;
