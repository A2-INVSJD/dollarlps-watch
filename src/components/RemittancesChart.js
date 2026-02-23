'use client';

import {
    Chart as ChartJS,
    BarElement,
    LinearScale,
    CategoryScale,
    Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, LinearScale, CategoryScale, Tooltip);

function fmtM(n) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export default function RemittancesChart({ data, loading }) {
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner" />
                <span>Cargando datos de remesas…</span>
            </div>
        );
    }

    // Show last 16 quarters
    const last24 = (data || []).slice(-16);
    const latest = last24.length > 0 ? last24[last24.length - 1] : null;

    const chartData = {
        labels: last24.map((d) => {
            const dt = new Date(d.fecha);
            const q = Math.ceil((dt.getMonth() + 1) / 3);
            return `T${q} ${dt.getFullYear()}`;
        }),
        datasets: [
            {
                label: 'Remesas (USD M)',
                data: last24.map((d) => d.valor),
                backgroundColor: last24.map((_, i) =>
                    i === last24.length - 1
                        ? 'rgba(34, 211, 238, 0.7)'
                        : 'rgba(34, 211, 238, 0.2)'
                ),
                borderColor: last24.map((_, i) =>
                    i === last24.length - 1
                        ? 'rgba(34, 211, 238, 1)'
                        : 'rgba(34, 211, 238, 0.4)'
                ),
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                borderColor: 'rgba(34, 211, 238, 0.3)',
                borderWidth: 1,
                padding: 10,
                titleFont: { family: 'Inter', size: 11 },
                bodyFont: { family: 'Inter', size: 13, weight: '600' },
                titleColor: '#94a3b8',
                bodyColor: '#f1f5f9',
                cornerRadius: 8,
                callbacks: {
                    label: (ctx) => `$${fmtM(ctx.parsed.y)}M`,
                },
            },
        },
        scales: {
            x: {
                ticks: { color: '#64748b', font: { family: 'Inter', size: 9 }, maxRotation: 45 },
                grid: { display: false },
                border: { display: false },
            },
            y: {
                ticks: {
                    color: '#64748b',
                    font: { family: 'Inter', size: 10 },
                    callback: (v) => `$${v.toLocaleString('en-US')}M`,
                },
                grid: { color: 'rgba(34, 211, 238, 0.06)' },
                border: { display: false },
            },
        },
    };

    // Calculate YoY change (compare with same quarter last year = 4 quarters back)
    let yoyChange = null;
    if (last24.length >= 5) {
        const curr = last24[last24.length - 1].valor;
        const prev = last24[last24.length - 5]?.valor;
        if (prev && prev > 0) {
            yoyChange = ((curr - prev) / prev) * 100;
        }
    }

    const dateStr = latest
        ? (() => {
            const dt = new Date(latest.fecha);
            const q = Math.ceil((dt.getMonth() + 1) / 3);
            return `T${q} ${dt.getFullYear()}`;
        })()
        : '';

    return (
        <>
            <div className="card-header">
                <div className="card-title">Remesas Familiares</div>
                <div className="card-icon cyan">💸</div>
            </div>
            <div className="stat-highlight">
                <div className="stat-number cyan">
                    {latest ? `$${fmtM(latest.valor)}M` : '—'}
                </div>
                <div className="stat-meta">
                    <div className="stat-meta-label">Último Trimestre · {dateStr}</div>
                    {yoyChange !== null && (
                        <div className="stat-meta-sub">
                            Interanual: <span style={{ color: yoyChange >= 0 ? '#10b981' : '#f43f5e' }}>
                                {yoyChange >= 0 ? '+' : ''}{yoyChange.toFixed(1)}%
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div className="chart-container" style={{ height: 130 }}>
                <Bar data={chartData} options={options} />
            </div>
        </>
    );
}
