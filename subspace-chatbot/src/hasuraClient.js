import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/client/link/context'
import { createClient as createWSClient } from 'graphql-ws'
import { nhost } from './nhostClient'

const httpUrl = `https://${import.meta.env.VITE_NHOST_SUBDOMAIN}.graphql.${import.meta.env.VITE_NHOST_REGION}.nhost.run/v1`
const wsUrl   = `wss://${import.meta.env.VITE_NHOST_SUBDOMAIN}.graphql.${import.meta.env.VITE_NHOST_REGION}.nhost.run/v1`

// Attach JWT to HTTP requests
const authLink = setContext(async (_, { headers }) => {
  const session = nhost.auth.getSession()
  const token = session?.accessToken || null
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  }
})

const httpLink = new HttpLink({ uri: httpUrl })

// WebSocket (subscriptions) with JWT
const wsLink = new GraphQLWsLink(
  createWSClient({
    url: wsUrl,
    connectionParams: async () => {
      const session = nhost.auth.getSession()
      const token = session?.accessToken || null
      return token ? { headers: { Authorization: `Bearer ${token}` } } : {}
    },
    retryAttempts: 10
  })
)

// Split: subscriptions -> WS, else -> HTTP
const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query)
    return def.kind === 'OperationDefinition' && def.operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink)
)

export const apollo = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
})
