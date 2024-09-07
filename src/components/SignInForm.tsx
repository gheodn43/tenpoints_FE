'use client';

import { useMutation } from '@apollo/client';
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import client from '../apolloClient';
import { SIGN_IN_MUTATION } from '../graphql/signin.mutation';
import { useRouter, useSearchParams } from 'next/navigation';

const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const SIGNIN_ERROR = 'You did not sign in correctly or your account is temporarily disabled.';
  const SIGNIN_ERROR_NETWORK = 'Network error: Please check your internet connection.';
  const SIGNIN_ERROR_UNKNOWN = 'An unknown error occurred.';

  const [login] = useMutation(SIGN_IN_MUTATION, {
    client,
  });

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSignIn = async (
    values: { email: string; password: string },
    { setSubmitting, setFieldError }: FormikHelpers<{ email: string; password: string }>
  ) => {
    try {
      const response = await login({
        variables: {
          email: values.email,
          password: values.password,
        },
      });
      if (response.data) {
        const { access_token, username } = response.data.login;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('username', username);
        const redirectUrl = searchParams.get('redirect') || '/';
        router.push(redirectUrl);
      }
    } catch (error: any) {
      if (error.graphQLErrors.length > 0) {
        const graphQLErrorMessage = error.graphQLErrors[0].message;
      if (graphQLErrorMessage.includes("User not found")) {
        setFieldError('email', 'Email is not corrected.');
      } else if(graphQLErrorMessage.includes("Incorrect password")) {
        setFieldError('password', 'Password is not corrected.');
      } else {
        setFieldError('general', SIGNIN_ERROR);
      }
      } else if (error.networkError) {
        setFieldError('general', SIGNIN_ERROR_NETWORK);
      } else {
        setFieldError('general', SIGNIN_ERROR_UNKNOWN);
      }
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <main className="flex flex-col items-center">
      <p className="font-inter responsive-font-large mt-16">Sign in to your account</p>
      <div className="w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 px-8 mt-16">
        <div className="w-full md:col-start-2 md:col-span-2 lg:col-start-2 lg:col-span-1 md:px-0">
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSignIn}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="px-2 md:py-4 py-3 responsive-font-small bg-secondary rounded-xl border border-primary placeholder-neutral focus:outline-none focus:border-purple-500 w-full"
                  />
                  <ErrorMessage name="email" component="div" className="text-red text-sm" />
                </div>
                <div className="mb-4">
                  <Field
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="px-2 md:py-4 py-3 responsive-font-small bg-secondary rounded-xl border border-primary placeholder-neutral focus:outline-none focus:border-purple-500 w-full"
                  />
                  <ErrorMessage name="password" component="div" className="text-red text-sm" />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-white responsive-font-medium rounded-2xl px-14 py-2"
                  >
                    Sign in
                  </button>
                </div>
                <ErrorMessage name="general" component="div" className="bg-red-100 bg-opacity-20 border-red-700 text-red-600 p-4 text-sm mt-4" />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </main>
  );
};

export default SignInForm;
