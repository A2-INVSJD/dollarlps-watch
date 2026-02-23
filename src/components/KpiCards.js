'use client';

import { useState } from 'react';

// Utility: format number with thousand separators
function fmt(n, decimals = 4) {
    return n.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

export default function KpiCards({ data, buyRate, sellRate, loading }) {
    const [convertAmount, setConvertAmount] = useState('100');
    const [convertDir, setConvertDir] = useState('usd'); // 'usd' = USD→HNL, 'hnl' = HNL→USD

    if (loading || !data || data.length < 2) {
        return (
            <div className="kpi-section">
                <div className="kpi-hero">
                    <div className="kpi-hero-label">Tasa Actual</div>
                    <div className="kpi-hero-value" style={{ opacity: 0.3 }}>--</div>
                </div>
                <div className="loading-container" style={{ minHeight: 100 }}>
                    <div className="loading-spinner" />
                </div>
            </div>
        );
    }

    const current = data[data.length - 1];
    const currentVal = current.valor;
    const currentDate = new Date(current.fecha);

    // Helper: find closest value N days ago
    const findDaysAgo = (days) => {
        const target = new Date(currentDate);
        target.setDate(target.getDate() - days);
        let closest = data[0];
        for (const d of data) {
            if (new Date(d.fecha) <= target) closest = d;
            else break;
        }
        return closest?.valor;
    };

    // Year to date
    const ytdTarget = new Date(currentDate.getFullYear(), 0, 1);
    let ytdVal = data[0]?.valor;
    for (const d of data) {
        if (new Date(d.fecha) <= ytdTarget) ytdVal = d.valor;
        else break;
    }

    // ─── Devaluation velocity ────────────────────────
    // Annualized rate of change: (current - 1yr ago) per year
    const oneYearAgoVal = findDaysAgo(365);
    let devalVelocity = null;
    let devalPct = null;
    if (oneYearAgoVal && oneYearAgoVal > 0) {
        devalVelocity = currentVal - oneYearAgoVal; // L per year
        devalPct = (devalVelocity / oneYearAgoVal) * 100;
    }

    const changes = [
        { label: '1 Día', prev: findDaysAgo(1) },
        { label: '7 Días', prev: findDaysAgo(7) },
        { label: '1 Mes', prev: findDaysAgo(30) },
        { label: '1 Año', prev: findDaysAgo(365) },
        { label: 'Año a la Fecha', prev: ytdVal },
    ];

    const formatPct = (curr, prev) => {
        if (!prev || prev === 0) return { pct: '—', cls: 'neutral', abs: '' };
        const diff = curr - prev;
        const pct = (diff / prev) * 100;
        return {
            pct: `${pct >= 0 ? '+' : ''}${pct.toFixed(3)}%`,
            cls: pct > 0 ? 'negative' : pct < 0 ? 'positive' : 'neutral',
            abs: `${diff >= 0 ? '+' : ''}${fmt(diff)} L`,
        };
    };

    const dateStr = currentDate.toLocaleDateString('es-HN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    // ─── Converter logic ─────────────────────────────
    const numAmount = parseFloat(convertAmount) || 0;
    const converted =
        convertDir === 'usd'
            ? numAmount * (sellRate || currentVal) // USD → HNL at sell rate
            : numAmount / (buyRate || currentVal); // HNL → USD at buy rate

    return (
        <div className="kpi-section">
            {/* Hero rate */}
            <div className="kpi-hero">
                <div className="kpi-hero-label">Tipo de Cambio de Referencia</div>
                <div className="kpi-hero-value">L {fmt(currentVal)}</div>
                <div className="kpi-hero-sub">{dateStr} · Banco Central de Honduras</div>
            </div>

            {/* Buy / Sell / Spread */}
            {buyRate && sellRate && (
                <div className="spread-row">
                    <div className="spread-item">
                        <div className="spread-label">Compra</div>
                        <div className="spread-value">L {fmt(buyRate)}</div>
                    </div>
                    <div className="spread-item">
                        <div className="spread-label">Venta</div>
                        <div className="spread-value">L {fmt(sellRate)}</div>
                    </div>
                    <div className="spread-item">
                        <div className="spread-label">Diferencial</div>
                        <div className="spread-value">{fmt(sellRate - buyRate)}</div>
                    </div>
                </div>
            )}

            {/* Devaluation Velocity */}
            {devalVelocity !== null && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    background: 'rgba(244, 63, 94, 0.06)',
                    border: '1px solid rgba(244, 63, 94, 0.12)',
                    borderRadius: 10,
                    marginBottom: 10,
                }}>
                    <div style={{ fontSize: 18 }}>📉</div>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontSize: 10, fontWeight: 600, color: '#94a3b8',
                            textTransform: 'uppercase', letterSpacing: '0.3px',
                            marginBottom: 2
                        }}>
                            Velocidad de Devaluación
                        </div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                            <span style={{
                                fontSize: 18, fontWeight: 700,
                                color: devalVelocity > 0 ? '#f43f5e' : '#10b981',
                                fontFamily: 'Inter',
                            }}>
                                {devalVelocity > 0 ? '+' : ''}{fmt(devalVelocity)} L/año
                            </span>
                            <span style={{
                                fontSize: 12, fontWeight: 600,
                                color: devalPct > 0 ? '#f43f5e' : '#10b981'
                            }}>
                                ({devalPct > 0 ? '+' : ''}{devalPct.toFixed(2)}%)
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick converter */}
            <div style={{
                padding: '10px 14px',
                background: 'rgba(99, 102, 241, 0.06)',
                border: '1px solid rgba(99, 102, 241, 0.12)',
                borderRadius: 10,
                marginBottom: 10,
            }}>
                <div style={{
                    fontSize: 10, fontWeight: 600, color: '#94a3b8',
                    textTransform: 'uppercase', letterSpacing: '0.3px',
                    marginBottom: 8,
                    display: 'flex', alignItems: 'center', gap: 6,
                }}>
                    💱 Convertidor Rápido
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                        type="number"
                        value={convertAmount}
                        onChange={(e) => setConvertAmount(e.target.value)}
                        style={{
                            width: 90,
                            padding: '6px 10px',
                            background: 'rgba(15, 23, 42, 0.6)',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            borderRadius: 6,
                            color: '#f1f5f9',
                            fontSize: 14,
                            fontWeight: 600,
                            fontFamily: 'Inter',
                            outline: 'none',
                        }}
                    />
                    <button
                        onClick={() => setConvertDir(convertDir === 'usd' ? 'hnl' : 'usd')}
                        style={{
                            padding: '5px 10px',
                            background: 'rgba(99, 102, 241, 0.15)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            borderRadius: 6,
                            color: '#a5b4fc',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'Inter',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {convertDir === 'usd' ? 'USD → HNL' : 'HNL → USD'}
                    </button>
                    <div style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#e2e8f0',
                        fontFamily: 'Inter',
                    }}>
                        = {convertDir === 'usd' ? 'L' : '$'}{' '}
                        {converted.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </div>
                </div>
                <div style={{ fontSize: 9, color: '#64748b', marginTop: 4 }}>
                    {convertDir === 'usd' ? 'Usando tasa de venta' : 'Usando tasa de compra'}
                </div>
            </div>

            {/* Change metrics grid */}
            <div className="kpi-grid">
                {changes.map((c) => {
                    const { pct, cls, abs } = formatPct(currentVal, c.prev);
                    return (
                        <div className="kpi-item" key={c.label}>
                            <div className="kpi-label">{c.label}</div>
                            <div className={`kpi-value ${cls}`}>{pct}</div>
                            <div className="kpi-abs">{abs}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
