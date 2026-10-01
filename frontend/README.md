# Frontend

React ordering experience built with Vite. Customers can browse and search the menu, view dish details, build a saved cart, place an order, view confirmation, and look up order history. The menu and home page fall back to a sample catalog while the API is offline. Staff sign in at `/admin` to manage menu availability, categories, orders, and customers.

## Local setup

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` to the API prefix. Production bundles are created with `npm run build`.
