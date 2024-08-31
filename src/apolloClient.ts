import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { refreshAccessToken } from './services/authService';


const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('access_token');
  
  if (token) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  }
  
  return forward(operation);
});


const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;


// import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from, Observable } from '@apollo/client';
// import { getSession } from './action';

// const httpLink = new HttpLink({
//   uri: 'http://localhost:4000/graphql',
//   credentials: 'include',
// });

// // Tạo ApolloLink để thêm access token vào header của mỗi request
// const authLink = new ApolloLink((operation, forward) => {
//   return new Observable(observer => {
//     getSession().then(session => {
//       const isLoggedIn = session?.isLoggedIn || false;
      
//       if (isLoggedIn) {
//         operation.setContext({
//           headers: {
//             authorization: `Bearer ${session.accessToken}`,
//           },
//         });
//       }

//       forward(operation).subscribe({
//         next: result => observer.next(result),
//         error: err => observer.error(err),
//         complete: () => observer.complete(),
//       });
//     }).catch(err => {
//       observer.error(err);
//     });
//   });
// });

// const client = new ApolloClient({
//   link: from([authLink, httpLink]),
//   cache: new InMemoryCache(),
// });

// export default client;
