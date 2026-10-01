# Frontend

React single-page ordering experience built with Vite. The menu can operate with the local sample catalog while the API is offline; checkout and order history use the FastAPI service when it is available.

## Local setup

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` to the API prefix. Production bundles are created with `npm run build`.
