# Contributing

Open an issue before a pull request, except for vulnerabilities: report those privately as described in [SECURITY.md](SECURITY.md). The repository-wide code owner is
`@DivyaSaiPagidipally`, as listed in [CODEOWNERS](.github/CODEOWNERS).

Use Node.js 18+ and npm 9+. From the repository root, install and start the backend:

```bash
cd backend
npm install
npm run dev
```

The backend runs at http://localhost:3001; check http://localhost:3001/health for `{"ok":true}`. In a separate terminal, from the repository root, install and start the frontend:

```bash
cd frontend
npm install
VITE_API_URL=http://localhost:3001 npm run dev
```

Open http://localhost:5173. Setting `VITE_API_URL` is necessary because the starter's default API URL contains `/bug`. See the [README](README.md) for more details and verification steps.
