# Vercel Project Settings Required

## Important: Set Root Directory in Vercel Dashboard

The `.vercelignore` and `vercel.json` are configured, but you need to set one more setting in your Vercel project:

### Steps:

1. **Go to your Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project** (booknerdsociety)
3. **Click on "Settings"**
4. **Go to "General"** (should be the default)
5. **Scroll down to "Root Directory"**
6. **Click "Edit"**
7. **Set Root Directory to:** `apps/frontend`
8. **Click "Save"**

### Why?

Your project is a monorepo with this structure:
```
LeftOnRead/
├── apps/
│   ├── frontend/  ← Deploy this
│   └── backend/   ← Ignore this
```

By setting the Root Directory to `apps/frontend`, Vercel will:
- Run all commands from within `apps/frontend`
- Find `package.json` correctly
- Build and deploy only the frontend

### After Setting Root Directory

Once you've set this:
1. Go back to your project's **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. The build should succeed! ✅

---

**Alternative:** You can also set this during the initial project setup if you haven't deployed yet.

