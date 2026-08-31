# Deploy checklist

## 1. Push to GitHub

From the repo root (`zenons-little-world` on your Desktop):

```bash
git add -A
git commit -m "Copy, chomp fix, and GitHub Pages"
git push origin main
```

## 2. Enable GitHub Pages

1. GitHub → **mauvelita/zenons-little-world** → **Settings** → **Pages**
2. **Source:** GitHub Actions
3. After the workflow runs (~1 min):  
   **https://mauvelita.github.io/zenons-little-world/**

If you instead use **Deploy from branch** → `main` / `/(root)`, the same URL redirects into the inner folder.

## 3. Optional local run

```bash
cd zenons-little-world
python3 -m http.server 8080
```

Open **http://localhost:8080**

> Must use a local server (not `file://`) so ES modules load.
