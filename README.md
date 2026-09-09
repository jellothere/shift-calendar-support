# Shift Calendar support

Public support, privacy and purchase information for Shift Calendar - Pay Diary.

The app source is maintained separately in a private repository. Please keep support reports free of personal work records, pay details and backup files.

## Cloudflare deployment

The site uses Cloudflare Workers Static Assets. `wrangler.jsonc` and the pinned Wrangler dependency keep deployment reproducible. No server, database, analytics script or runtime secret is required.

```sh
npm ci
npm run build
npm run dev
```

The build copies an explicit list of public files into `dist/` and checks local links and fragments. The repository root, configuration, and dependencies are never uploaded as website assets. Add new public assets to `scripts/build.mjs` when needed.

For Cloudflare's Git integration, connect this repository, select `main`, use `npm run build` as the build command and `npx wrangler deploy` as the deploy command. The Worker name is `shift-calendar`; the intended custom domain is `shiftcalendar.jelluna.com`. Keep the existing GitHub Pages URL working while migrating app links.

For another app, copy the structure, change the Worker name and site content, and connect that app's repository. Keep privacy text specific to the app. Domain ownership, DNS records and email delivery are configured separately in the owner-controlled Cloudflare and iCloud accounts.
