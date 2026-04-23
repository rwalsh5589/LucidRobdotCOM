# Project: LucidRob.com

## Available CLI Tools
Always use these CLIs to complete tasks. Never ask the user to do something manually that can be done through a CLI tool.

- **GitHub CLI** (`/opt/homebrew/bin/gh`) — repo management, PRs, issues, auth
- **Vercel CLI** (`/opt/homebrew/bin/vercel`) — deployments, env vars, project config
- **Supabase CLI** (`/opt/homebrew/bin/supabase`) — database, migrations, local dev, auth

## Deployment
- GitHub repo: https://github.com/rwalsh5589/LucidRobdotCOM
- Production URL: https://lucidrobdotcom.vercel.app
- Every push to `main` auto-deploys via Vercel GitHub integration

## Rules
- Always prefer CLI tools over asking the user to use a web UI
- Never commit `.env` files — secrets go in `.env` and Vercel environment variables
- Production branch: `main`
