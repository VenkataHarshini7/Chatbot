import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient as createWSClient } from 'graphql-ws'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { nhost } from './nhostClient'

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_HASURA_GRAPHQL_HTTP_URL,
  fetch: (...args) => fetch(...args)
})

const wsClient = createWSClient({
  url: import.meta.env.VITE_HASURA_GRAPHQL_WS_URL,
  connectionParams: async () => {
    const session = nhost.auth.getSession()
    const token = session?.accessToken
    return { headers: { Authorization: token ? `Bearer ${token}` : '' } }
  }
})

const wsLink = new GraphQLWsLink(wsClient)

const authLink = (operation, forward) => {
  const session = nhost.auth.getSession()
  const token = session?.accessToken
  operation.setContext(({ headers = {} }) => ({
    headers: { ...headers, Authorization: token ? `Bearer ${token}` : '' }
  }))
  return forward(operation)
}

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query)
    return def.kind === 'OperationDefinition' && def.operation === 'subscription'
  },
  wsLink,
  { request: authLink, forward: httpLink } // simple auth wrapper for HTTP
)

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
})
