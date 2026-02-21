export type IngredientStatus = 'positive' | 'negative' | 'neutral' | 'highlight';

export interface IngredientBadge {
    label: string;
    status: IngredientStatus;
}

export function analyzeIngredients(ingredients?: string[] | null): IngredientBadge[] {
    if (!ingredients || ingredients.length === 0) {
        return [];
    }

    const badges: IngredientBadge[] = [];
    const lowerIngredients = ingredients.map(i => i.toLowerCase());

    // Helper flags
    let hasAlcohol = false;
    let hasFragrance = false;
    let hasSulfate = false;

    const highlightsFound = new Set<string>();

    for (const ingredient of lowerIngredients) {
        // 1. Negative Triggers
        // Alcohol (exclude fatty alcohols which are generally good/safe)
        if (
            ingredient.includes('alcohol') &&
            !ingredient.includes('cetyl') &&
            !ingredient.includes('stearyl') &&
            !ingredient.includes('cetearyl') &&
            !ingredient.includes('behenyl')
        ) {
            hasAlcohol = true;
        }

        // Fragrance / Parfum
        if (ingredient.includes('fragrance') || ingredient.includes('parfum')) {
            hasFragrance = true;
        }

        // Sulfate
        if (ingredient.includes('sulfate')) {
            hasSulfate = true;
        }

        // 2. Highlights / Positive
        if (ingredient.includes('niacinamide')) highlightsFound.add('Niacinamide');
        if (ingredient.includes('salicylic acid') || ingredient.includes('bha')) highlightsFound.add('Salicylic Acid');
        if (ingredient.includes('hyaluronic') || ingredient.includes('sodium hyaluronate')) highlightsFound.add('Hyaluronic Acid');
        if (ingredient.includes('ceramide')) highlightsFound.add('Ceramide');
        if (ingredient.includes('retinol') || ingredient.includes('retinoid')) highlightsFound.add('Retinol');
    }

    // Add highlight badges
    highlightsFound.forEach(label => {
        badges.push({ label, status: 'highlight' });
    });

    // Add negative badges
    if (hasAlcohol) badges.push({ label: 'Mengandung Alkohol', status: 'negative' });
    if (hasFragrance) badges.push({ label: 'Mengandung Pewangi', status: 'negative' });
    if (hasSulfate) badges.push({ label: 'Mengandung Sulfat', status: 'negative' });

    // Add positive missing triggers
    if (!hasAlcohol) badges.push({ label: 'Bebas Alkohol', status: 'positive' });
    if (!hasFragrance) badges.push({ label: 'Bebas Pewangi', status: 'positive' });

    return badges;
}
