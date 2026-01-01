
interface ScoredDestination {
  id: string;
  score: number;
  matchReason: string;
  name: string;
  city: string;
  country: string;
}

// Simple keyword-based scoring engine
// In a real app, this would use OpenAI embeddings or an LLM
export const calculateSuitability = async (
  query: string,
  destinations: any[]
): Promise<ScoredDestination[]> => {
  const normalizedQuery = query.toLowerCase();

  // 1. Geography Detection
  // Detect if the user specified a country/region
  // In a real app, use an NLP Named Entity Recognition (NER) model
  const knownCountries = ['india', 'france', 'usa', 'united states', 'china', 'peru', 'australia', 'egypt', 'brazil', 'japan', 'italy', 'uk', 'germany'];
  const targetCountry = knownCountries.find(c => normalizedQuery.includes(c));

  const results = destinations.map(dest => {
    let score = 0;
    const reasons: string[] = [];
    const destName = dest.name.toLowerCase();
    const destCountry = dest.country.toLowerCase();
    const destActivities = Array.isArray(dest.activities) ? dest.activities.join(' ').toLowerCase() : '';
    const destDesc = dest.description?.toLowerCase() || '';
    const fullText = `${destName} ${destCountry} ${destActivities} ${destDesc}`;

    // --- CRITICAL FILTERS (Pass/Fail) ---

    // A. Geography Filter (Strict)
    // If user asks for "India", penalize everything else heavily
    if (targetCountry) {
      // Handle "USA" vs "United States" aliasing
      const isMatch = destCountry.includes(targetCountry) ||
        (targetCountry === 'usa' && destCountry.includes('united states')) ||
        (targetCountry === 'united states' && destCountry.includes('usa'));

      if (isMatch) {
        score += 0.5;
        reasons.push(`Located in ${dest.country}`);
      } else {
        score -= 1.0; // Heavy penalty (Kill it)
        // reasons.push('Wrong country'); // Don't show negative reasons usually
      }
    }

    // B. "Beach" Logic (Specific)
    // If user says "beach" or "sea", requires water presence
    if (normalizedQuery.includes('beach') || normalizedQuery.includes('sea') || normalizedQuery.includes('ocean')) {
      const hasWater = destActivities.includes('beach') || destActivities.includes('water') || destDesc.includes('coastal') || destDesc.includes('island');
      if (hasWater) {
        score += 0.4;
        reasons.push('Has beaches/water');
      } else {
        score -= 0.5; // Penalty for dry places (like Pyramids) even if hot
      }
    }

    // --- SCORING FACTORS ---

    // 1. Climate
    // "Warm" matches "Hot" (Taj Mahal) but not if it's a beach query (handled above)
    // If simple "warm" request without specific terrain, match purely on climate
    if (normalizedQuery.includes('warm') || normalizedQuery.includes('hot')) {
      if (dest.climate === 'hot') {
        score += 0.3;
        if (!reasons.includes('Perfect hot climate')) reasons.push('Perfect hot climate');
      }
    }
    else if (normalizedQuery.includes('cold') || normalizedQuery.includes('snow')) {
      if (dest.climate === 'cold') { score += 0.4; reasons.push('Cold climate'); }
      else { score -= 0.3; }
    }

    // 2. Budget
    if (normalizedQuery.includes('cheap') || normalizedQuery.includes('budget')) {
      if (dest.budgetLevel === 'low') { score += 0.3; reasons.push('Budget friendly'); }
      else if (dest.budgetLevel === 'high') { score -= 0.2; }
    }

    // 3. Activity Word Matching (Fuzzy)
    const keywords = normalizedQuery.split(' ');
    let hitCount = 0;
    keywords.forEach(word => {
      if (word.length > 3 && !knownCountries.includes(word) &&
        !['warm', 'cold', 'beach', 'cheap'].includes(word)) { // Skip consumed keywords
        if (fullText.includes(word)) {
          score += 0.15;
          hitCount++;
        }
      }
    });
    if (hitCount > 0) reasons.push('Matches specific interests');


    // 4. Name Match (Ultimate Boost)
    if (destName.includes(normalizedQuery) || normalizedQuery.includes(destName)) {
      score += 1.0; // Override everything
      reasons.push('Exact match');
    }

    // --- NORMALIZATION ---
    // Ensure 0-1 range (clamping)
    if (score < 0) score = 0;

    // Add bit of noise for non-matches to not look dead, UNLESS they were killed by strict filters
    if (score === 0 && !targetCountry) score = 0.05 + (Math.random() * 0.05);

    // Cap
    score = Math.min(score, 0.99);

    return {
      id: dest.id || dest._id,
      score: parseFloat(score.toFixed(2)),
      matchReason: reasons.length > 0 ? reasons.slice(0, 3).join(', ') : 'Possible match',
      name: dest.name,
      city: dest.city,
      country: dest.country
    };
  });

  return results.sort((a, b) => b.score - a.score);
};
