import { Dish } from './data';
import { User, UserMealHistory } from './user';

export interface MealRecommendation {
  dish: Dish;
  score: number;
  reason: string;
}

export function getMealRecommendations(
  user: User,
  dishes: Dish[],
  mealHistory: UserMealHistory[],
  maxRecommendations: number = 5
): MealRecommendation[] {
  // Get user's recent meal history (last 7 days)
  const recentHistory = mealHistory.filter(
    entry => entry.userId === user.id && 
    new Date(entry.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );

  // Calculate user's average carbon footprint per meal
  const avgCarbonFootprint = recentHistory.length > 0
    ? recentHistory.reduce((sum, entry) => sum + entry.carbonFootprint, 0) / recentHistory.length
    : 0;

  // Score each dish based on multiple factors
  const scoredDishes = dishes.map(dish => {
    let score = 0;
    const reasons: string[] = [];

    // Factor 1: Carbon footprint (lower is better)
    const carbonScore = 1 - (dish.carbonFootprint / 5.8); // 5.8 is max carbon footprint in our data
    score += carbonScore * 0.4;
    reasons.push(`Low carbon footprint (${dish.carbonFootprint} kg CO2e)`);

    // Factor 2: User preferences
    if (user.mealPreferences.includes(dish.id)) {
      score += 0.3;
      reasons.push("Matches your preferences");
    }

    // Factor 3: Dietary restrictions
    const meetsRestrictions = user.dietaryRestrictions.every(restriction => {
      switch (restriction.toLowerCase()) {
        case "vegetarian":
          return dish.isVegetarian;
        case "vegan":
          return dish.isVegan;
        case "gluten-free":
          return dish.isGlutenFree;
        default:
          return true;
      }
    });
    if (meetsRestrictions) {
      score += 0.2;
      reasons.push("Meets your dietary restrictions");
    }

    // Factor 4: Popularity
    score += (dish.popularity / 10) * 0.1;
    reasons.push(`Popular choice (${dish.popularity}/10)`);

    return {
      dish,
      score,
      reason: reasons.join(", ")
    };
  });

  // Sort by score and return top recommendations
  return scoredDishes
    .sort((a, b) => b.score - a.score)
    .slice(0, maxRecommendations);
}

export function getPersonalizedCarbonTips(user: User, mealHistory: UserMealHistory[]): string[] {
  const tips: string[] = [];
  
  // Calculate average daily carbon footprint
  const dailyFootprints = mealHistory
    .filter(entry => entry.userId === user.id)
    .reduce((acc, entry) => {
      const date = entry.date;
      if (!acc[date]) acc[date] = 0;
      acc[date] += entry.carbonFootprint;
      return acc;
    }, {} as Record<string, number>);

  const avgDailyFootprint = Object.values(dailyFootprints).reduce((sum, val) => sum + val, 0) / 
    Object.keys(dailyFootprints).length;

  // Generate tips based on user's carbon footprint
  if (avgDailyFootprint > 3) {
    tips.push("Consider choosing more plant-based options to reduce your carbon footprint");
  }
  if (user.carbonFootprint > 40) {
    tips.push("Your monthly carbon footprint is above average. Try incorporating more low-carbon meals");
  }

  return tips;
} 