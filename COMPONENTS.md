# Dollar Watch — Component Reference

> Reusable guide for integrating Dollar Watch charts and panels into other projects.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Dependencies](#dependencies)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
  - [`/api/bch`](#apibch--bch-proxy)
  - [`/api/fed`](#apifed--fred-proxy)
- [Data Shape](#data-shape)
- [Components](#components)
  - [ExchangeRateChart](#1-exchangeratechart)
  - [KpiCards](#2-kpicards)
  - [InterestRateChart](#3-interestratechart)
  - [InflationPanel](#4-inflationpanel)
  - [ReservesChart](#5-reserveschart)
  - [RemittancesChart](#6-remittanceschart)
- [BCH Indicator IDs](#bch-indicator-ids)
- [Styling](#styling)
- [How to Reuse in Another Project](#how-to-reuse-in-another-project)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  page.js (Client Component)                         │
│  ┌───────────────────────────────────────────┐      │
│  │ useEffect → fetchBch() / fetchFed()       │      │
│  │ Calls Next.js API routes (server-side)    │      │
│  └────────────────┬──────────────────────────┘      │
│                   │ props                            │
│  ┌────────────────▼──────────────────────────┐      │
│  │  6 Components (all 'use client')          │      │
│  │  ExchangeRateChart · KpiCards             │      │
│  │  InterestRateChart · InflationPanel       │      │
│  │  ReservesChart     · RemittancesChart     │      │
│  └───────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────┘
        ▲                           ▲
        │ /api/bch                  │ /api/fed
┌───────┴───────────┐    ┌──────────┴──────────┐
│ BCH API (Azure)   │    │ FRED (CSV endpoint) │
│ clave= auth       │    │ Public, no auth     │
└───────────────────┘    └─────────────────────┘
```

---

## Dependencies

```bash
npm install chart.js react-chartjs-2 chartjs-adapter-date-fns date-fns
```

| Package                    | Purpose                                    |
|----------------------------|--------------------------------------------|
| `chart.js`                 | Core charting engine                       |
| `react-chartjs-2`          | React wrapper for Chart.js                 |
| `chartjs-adapter-date-fns` | Enables `type: 'time'` on x-axis scales    |
| `date-fns`                 | Required peer dependency for time adapter   |

---

## Environment Variables

Create a `.env.local` file:

```env
BCH_API_BASE_URL=https://bchapi-am.azure-api.net/api/v1
BCH_API_KEY=your-api-key-here
```

- These are **server-side only** (used in API routes, never exposed to the browser).
- The BCH API key authenticates via the `clave` query parameter, not a header.

---

## API Routes

### `/api/bch` — BCH Proxy

**File:** `src/app/api/bch/route.js`

Proxies requests to the BCH API, keeping the API key server-side.

| Query Param    | Required | Description                                           |
|----------------|----------|-------------------------------------------------------|
| `id`           | ✅       | BCH indicator ID (e.g. `97`)                          |
| `fechaInicio`  | ❌       | Start date `YYYY-MM-DD` for historical range          |
| `fechaFinal`   | ❌       | End date `YYYY-MM-DD` (defaults to today)             |
| `reciente`     | ❌       | Number of most recent records (e.g. `1` for latest)   |

**Key behaviors:**
- Uses `ordenamiento=DESC` when `reciente` is set (to get the *latest* records)
- Uses `ordenamiento=ASC` for date-range queries (so charts draw left-to-right)
- Normalizes PascalCase BCH response fields to camelCase

**Example call from client:**
```js
const data = await fetch('/api/bch?id=97&fechaInicio=2020-01-01');
const records = await data.json();
// → [{ id, indicadorId, nombre, descripcion, fecha, valor }, ...]
```

---

### `/api/fed` — FRED Proxy

**File:** `src/app/api/fed/route.js`

Fetches the US Federal Funds Effective Rate from FRED's public CSV endpoint. No authentication needed.

**Example call:**
```js
const data = await fetch('/api/fed');
const records = await data.json();
// → [{ fecha: "2021-01-01", valor: 0.09 }, ...]
```

---

## Data Shape

All components expect arrays of objects with this shape (returned by `/api/bch`):

```ts
interface DataPoint {
  fecha: string;  // ISO date string: "2025-02-21"
  valor: number;  // Numeric value
  // Optional fields (available but not used by all components):
  id: number;
  indicadorId: number;
  nombre: string;
  descripcion: string;
}
```

The `/api/fed` route returns the same `{ fecha, valor }` shape for compatibility.

---

## Components

### 1. ExchangeRateChart

**File:** `src/components/ExchangeRateChart.js`

Main exchange rate time-series chart with a slim buy/sell spread mini-chart below. Includes milestone reference lines at L 24, L 25, L 26.

#### Props

| Prop       | Type          | Description                                        |
|------------|---------------|----------------------------------------------------|
| `data`     | `DataPoint[]` | Reference exchange rate history (indicator 97)     |
| `buyData`  | `DataPoint[]` | Buy rate history (indicator 619) — for spread      |
| `sellData` | `DataPoint[]` | Sell rate history (indicator 620) — for spread     |
| `loading`  | `boolean`     | Shows spinner when `true`                          |

#### Usage

```jsx
import ExchangeRateChart from '@/components/ExchangeRateChart';

<ExchangeRateChart
  data={exchangeRateData}    // 5 years of daily reference rate
  buyData={buyRateHistory}   // 5 years of daily buy rate
  sellData={sellRateHistory} // 5 years of daily sell rate
  loading={false}
/>
```

#### Features
- Time range selector: 1M, 3M, 6M, 1A, TODO (defaults to TODO)
- Gradient-filled line chart with hover tooltips
- Custom Chart.js plugin draws dashed milestone lines at L 24, L 25, L 26
- Slim spread chart below (amber line, 50px height) computed on the fly from buy/sell data
- Fully responsive

---

### 2. KpiCards

**File:** `src/components/KpiCards.js`

Right-side panel showing the current rate, buy/sell/spread, devaluation velocity, USD↔HNL converter, and percentage change metrics.

#### Props

| Prop       | Type          | Description                                          |
|------------|---------------|------------------------------------------------------|
| `data`     | `DataPoint[]` | Full exchange rate history (for calculating changes)  |
| `buyRate`  | `number|null` | Latest buy rate value                                 |
| `sellRate` | `number|null` | Latest sell rate value                                |
| `loading`  | `boolean`     | Shows spinner when `true`                             |

#### Usage

```jsx
import KpiCards from '@/components/KpiCards';

<KpiCards
  data={exchangeRateData}
  buyRate={26.4987}
  sellRate={26.6312}
  loading={false}
/>
```

#### Features
- Hero display: current reference rate with date
- Buy / Sell / Spread cards
- **Devaluation Velocity:** Annualized L/year depreciation with percentage
- **Quick Converter:** USD↔HNL toggle with live calculation (uses sell rate for USD→HNL, buy rate for HNL→USD)
- Change metrics: 1 day, 7 days, 1 month, 1 year, year-to-date
- All values formatted with `toLocaleString` for thousand separators

---

### 3. InterestRateChart

**File:** `src/components/InterestRateChart.js`

Dual-line chart comparing BCH's TPM (Tasa de Política Monetaria) with the US Federal Funds Rate.

#### Props

| Prop       | Type          | Description                                          |
|------------|---------------|------------------------------------------------------|
| `bchData`  | `DataPoint[]` | Monthly TPM data (indicator 700)                     |
| `fedData`  | `DataPoint[]` | Monthly Fed Funds rate from FRED                     |
| `loading`  | `boolean`     | Shows spinner when `true`                             |

#### Usage

```jsx
import InterestRateChart from '@/components/InterestRateChart';

<InterestRateChart
  bchData={tpmData}
  fedData={fedData}
  loading={false}
/>
```

#### Important Notes
- **TPM values are decimals:** The BCH API returns TPM as `0.0575` (not `5.75`). The component multiplies by 100 for display.
- **Fed data is filtered** to start from 2021-01-01 to match the BCH TPM data range.
- X-axis `min` is set to `2021-01-01`.

---

### 4. InflationPanel

**File:** `src/components/InflationPanel.js`

Compact inflation display with the year-over-year IPC variation, current IPC index, and a sparkline.

#### Props

| Prop            | Type          | Description                                        |
|-----------------|---------------|----------------------------------------------------|
| `ipcIndex`      | `DataPoint[]` | Monthly IPC index values (indicator 608)           |
| `ipcVariation`  | `DataPoint[]` | Monthly IPC year-over-year variation (indicator 609)|
| `loading`       | `boolean`     | Shows spinner when `true`                           |

#### Usage

```jsx
import InflationPanel from '@/components/InflationPanel';

<InflationPanel
  ipcIndex={ipcIndexData}
  ipcVariation={ipcVariationData}
  loading={false}
/>
```

#### Features
- Large inflation percentage display
- IPC base-100 index value
- 24-month sparkline (no axes, no tooltips — just shape)

---

### 5. ReservesChart

**File:** `src/components/ReservesChart.js`

Bar chart showing international net reserves (RIN) in millions USD.

#### Props

| Prop       | Type          | Description                                        |
|------------|---------------|----------------------------------------------------|
| `data`     | `DataPoint[]` | Monthly RIN data (indicator 524)                   |
| `loading`  | `boolean`     | Shows spinner when `true`                           |

#### Usage

```jsx
import ReservesChart from '@/components/ReservesChart';

<ReservesChart
  data={reservesData}
  loading={false}
/>
```

#### Features
- Last 24 months displayed as bars
- Latest bar highlighted with stronger color
- Current value displayed large with `$X,XXX.XM` formatting
- Month/year date label

---

### 6. RemittancesChart

**File:** `src/components/RemittancesChart.js`

Bar chart showing family remittances in millions USD with year-over-year comparison.

#### Props

| Prop       | Type          | Description                                        |
|------------|---------------|----------------------------------------------------|
| `data`     | `DataPoint[]` | Quarterly remittances data (indicator 6307)        |
| `loading`  | `boolean`     | Shows spinner when `true`                           |

#### Usage

```jsx
import RemittancesChart from '@/components/RemittancesChart';

<RemittancesChart
  data={remittancesData}
  loading={false}
/>
```

#### Features
- Labels use quarter format: T1 2025, T2 2025, etc.
- YoY comparison against same quarter last year (4 data points back)
- Latest bar highlighted
- Displays "Último Trimestre · T3 2025" style label

---

## BCH Indicator IDs

Quick reference for all indicators used:

| ID     | Code           | Name                               | Frequency  |
|--------|----------------|-------------------------------------|-----------|
| `97`   | EC-TCR-01      | Tipo de Cambio de Referencia        | Daily     |
| `619`  | EC-TCN-01-1    | TC Nominal Compra                   | Daily     |
| `620`  | EC-TCN-01-2    | TC Nominal Venta                    | Daily     |
| `700`  | EM-TPM-01-2    | Tasa Política Monetaria             | Monthly   |
| `608`  | EP-IPC-01-1    | IPC Índice                          | Monthly   |
| `609`  | EP-IPC-01-2    | IPC Variación Interanual            | Monthly   |
| `524`  | EM-RIN-01-1    | Reservas Internacionales Netas      | Monthly   |
| `6307` | ESE-BP-01-32   | Remesas Familiares                  | Quarterly |

Full indicator catalog: `bch_list_all_indicators.csv`

---

## Styling

All components use CSS classes from `src/app/globals.css`. Key classes:

| Class              | Purpose                                             |
|--------------------|-----------------------------------------------------|
| `.card`            | Glassmorphism container with border glow on hover    |
| `.card-header`     | Flex row: title left, icon right                     |
| `.card-title`      | Uppercase small label                                |
| `.card-icon.*`     | Colored icon badge (`.blue`, `.cyan`, `.emerald`, `.rose`, `.amber`, `.purple`) |
| `.chart-container` | Full-width responsive chart wrapper                  |
| `.kpi-hero`        | Large centered rate display                          |
| `.kpi-grid`        | 2-column grid for change metrics                     |
| `.kpi-item`        | Individual metric card                               |
| `.spread-row`      | 3-column row for buy/sell/spread                     |
| `.stat-highlight`  | Horizontal stat row with number + label              |
| `.time-range`      | Pill-style time range selector                       |
| `.loading-container` + `.loading-spinner` | Centered spinner animation     |

**Design tokens** (CSS variables):

```css
--bg-primary: #0a0e1a;      /* Page background */
--bg-card: rgba(17,24,39,0.7); /* Glassmorphism card */
--accent-blue: #6366f1;     /* Primary accent (indigo) */
--accent-cyan: #22d3ee;     /* Secondary accent */
--accent-emerald: #10b981;  /* Positive values */
--accent-rose: #f43f5e;     /* Negative values */
--accent-amber: #f59e0b;    /* Inflation / warnings */
```

---

## How to Reuse in Another Project

### Minimal steps to port a single component:

1. **Install dependencies:**
   ```bash
   npm install chart.js react-chartjs-2 chartjs-adapter-date-fns date-fns
   ```

2. **Copy the component file** (e.g., `ExchangeRateChart.js`) into your project.

3. **Copy the API route** (`src/app/api/bch/route.js`) and set env vars.

4. **Copy relevant CSS classes** from `globals.css` — or replace with your own styling. The components use simple class names, not a CSS module, so you can remap easily.

5. **Feed data:** Each component expects `DataPoint[]` arrays with `{ fecha, valor }`. As long as you give it that shape, the source doesn't matter — it could be BCH, a database, or a CSV.

### Example: Using only the InterestRateChart

```jsx
// 1. Fetch your data however you want
const bchRates = [
  { fecha: '2021-01-01', valor: 0.0300 },
  { fecha: '2021-06-01', valor: 0.0300 },
  // ... more monthly data
];

const fedRates = [
  { fecha: '2021-01-01', valor: 0.09 },
  // ...
];

// 2. Render the component
<InterestRateChart
  bchData={bchRates}
  fedData={fedRates}
  loading={false}
/>
```

> **Tip:** The components are self-contained — each registers its own Chart.js modules. If you use multiple components together, Chart.js handles duplicate registrations gracefully.
