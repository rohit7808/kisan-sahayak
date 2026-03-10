import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Crop } from '@/models/Schemes'; // Using Schemes file where models are defined for now

// Fallback data for MVP if DB is empty
const STATIC_CROPS = [
    {
        name: 'Wheat (गेहूं)',
        soilTypes: ['Alluvial', 'Clay'],
        seasons: ['Rabi'],
        description: 'Major staple crop. Requires cool growing season and bright sunshine.',
        inputs: {
            fertilizer: 'DAP, Urea',
            pesticide: 'Termite control needed'
        }
    },
    {
        name: 'Rice (चावल)',
        soilTypes: ['Alluvial', 'Clay'],
        seasons: ['Kharif'],
        description: 'Staple food. Requires high humidity and water.',
        inputs: {
            fertilizer: 'N-P-K 100:60:60',
            pesticide: 'Stem borer control'
        }
    },
    {
        name: 'Cotton (कपास)',
        soilTypes: ['Black'],
        seasons: ['Kharif'],
        description: 'Fiber crop. Grows well in drier parts of black cotton soil.',
        inputs: {
            fertilizer: 'Potash, Zinc',
            pesticide: 'Bollworm control'
        }
    },
    {
        name: 'Mustard (सरसों)',
        soilTypes: ['Alluvial', 'Red'],
        seasons: ['Rabi'],
        description: 'Oilseed crop. Sensitive to frost.',
        inputs: {
            fertilizer: 'Sulfur, Nitrogen',
            pesticide: 'Aphid control'
        }
    },
    {
        name: 'Bajra (बाजरा)',
        soilTypes: ['Red', 'Alluvial'],
        seasons: ['Kharif', 'Zaid'],
        description: 'Drought tolerant crop, good for animal fodder too.',
        inputs: {
            fertilizer: 'Urea',
            pesticide: 'Minimal needed'
        }
    }
];

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { soilType, season } = await request.json();

        // For MVP, filter static data first. In production, query DB.
        // const crops = await Crop.find({ soilTypes: soilType, seasons: season });

        let crops = STATIC_CROPS.filter(c =>
            (c.soilTypes.includes(soilType) || c.soilTypes.includes('Alluvial')) &&
            c.seasons.includes(season)
        );

        // If no exact match, return some generic ones
        if (crops.length === 0) {
            crops = STATIC_CROPS.filter(c => c.seasons.includes(season));
        }

        return NextResponse.json({ crops });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
