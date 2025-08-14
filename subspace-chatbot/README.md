
# Subspace Chatbot (Netlify-ready)

This repo contains a complete implementation of the assessment:
- Email auth (Nhost SDK; UI is Bolt-compatible)
- GraphQL-only frontend (queries, mutations, subscriptions)
- Hasura Action (`sendMessage`) that calls n8n
- n8n workflow calls OpenRouter (free model), saves reply back to DB
- Netlify-ready build

## 1) Environment
Copy `.env.example` to `.env` and fill:

```
VITE_NHOST_BACKEND_URL=...
VITE_NHOST_ANON_KEY=...
VITE_HASURA_GRAPHQL_HTTP_URL=...
VITE_HASURA_GRAPHQL_WS_URL=...
```

## 2) Database & Permissions
Run the SQL in `infra/hasura/schema.sql`.
Apply permissions in `infra/hasura/permissions.json` via Hasura Console (or mirror settings manually).

## 3) Hasura Action
Create an Action with SDL from `infra/hasura/actions.graphql`.
Set Handler URL to your n8n webhook: `https://<n8n-host>/webhook/hasura-send-message`.
Allow role `user` to call it.

## 4) n8n Workflow
Import `infra/n8n/sendMessage.workflow.json` into n8n cloud (free trial).
Add env creds in n8n:
- HASURA_GRAPHQL_URL
- HASURA_GRAPHQL_ADMIN_SECRET
- OPENROUTER_API_KEY

## 5) Netlify
- Connect repo or drag-and-drop build.
- Build: `npm run build` (dist folder).
- Set env vars in Netlify dashboard (use VITE_* keys).

## 6) Run locally
```
npm install
npm run dev
```

## 7) Notes about BOLT
- Requirement: Bolt is mandatory for auth. You can recreate `src/components/Auth.jsx` in Bolt.new or embed this UI in a Bolt project. Functionality is powered by Nhost SDK per spec.
- If they expect a Bolt project link, clone this repo into Bolt.new and wire the same env vars.

## 8) Submission
```
Name: Joey Dash
Contact: 8281810740
Deployed: https://<your-netlify>.netlify.app/
```

© Generated 2025-08-14
