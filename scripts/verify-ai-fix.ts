
import dbConnect from '../src/lib/mongodb';
import Destination from '../src/models/Destination';
import { calculateSuitability } from '../src/lib/ai-engine';

async function verify() {
    console.log('🔌 Connecting to DB...');
    await dbConnect();

    console.log('🌍 Fetching destinations...');
    const destinations = await Destination.find({}).lean();
    console.log(`✅ Found ${destinations.length} destinations.`);

    const query = "warm beach";
    console.log(`🤖 Testing AI Suitability with query: "${query}"...`);

    const results = await calculateSuitability(query, destinations);

    if (results.length === 0) {
        console.error('❌ No results returned.');
        process.exit(1);
    }

    const firstMatch = results[0];
    console.log('🥇 Top match:', firstMatch);

    // Verification Logic
    if (!firstMatch.name) {
        console.error('❌ FAILED: "name" property is MISSING from AI result.');
        console.error('The Globe visualization will NOT work.');
        process.exit(1);
    } else {
        console.log('✅ SUCCESS: "name" property is present: ', firstMatch.name);
        console.log('✅ Fix confirmed. The Globe visualization SHOULD work.');
    }

    process.exit(0);
}

verify().catch(err => {
    console.error(err);
    process.exit(1);
});
