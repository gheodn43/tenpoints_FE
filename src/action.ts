"use server";

import { sessionOptions, SessionData, defaultSession } from "@/lib";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect} from "next/navigation";
import { SIGN_IN_MUTATION } from '@/graphql/signin.mutation';
import client from '@/apolloClient';
import { ApolloError } from '@apollo/client';

export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }
  return session;
};

interface SignInParams {
  email: string;
  password: string;
}

export const signIn = async (formData: FormData) => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const { data } = await client.mutate({
      mutation: SIGN_IN_MUTATION,
      variables: {
        email,
        password,
      },
    });

    if (data && data.login) {
      const session = await getSession();
      session.userId = data.login.user_id;
      session.username = data.login.username;
      session.accessToken = data.login.access_token;
      session.isLoggedIn = true;
      console.log(session.username);
      await session.save();
    } else {
      throw new ApolloError({ errorMessage: 'Login failed' });
    }
  } catch (error) {
    throw error;
  }
}

export const logout = async () => {
  const session = await getSession();
  session.destroy();
  redirect("/");
};
