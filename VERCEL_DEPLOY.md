# Deploy ke Vercel

Proyek ini terdiri dari **dua Vercel project** terpisah:

| Project | Root Directory | Env Vars |
|---------|---------------|----------|
| `notion-clone-api` | `apps/api` | Lihat bagian API di bawah |
| `notion-clone-web` | `apps/web` | Lihat bagian Web di bawah |

---

## 1. Deploy API (`apps/api`)

### Langkah-langkah

```bash
cd apps/api
vercel
# Set Root Directory: apps/api
# Framework: Other
```

### Environment Variables yang dibutuhkan

```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://notion-clone-api.vercel.app
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
LIVEBLOCKS_SECRET_KEY=sk_...
ALLOWED_ORIGINS=https://notion-clone-web.vercel.app
```

---

## 2. Deploy Web (`apps/web`)

Setelah API di-deploy dan kamu tahu URL-nya, update `apps/web/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR_API_URL/api/:path*"
    }
  ]
}
```

Lalu deploy:

```bash
cd apps/web
vercel
# Set Root Directory: apps/web
# Framework: SvelteKit
```

### Environment Variables yang dibutuhkan

```
PUBLIC_API_URL=https://notion-clone-api.vercel.app
PUBLIC_LIVEBLOCKS_KEY=pk_...
```

---

## 3. Update CORS & Auth setelah deploy

Setelah kedua URL diketahui, tambahkan ke env API:

```
BETTER_AUTH_URL=https://YOUR_API_URL
ALLOWED_ORIGINS=https://YOUR_WEB_URL
```

Dan di Better Auth config, pastikan `trustedOrigins` mencakup URL produksi (sudah otomatis via `ALLOWED_ORIGINS`).

---

## Tips

- Gunakan **Vercel Postgres** atau **Neon** untuk database production.
- `pnpm db:push` harus dijalankan sekali setelah database production di-setup.
- Secrets Vercel set via `vercel env add NAMA_VAR` atau di dashboard vercel.com.
