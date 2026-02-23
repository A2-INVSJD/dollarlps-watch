'use client';

import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Filler,
    Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Filler, Tooltip);

export default function InflationPanel({ ipcIndex, ipcVariation, loading }) {
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner" />
                <span>Cargando datos de inflación…</span>
            </div>
        );
    }

    const latestVar = ipcVariation && ipcVariation.length > 0
        ? ipcVariation[ipcVariation.length - 1]
        : null;

    const latestIdx = ipcIndex && ipcIndex.length > 0
        ? ipcIndex[ipcIndex.length - 1]
        : null;

    // Sparkline from variation data (last 24 months)
    const sparkData = (ipcVariation || []).slice(-24);

    const chartData = {
        labels: sparkData.map((d) => d.fecha),
        datasets: [
            {
                data: sparkData.map((d) => d.valor),
                borderColor: '#f59e0b',
                backgroundColor: (ctx) => {
                    const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
                    gradient.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
                    gradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');
                    return gradient;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: {
            x: { display: false },
            y: { display: false },
        },
    };

    const dateStr = latestVar
        ? new Date(latestVar.fecha).toLocaleDateString('es-HN', {
            month: 'long',
            year: 'numeric',
        })
        : '';

    return (
        <>
            <div className="card-header">
                <div className="card-title">Inflación (IPC)</div>
                <div className="card-icon amber">📈</div>
            </div>
            <div className="stat-highlight">
                <div className="stat-number amber">
                    {latestVar ? `${latestVar.valor.toFixed(2)}%` : '—'}
                </div>
                <div className="stat-meta">
                    <div className="stat-meta-label">Inflación Interanual</div>
                    <div className="stat-meta-sub">{dateStr}</div>
                </div>
            </div>
            {latestIdx && (
                <div className="stat-highlight">
                    <div className="stat-number" style={{ fontSize: 20, color: '#94a3b8' }}>
                        {latestIdx.valor.toFixed(2)}
                    </div>
                    <div className="stat-meta">
                        <div className="stat-meta-label">Índice IPC</div>
                        <div className="stat-meta-sub">Base 100</div>
                    </div>
                </div>
            )}
            <div style={{ height: 60, marginTop: 4 }}>
                <Line data={chartData} options={options} />
            </div>
        </>
    );
}
