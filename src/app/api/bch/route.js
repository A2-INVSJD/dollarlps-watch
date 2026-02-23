import { NextResponse } from 'next/server';

const BCH_API_BASE = process.env.BCH_API_BASE_URL;
const BCH_API_KEY = process.env.BCH_API_KEY;

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFinal = searchParams.get('fechaFinal');
    const reciente = searchParams.get('reciente');

    if (!id) {
        return NextResponse.json({ error: 'Missing indicator id' }, { status: 400 });
    }

    if (!BCH_API_BASE || !BCH_API_KEY) {
        return NextResponse.json(
            { error: 'Missing BCH_API_BASE_URL or BCH_API_KEY in environment' },
            { status: 500 }
        );
    }

    // Build query params — key goes as "clave" query param, NOT as a header
    const params = new URLSearchParams();
    params.set('formato', 'Json');
    params.set('clave', BCH_API_KEY);
    // Use DESC when fetching recent records (so reciente=1 returns the latest),
    // ASC for historical date-range queries (so charts draw left-to-right)
    params.set('ordenamiento', reciente ? 'DESC' : 'ASC');
    if (fechaInicio) params.set('fechaInicio', fechaInicio);
    if (fechaFinal) params.set('fechaFinal', fechaFinal);
    if (reciente) params.set('reciente', reciente);

    const url = `${BCH_API_BASE}/indicadores/${id}/cifras?${params.toString()}`;

    try {
        const res = await fetch(url, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            const text = await res.text();
            console.error(`BCH API error for id ${id}: ${res.status}`, text);
            return NextResponse.json(
                { error: `BCH API error: ${res.status}`, detail: text },
                { status: res.status }
            );
        }

        const data = await res.json();

        // BCH API wraps results in { value: [...], Count: N }
        const items = Array.isArray(data) ? data : (data.value || []);

        // Normalize PascalCase response to camelCase for frontend consistency
        const normalized = items.map((item) => ({
            id: item.Id,
            indicadorId: item.IndicadorId,
            nombre: item.Nombre,
            descripcion: item.Descripcion,
            fecha: item.Fecha,
            valor: item.Valor,
        }));

        return NextResponse.json(normalized);
    } catch (err) {
        console.error('BCH fetch error:', err);
        return NextResponse.json(
            { error: 'Failed to fetch BCH data', detail: err.message },
            { status: 500 }
        );
    }
}
