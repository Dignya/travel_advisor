
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Destination from '@/models/Destination';
import { calculateSuitability } from '@/lib/ai-engine';

export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json(
                { error: 'Query is required' },
                { status: 400 }
            );
        }

        // 1. Connect to DB
        await dbConnect();

        // 2. Fetch all destinations
        // In a real app with thousands of docs, we would use vector search here
        const destinations = await Destination.find({}).lean();

        // 3. Calculate scores
        const results = await calculateSuitability(query, destinations);

        // 4. Return top matches (filtered > 0)
        const matches = results.filter(r => r.score > 0);

        return NextResponse.json({
            matches: matches,
            count: matches.length
        });

    } catch (error) {
        console.error('AI Match API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
