'use client';

import { useEffect, useState } from 'react';
import ExchangeRateChart from '@/components/ExchangeRateChart';
import KpiCards from '@/components/KpiCards';
import InterestRateChart from '@/components/InterestRateChart';
import InflationPanel from '@/components/InflationPanel';
import ReservesChart from '@/components/ReservesChart';
import RemittancesChart from '@/components/RemittancesChart';

// BCH indicator IDs
const INDICATORS = {
  exchangeRate: 97,    // EC-TCR-01 - Tipo de Cambio de Referencia (Daily)
  buyRate: 619,        // EC-TCN-01-1 - TC Nominal Compra (Daily)
  sellRate: 620,       // EC-TCN-01-2 - TC Nominal Venta (Daily)
  tpm: 700,            // EM-TPM-01-2 - Tasa Política Monetaria (Monthly) ← changed from 699
  ipcIndex: 608,       // EP-IPC-01-1 - IPC Índice (Monthly)
  ipcVariation: 609,   // EP-IPC-01-2 - IPC Variación interanual (Monthly)
  reserves: 524,       // EM-RIN-01-1 - Reservas Internacionales Netas (Monthly)
  remittances: 6307,   // ESE-BP-01-32 - Remesas Familiares (Monthly/Trimestral)
};

async function fetchBch(id, options = {}) {
  const params = new URLSearchParams({ id: id.toString() });
  if (options.fechaInicio) params.set('fechaInicio', options.fechaInicio);
  if (options.reciente) params.set('reciente', options.reciente.toString());

  const res = await fetch(`/api/bch?${params.toString()}`);
  if (!res.ok) throw new Error(`BCH fetch failed for id ${id}`);
  return res.json();
}

async function fetchFed() {
  const res = await fetch('/api/fed');
  if (!res.ok) throw new Error('Fed fetch failed');
  return res.json();
}

export default function Home() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAll() {
      try {
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        const twoYStr = twoYearsAgo.toISOString().split('T')[0];

        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
        const fiveYStr = fiveYearsAgo.toISOString().split('T')[0];

        const [
          exchangeRate,
          buyRateLatest,
          sellRateLatest,
          buyRateHistory,
          sellRateHistory,
          tpmData,
          ipcIndex,
          ipcVariation,
          reserves,
          remittances,
          fedData,
        ] = await Promise.all([
          fetchBch(INDICATORS.exchangeRate, { fechaInicio: fiveYStr }),  // Reference rate for main chart
          fetchBch(INDICATORS.buyRate, { reciente: 1 }),                // Latest buy
          fetchBch(INDICATORS.sellRate, { reciente: 1 }),               // Latest sell
          fetchBch(INDICATORS.buyRate, { fechaInicio: fiveYStr }),       // Buy history for spread
          fetchBch(INDICATORS.sellRate, { fechaInicio: fiveYStr }),      // Sell history for spread
          fetchBch(INDICATORS.tpm, { fechaInicio: fiveYStr }),           // TPM Monthly
          fetchBch(INDICATORS.ipcIndex, { fechaInicio: twoYStr }),
          fetchBch(INDICATORS.ipcVariation, { fechaInicio: twoYStr }),
          fetchBch(INDICATORS.reserves, { fechaInicio: twoYStr }),
          fetchBch(INDICATORS.remittances, { fechaInicio: fiveYStr }),
          fetchFed(),
        ]);

        setData({
          exchangeRate,
          buyRate: buyRateLatest?.[0]?.valor || null,
          sellRate: sellRateLatest?.[0]?.valor || null,
          buyRateHistory,
          sellRateHistory,
          tpmData,
          ipcIndex,
          ipcVariation,
          reserves,
          remittances,
          fedData,
        });
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, []);

  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="header-brand">
          <div className="header-logo">D$</div>
          <div>
            <div className="header-title">
              <span>Dollar Watch</span>
            </div>
            <div className="header-subtitle">Panel Económico de Honduras</div>
          </div>
        </div>
        <div className="header-right">
          <div className="header-badge">Datos en Vivo</div>
          <div className="header-datafluid">
            por <a href="https://datafluid.ai" target="_blank" rel="noopener noreferrer">Data Fluid</a>
          </div>
        </div>
      </header>

      {/* ERROR BANNER */}
      {error && (
        <div style={{
          margin: '20px 32px',
          padding: '16px 20px',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 12,
          color: '#f43f5e',
          fontSize: 14,
        }}>
          ⚠️ Error al cargar datos: {error}. Algunos paneles pueden estar vacíos.
        </div>
      )}

      {/* DASHBOARD GRID */}
      <main className="dashboard">
        {/* 1. Exchange rate chart (top-left) — Reference rate */}
        <div className="card" style={{ gridRow: '1 / 2' }}>
          <ExchangeRateChart
            data={data.exchangeRate || []}
            buyData={data.buyRateHistory || []}
            sellData={data.sellRateHistory || []}
            loading={loading}
          />
        </div>

        {/* 2. KPI cards (top-right) */}
        <div className="card" style={{ gridRow: '1 / 2' }}>
          <KpiCards
            data={data.exchangeRate || []}
            buyRate={data.buyRate}
            sellRate={data.sellRate}
            loading={loading}
          />
        </div>

        {/* 3. Interest rate comparison (middle-left) */}
        <div className="card">
          <InterestRateChart
            bchData={data.tpmData || []}
            fedData={data.fedData || []}
            loading={loading}
          />
        </div>

        {/* 4. Inflation (middle-right) */}
        <div className="card">
          <InflationPanel
            ipcIndex={data.ipcIndex || []}
            ipcVariation={data.ipcVariation || []}
            loading={loading}
          />
        </div>

        {/* 5. International reserves (bottom-left) */}
        <div className="card">
          <ReservesChart
            data={data.reserves || []}
            loading={loading}
          />
        </div>

        {/* 6. Remittances (bottom-right) */}
        <div className="card">
          <RemittancesChart
            data={data.remittances || []}
            loading={loading}
          />
        </div>
      </main>

      {/* FOOTER */}
      <footer style={{
        textAlign: 'center',
        padding: '24px 32px 40px',
        color: '#64748b',
        fontSize: 12,
        position: 'relative',
        zIndex: 1,
      }}>
        <p>Datos del <strong>Banco Central de Honduras (BCH)</strong> · Reserva Federal (FRED)</p>
        <p style={{ marginTop: 4, color: '#475569' }}>
          © {new Date().getFullYear()} <a href="https://datafluid.ai" style={{ color: '#6366f1', textDecoration: 'none' }}>Data Fluid</a> · dollar.datafluid.ai
        </p>
      </footer>
    </>
  );
}
