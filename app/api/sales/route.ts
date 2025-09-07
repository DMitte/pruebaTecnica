import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../config/supabase';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // Validación básica
        if (!data.product_id || !data.quantity || !data.price) {
            return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
        }

        const { error, data: sale } = await supabase
            .from('sales')
            .insert(data)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ sale }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}