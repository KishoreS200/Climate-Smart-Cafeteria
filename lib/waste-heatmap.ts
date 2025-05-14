import { Location } from './data';
import { UserWasteContribution } from './user';

export interface WasteHeatmapData {
  locationId: string;
  locationName: string;
  wasteAmount: number;
  wasteType: string;
  timestamp: string;
  coordinates: {
    x: number;
    y: number;
  };
}

export interface WasteHeatmapStats {
  totalWaste: number;
  wasteByType: Record<string, number>;
  wasteByLocation: Record<string, number>;
  wasteByTime: Record<string, number>;
}

export function generateWasteHeatmapData(
  locations: Location[],
  wasteContributions: UserWasteContribution[],
  timeRange: { start: string; end: string }
): WasteHeatmapData[] {
  // Filter waste contributions by time range
  const filteredContributions = wasteContributions.filter(
    contribution => 
      contribution.date >= timeRange.start && 
      contribution.date <= timeRange.end
  );

  // Generate heatmap data points
  return filteredContributions.map(contribution => {
    const location = locations.find(loc => loc.id === contribution.locationId);
    if (!location) return null;

    // Generate random coordinates within a grid (in a real app, these would be actual coordinates)
    const coordinates = {
      x: Math.random() * 100,
      y: Math.random() * 100
    };

    return {
      locationId: contribution.locationId,
      locationName: location.name,
      wasteAmount: contribution.quantity,
      wasteType: contribution.wasteType,
      timestamp: contribution.date,
      coordinates
    };
  }).filter((data): data is WasteHeatmapData => data !== null);
}

export function calculateWasteStats(
  wasteContributions: UserWasteContribution[]
): WasteHeatmapStats {
  const stats: WasteHeatmapStats = {
    totalWaste: 0,
    wasteByType: {},
    wasteByLocation: {},
    wasteByTime: {}
  };

  wasteContributions.forEach(contribution => {
    // Total waste
    stats.totalWaste += contribution.quantity;

    // Waste by type
    if (!stats.wasteByType[contribution.wasteType]) {
      stats.wasteByType[contribution.wasteType] = 0;
    }
    stats.wasteByType[contribution.wasteType] += contribution.quantity;

    // Waste by location
    if (!stats.wasteByLocation[contribution.locationId]) {
      stats.wasteByLocation[contribution.locationId] = 0;
    }
    stats.wasteByLocation[contribution.locationId] += contribution.quantity;

    // Waste by time (grouped by date)
    if (!stats.wasteByTime[contribution.date]) {
      stats.wasteByTime[contribution.date] = 0;
    }
    stats.wasteByTime[contribution.date] += contribution.quantity;
  });

  return stats;
}

export function getWasteReductionTips(stats: WasteHeatmapStats): string[] {
  const tips: string[] = [];

  // Analyze waste patterns and generate tips
  const totalWaste = stats.totalWaste;
  const wasteByType = stats.wasteByType;

  // Tip 1: Identify highest waste type
  const highestWasteType = Object.entries(wasteByType)
    .sort(([, a], [, b]) => b - a)[0];
  if (highestWasteType) {
    tips.push(`Focus on reducing ${highestWasteType[0]} waste, which accounts for ${(highestWasteType[1] / totalWaste * 100).toFixed(1)}% of total waste`);
  }

  // Tip 2: Suggest composting for organic waste
  if (wasteByType["Food Scraps"] || wasteByType["Vegetables"] || wasteByType["Fruits"]) {
    tips.push("Consider implementing a composting program for organic waste");
  }

  // Tip 3: Suggest donation for edible food waste
  if (wasteByType["Prepared Food"] || wasteByType["Leftovers"]) {
    tips.push("Partner with local food banks to donate edible food waste");
  }

  return tips;
} 