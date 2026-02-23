'use client';

import { useState } from 'react';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Filler, Tooltip, Legend);

const RANGES = [
    { label: '1M', days: 30 },
    { label: '3M', days: 90 },
    { label: '6M', days: 180 },
    { label: '1A', days: 365 },
    { label: 'TODO', days: 3650 },
];

// Compute daily spread from buy & sell arrays matched by date
function computeSpread(buyData, sellData) {
    const buyMap = {};
    buyData.forEach((d) => {
        const key = d.fecha.substring(0, 10);
        buyMap[key] = d.valor;
    });

    return sellData
        .map((d) => {
            const key = d.fecha.substring(0, 10);
            const buy = buyMap[key];
            if (buy == null) return null;
            return { fecha: d.fecha, valor: d.valor - buy };
        })
        .filter(Boolean);
}

// Custom plugin: draw horizontal milestone lines at key exchange rate levels
const milestonePlugin = {
    id: 'milestoneLines',
    afterDraw(chart) {
        const { ctx, chartArea, scales } = chart;
        if (!chartArea || !scales.y) return;

        const milestones = [
            { value: 24, label: 'L 24', color: 'rgba(34, 211, 238, 0.4)' },
            { value: 25, label: 'L 25', color: 'rgba(99, 102, 241, 0.4)' },
            { value: 26, label: 'L 26', color: 'rgba(245, 158, 11, 0.4)' },
        ];

        const yMin = scales.y.min;
        const yMax = scales.y.max;

        milestones.forEach(({ value, label, color }) => {
            if (value < yMin || value > yMax) return; // Only draw if in view

            const y = scales.y.getPixelForValue(value);

            // Dashed line
            ctx.save();
            ctx.beginPath();
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.moveTo(chartArea.left, y);
            ctx.lineTo(chartArea.right, y);
            ctx.stroke();

            // Label
            ctx.setLineDash([]);
            ctx.fillStyle = color;
            ctx.font = '600 9px Inter, sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(label, chartArea.right - 4, y - 4);
            ctx.restore();
        });
    },
};

export default function ExchangeRateChart({ data, buyData, sellData, loading }) {
    const [range, setRange] = useState('TODO');

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner" />
                <span>Cargando tipo de cambio…</span>
            </div>
        );
    }

    const rangeDays = RANGES.find((r) => r.label === range)?.days || 365;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - rangeDays);

    const filterByRange = (arr) =>
        range === 'TODO' ? arr : arr.filter((d) => new Date(d.fecha) >= cutoff);

    const filtered = filterByRange(data);
    const spreadData = computeSpread(buyData || [], sellData || []);
    const filteredSpread = filterByRange(spreadData);

    // ─── Main exchange rate chart ─────────────────────
    const chartData = {
        labels: filtered.map((d) => d.fecha),
        datasets: [
            {
                label: 'TC Referencia',
                data: filtered.map((d) => d.valor),
                borderColor: '#6366f1',
                backgroundColor: (ctx) => {
                    const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
                    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
                    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
                    return gradient;
                },
                fill: true,
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#6366f1',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
                borderWidth: 2.5,
            },
        ],
    };

    const rateOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                borderColor: 'rgba(99, 102, 241, 0.3)',
                borderWidth: 1,
                padding: 12,
                titleFont: { family: 'Inter', size: 12, weight: '500' },
                bodyFont: { family: 'Inter', size: 14, weight: '700' },
                titleColor: '#94a3b8',
                bodyColor: '#f1f5f9',
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: (ctx) => `L ${ctx.parsed.y.toFixed(4)}`,
                },
            },
        },
        scales: {
            x: {
                type: 'time',
                time: { unit: rangeDays <= 90 ? 'week' : 'month' },
                ticks: { color: '#64748b', font: { family: 'Inter', size: 11 }, maxTicksLimit: 8 },
                grid: { color: 'rgba(99, 102, 241, 0.06)' },
                border: { display: false },
            },
            y: {
                ticks: {
                    color: '#64748b',
                    font: { family: 'Inter', size: 11 },
                    callback: (v) => `L ${v.toFixed(2)}`,
                },
                grid: { color: 'rgba(99, 102, 241, 0.06)' },
                border: { display: false },
            },
        },
    };

    // ─── Spread mini chart ────────────────────────────
    const spreadChartData = {
        labels: filteredSpread.map((d) => d.fecha),
        datasets: [
            {
                label: 'Diferencial',
                data: filteredSpread.map((d) => d.valor),
                borderColor: '#f59e0b',
                backgroundColor: (ctx) => {
                    const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
                    gradient.addColorStop(0, 'rgba(245, 158, 11, 0.15)');
                    gradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');
                    return gradient;
                },
                fill: true,
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 3,
                borderWidth: 1.5,
            },
        ],
    };

    const spreadOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                borderColor: 'rgba(245, 158, 11, 0.3)',
                borderWidth: 1,
                padding: 8,
                titleFont: { family: 'Inter', size: 10 },
                bodyFont: { family: 'Inter', size: 12, weight: '600' },
                titleColor: '#94a3b8',
                bodyColor: '#f1f5f9',
                cornerRadius: 6,
                displayColors: false,
                callbacks: {
                    label: (ctx) => `Spread: L ${ctx.parsed.y.toFixed(4)}`,
                },
            },
        },
        scales: {
            x: {
                type: 'time',
                time: { unit: rangeDays <= 90 ? 'week' : 'month' },
                ticks: { display: false },
                grid: { display: false },
                border: { display: false },
            },
            y: {
                ticks: {
                    color: '#64748b',
                    font: { family: 'Inter', size: 9 },
                    callback: (v) => `${v.toFixed(2)}`,
                    maxTicksLimit: 3,
                },
                grid: { color: 'rgba(245, 158, 11, 0.06)' },
                border: { display: false },
            },
        },
    };

    return (
        <>
            <div className="card-header">
                <div className="card-title">Tipo de Cambio USD / HNL</div>
                <div className="time-range">
                    {RANGES.map((r) => (
                        <button
                            key={r.label}
                            className={`time-btn ${range === r.label ? 'active' : ''}`}
                            onClick={() => setRange(r.label)}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main exchange rate line with milestone annotations */}
            <div className="chart-container" style={{ height: 200 }}>
                <Line data={chartData} options={rateOptions} plugins={[milestonePlugin]} />
            </div>

            {/* Spread mini chart — always visible below */}
            <div style={{
                marginTop: 8,
                borderTop: '1px solid rgba(245, 158, 11, 0.1)',
                paddingTop: 6,
            }}>
                <div style={{
                    fontSize: 10,
                    color: '#94a3b8',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                }}>
                    <span style={{
                        width: 10, height: 2,
                        background: '#f59e0b',
                        borderRadius: 1,
                        display: 'inline-block'
                    }} />
                    Diferencial Compra–Venta
                </div>
                <div style={{ height: 50 }}>
                    <Line data={spreadChartData} options={spreadOptions} />
                </div>
            </div>
        </>
    );
}
