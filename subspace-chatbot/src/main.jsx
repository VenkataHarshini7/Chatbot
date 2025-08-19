import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { NhostProvider } from '@nhost/react'
import { nhost } from './nhostClient'
import { ApolloProvider } from '@apollo/client'
import { apollo } from './hasuraClient'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NhostProvider nhost={nhost}>
      <ApolloProvider client={apollo}>
        <App />
      </ApolloProvider>
    </NhostProvider>
  </React.StrictMode>
)
