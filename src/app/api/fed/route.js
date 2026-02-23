import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // FRED public API - Federal Funds Effective Rate (monthly)
        const url =
            'https://fred.stlouisfed.org/graph/fredgraph.csv?id=FEDFUNDS&cosd=2015-01-01';

        const res = await fetch(url, {
            next: { revalidate: 86400 }, // cache for 24h
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: 'FRED API error' },
                { status: res.status }
            );
        }

        const csvText = await res.text();
        const lines = csvText.trim().split('\n').slice(1); // skip header
        const data = lines
            .map((line) => {
                const [date, value] = line.split(',');
                const v = parseFloat(value);
                if (isNaN(v) || value === '.') return null;
                return { fecha: date, valor: v };
            })
            .filter(Boolean);

        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(
            { error: 'Failed to fetch Fed data', detail: err.message },
            { status: 500 }
        );
    }
}
