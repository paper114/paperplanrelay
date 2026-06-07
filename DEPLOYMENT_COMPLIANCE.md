# Public deployment compliance checklist

Last updated: 2026-06-07

This project is prepared for a public deployment, but the site operator still needs to fill the real deployment values before launch.

## Required before launch

- Set a long random `ADMIN_KEY` in production. Do not use the development fallback `admin123`.
- Set `PUBLIC_ORIGIN` and `CORS_ORIGINS` to the final HTTPS domain, for example `https://paperplane.example.com`.
- Set `VITE_CONTACT_EMAIL` before building the client so the privacy policy and terms show a valid contact channel.
- If the site is served from infrastructure that requires ICP filing, complete ICP filing first and set `VITE_ICP_BEIAN`.
- If public security filing applies, complete it and set `VITE_PUBLIC_SECURITY_BEIAN`.
- Keep the SQLite database path on persistent NAS storage, for example `DATABASE_URL=file:/data/paperplane.db`.
- Keep the local moderation model cache on persistent storage if possible, for example `TRANSFORMERS_CACHE=/data/models`.
- Route Cloudflare Tunnel only to the web app port. Do not expose NAS admin panels, SSH, SMB, or database ports.
- The included Docker Compose file binds the app to `127.0.0.1:3000` for local checks and `127.0.0.1:10001` for the existing Cloudflare Tunnel origin on the NAS.

## Recommended Cloudflare settings

- Use a named Cloudflare Tunnel with a fixed public hostname.
- Enable HTTPS for the public hostname.
- Keep origin access private: the Node service can listen on the NAS LAN or localhost side of the tunnel, while Cloudflare Tunnel handles public ingress.
- Enable WAF and basic bot protection if available on the active Cloudflare plan.
- Keep `cloudflared` updated and run it as a managed service on the NAS.
- If Hugging Face is slow from the NAS, keep `TRANSFORMERS_REMOTE_HOST=https://hf-mirror.com` so the local moderation model can be downloaded and cached under `/data/models`.

## Data and moderation notes

- The app stores anonymous local user IDs, submitted paper plane content, optional nicknames, likes, favorites, reports, and moderation status.
- The app does not have user accounts, payment, private messaging, or real-name verification.
- The current AI moderation path runs on the server with a local model; submitted content is not sent to a third-party AI moderation API by this codebase.
- Public users should be warned not to submit sensitive personal information. This warning is included in the privacy policy and terms pages.
- Reports can hide content automatically after repeated reports, and admins can delete or restore content.

## Security baseline implemented in code

- Production CORS is restricted by `PUBLIC_ORIGIN` / `CORS_ORIGINS`.
- Security headers are set by Express, including CSP, HSTS in production, frame blocking, content type sniffing protection, referrer policy, and permissions policy.
- JSON request bodies are limited to 16 KB.
- Production admin APIs fail closed when `ADMIN_KEY` is missing.
- Admin key storage in the browser is session-only.
- Paper plane color input is allowlisted.

## Deployment command sketch

```bash
npm ci
npm run build --workspace=client
npm run build --workspace=server
npm run db:migrate --workspace=server
NODE_ENV=production PORT=3000 ADMIN_KEY=... PUBLIC_ORIGIN=https://paperplane.example.com CORS_ORIGINS=https://paperplane.example.com DATABASE_URL=file:/data/paperplane.db npm run start --workspace=server
```
