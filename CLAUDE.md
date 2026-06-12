# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About this Repository

Frontend React SPA for **Rocha Peças Diesel** — a diesel parts management interface that integrates with a TOTVS Protheus backend via a local REST proxy at `http://localhost:3001`.

## Development Commands

```bash
npm run dev       # Start Vite dev server (hot reload)
npm run build     # Production build
npm run lint      # ESLint (zero warnings policy: --max-warnings 0)
npm run preview   # Preview production build locally
```

Environment variable required:
```
VITE_API_URL = http://localhost:3001
```

## Architecture Overview

**Stack**: React 18 + Vite 5, React Router v6, Material-UI v5, Axios, react-toastify, PapaParse (CSV)

**Routes** (defined in `src/router.jsx`):
- `/` → `Home` — placeholder
- `/order` → `Order` — order listing with infinite scroll and filters
- `/safra` → `Safra` — sales/receipts reconciliation (main module, wrapped in `SafraContext`)

**Layout**: `src/layout/DefaultLayout.jsx` wraps all routes with a shared header; children render via `<Outlet />`.

## Module Structure

### Safra (`src/pages/Safra/`)
The primary business module. Handles CSV import of sales and receipts, displays sales cards with infinite scroll, and performs conciliation (matching sales to accounts receivable in Protheus).

Key files:
- `Safra.jsx` — orchestrates CSV upload, pagination, modal state, and Protheus auth token
- `components/Conciliation/` — reconciliation modal; `utils.js` contains `groupReceiptsByBranch()` which validates amounts with ±0.5 tolerance and calls `/accounts-receivable`
- `components/Receipts/` — receipt upload and POST to backend
- `components/Filters/Filters.jsx` — NSU filter modal

State managed via **SafraContext** (`src/context/SafraContext/SafraContext.jsx`): data array, installments, pagination offset, query params, Protheus token, and `filtered` flag.

### Order (`src/pages/Order/`)
Order listing with infinite scroll. Deduplicates results by `R_E_C_N_O_`. Fetches from `/order` with offset-based pagination.

## Important Patterns

**Protheus authentication**: Requests to Protheus-proxied endpoints include `protheus_authorization: Bearer {token}` header. The token is obtained via `/auth` and stored in `SafraContext`.

**Infinite scroll**: Both modules use `react-intersection-observer` to detect when the last item is visible and trigger the next page fetch.

**CSV validation**: `src/utils/keysValidation.js` validates that CSV columns match the expected schema before processing. `src/utils/csvRead.js` wraps PapaParse.

**Currency formatting**: Always use `src/utils/formatCurrency.js` (pt-BR locale, BRL).

**Notifications**: Use `react-toastify` (`toast.success`, `toast.error`, `toast.loading`) — no `alert()` or `console.log` for user feedback.

**No global state manager**: Only React Context (SafraContext for Safra module) and local `useState`. Do not introduce Redux or Zustand unless there is a compelling cross-module need.

## API Endpoints (backend proxy at `VITE_API_URL`)

| Method | Path | Usage |
|--------|------|-------|
| GET | `/order` | Order list with `?offset=&limit=` |
| GET | `/safra` | Safra sales with `?offset=&limit=` and filter params |
| GET | `/accounts-receivable` | Used during conciliation to match receipts |
| POST | `/safra` (CSV body) | Upload sales CSV |
| POST | `/receipts` | Upload receipts CSV |
| POST | `/auth` | Get Protheus token |
