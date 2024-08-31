import { gql } from '@apollo/client';

export const SIGN_IN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
      user_id
      username
    }
  }
`;
