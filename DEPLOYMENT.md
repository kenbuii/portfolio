# Deploying kenbui.net to Cloudflare Pages

## Architecture Overview

```
┌──────────────────┐      ┌─────────────────────┐      ┌──────────────┐
│  GoDaddy DNS     │ ──── │  Cloudflare Pages   │ ──── │   Supabase   │
│  (kenbui.net)    │      │  (Static React)     │      │  (Database)  │
└──────────────────┘      └─────────────────────┘      └──────────────┘
```

## Step 1: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the contents of `supabase-schema.sql`
3. Go to **Settings > API** and copy:
   - Project URL (e.g., `https://xxxx.supabase.co`)
   - `anon` public key

## Step 2: Deploy to Cloudflare Pages

### Option A: Connect GitHub (Recommended)

1. Push your code to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Click "Create a project" > "Connect to Git"
4. Select your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist/public`
   - **Root directory:** (leave blank)
6. Add environment variables:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
7. Click "Save and Deploy"

### Option B: Direct Upload

1. Run locally: `npm run build`
2. Go to Cloudflare Pages dashboard
3. Create new project > "Direct Upload"
4. Upload the `dist/public` folder

## Step 3: Configure GoDaddy DNS

1. Log into [GoDaddy](https://godaddy.com)
2. Go to **My Products** > **DNS** for kenbui.net
3. Add/edit records:

| Type  | Name | Value                           | TTL  |
|-------|------|----------------------------------|------|
| CNAME | @    | your-project.pages.dev          | 600  |
| CNAME | www  | your-project.pages.dev          | 600  |

4. Wait 10-30 minutes for DNS propagation

## Step 4: Configure Custom Domain in Cloudflare

1. In your Cloudflare Pages project, go to **Custom domains**
2. Click "Set up a custom domain"
3. Enter `kenbui.net`
4. Cloudflare will verify DNS and set up SSL automatically

## Environment Variables Reference

| Variable | Where to Set | Description |
|----------|--------------|-------------|
| `VITE_SUPABASE_URL` | Cloudflare Pages | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Cloudflare Pages | Public anon key (safe) |

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### 404 on page refresh
The `_redirects` file in `client/public/` should handle SPA routing. Make sure it's included in the build.

### Supabase connection fails
- Check that environment variables are set in Cloudflare
- Verify the anon key has proper RLS policies
- Check Supabase dashboard for connection logs

### DNS not resolving
- GoDaddy DNS can take up to 48 hours to propagate
- Use [dnschecker.org](https://dnschecker.org) to verify
- Make sure there are no conflicting A records
