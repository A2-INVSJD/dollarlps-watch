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

export default function ReservesChart({ data, loading }) {
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner" />
                <span>Cargando reservas internacionales…</span>
            </div>
        );
    }

    const last24 = (data || []).slice(-24);
    const latest = last24.length > 0 ? last24[last24.length - 1] : null;

    const chartData = {
        labels: last24.map((d) =>
            new Date(d.fecha).toLocaleDateString('es-HN', { month: 'short', year: '2-digit' })
        ),
        datasets: [
            {
                label: 'RIN (USD M)',
                data: last24.map((d) => d.valor),
                backgroundColor: last24.map((_, i) =>
                    i === last24.length - 1
                        ? 'rgba(16, 185, 129, 0.7)'
                        : 'rgba(16, 185, 129, 0.25)'
                ),
                borderColor: last24.map((_, i) =>
                    i === last24.length - 1
                        ? 'rgba(16, 185, 129, 1)'
                        : 'rgba(16, 185, 129, 0.4)'
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
                borderColor: 'rgba(16, 185, 129, 0.3)',
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
                grid: { color: 'rgba(16, 185, 129, 0.06)' },
                border: { display: false },
            },
        },
    };

    const dateStr = latest
        ? new Date(latest.fecha).toLocaleDateString('es-HN', {
            month: 'long',
            year: 'numeric',
        })
        : '';

    return (
        <>
            <div className="card-header">
                <div className="card-title">Reservas Internacionales</div>
                <div className="card-icon emerald">🏦</div>
            </div>
            <div className="stat-highlight">
                <div className="stat-number emerald">
                    {latest ? `$${fmtM(latest.valor)}M` : '—'}
                </div>
                <div className="stat-meta">
                    <div className="stat-meta-label">Reservas Netas (RIN)</div>
                    <div className="stat-meta-sub">{dateStr}</div>
                </div>
            </div>
            <div className="chart-container" style={{ height: 130 }}>
                <Bar data={chartData} options={options} />
            </div>
        </>
    );
}
