'use client';

import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend);

// TPM monthly (700) comes as a decimal fraction (0.0575 = 5.75%).
// Fed rate comes as a regular percentage (4.33 = 4.33%).
// We normalize both to display as percentages.

export default function InterestRateChart({ bchData, fedData, loading }) {
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner" />
                <span>Cargando tasas de interés…</span>
            </div>
        );
    }

    const bchPoints = (bchData || []).map((d) => ({
        x: d.fecha,
        y: d.valor * 100, // Convert decimal to percentage
    }));

    // Filter Fed data to start from 2021 to match BCH TPM range
    const fedPoints = (fedData || [])
        .filter((d) => d.fecha >= '2021-01-01')
        .map((d) => ({
            x: d.fecha,
            y: d.valor,
        }));

    const chartData = {
        datasets: [
            {
                label: 'TPM BCH',
                data: bchPoints,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 4,
                borderWidth: 2.5,
                fill: false,
            },
            {
                label: 'Tasa Fed EE.UU.',
                data: fedPoints,
                borderColor: '#22d3ee',
                backgroundColor: 'rgba(34, 211, 238, 0.08)',
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 4,
                borderWidth: 2.5,
                borderDash: [6, 3],
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'end',
                labels: {
                    color: '#94a3b8',
                    font: { family: 'Inter', size: 11 },
                    usePointStyle: true,
                    pointStyle: 'line',
                    padding: 16,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                borderWidth: 1,
                padding: 12,
                titleFont: { family: 'Inter', size: 12 },
                bodyFont: { family: 'Inter', size: 13, weight: '600' },
                titleColor: '#94a3b8',
                bodyColor: '#f1f5f9',
                cornerRadius: 8,
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(2)}%`,
                },
            },
        },
        scales: {
            x: {
                type: 'time',
                time: { unit: 'year' },
                min: '2021-01-01',
                ticks: { color: '#64748b', font: { family: 'Inter', size: 11 }, maxTicksLimit: 6 },
                grid: { color: 'rgba(99, 102, 241, 0.06)' },
                border: { display: false },
            },
            y: {
                ticks: {
                    color: '#64748b',
                    font: { family: 'Inter', size: 11 },
                    callback: (v) => `${v}%`,
                },
                grid: { color: 'rgba(99, 102, 241, 0.06)' },
                border: { display: false },
            },
        },
    };

    // Get current values for display (BCH needs *100)
    const latestBch = bchData && bchData.length > 0 ? bchData[bchData.length - 1].valor * 100 : null;
    const latestFed = fedData && fedData.length > 0 ? fedData[fedData.length - 1].valor : null;

    return (
        <>
            <div className="card-header">
                <div className="card-title">Comparación de Tasas de Interés</div>
                <div className="card-icon purple">📊</div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 6 }}>
                {latestBch !== null && (
                    <div className="stat-highlight" style={{ padding: '4px 0' }}>
                        <div className="stat-number" style={{ fontSize: 20, color: '#6366f1' }}>
                            {latestBch.toFixed(2)}%
                        </div>
                        <div className="stat-meta">
                            <div className="stat-meta-label">TPM BCH</div>
                        </div>
                    </div>
                )}
                {latestFed !== null && (
                    <div className="stat-highlight" style={{ padding: '4px 0' }}>
                        <div className="stat-number" style={{ fontSize: 20, color: '#22d3ee' }}>
                            {latestFed.toFixed(2)}%
                        </div>
                        <div className="stat-meta">
                            <div className="stat-meta-label">Tasa Fed EE.UU.</div>
                        </div>
                    </div>
                )}
            </div>
            <div className="chart-container" style={{ height: 170 }}>
                <Line data={chartData} options={options} />
            </div>
        </>
    );
}
