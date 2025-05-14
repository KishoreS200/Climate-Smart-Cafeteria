export type UserRole = "Student" | "Staff" | "Admin";

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  name: string;
  carbonFootprint: number; // in kg CO2e
  mealPreferences: string[]; // IDs of preferred dishes
  dietaryRestrictions: string[];
  favoriteLocations: string[]; // IDs of favorite dining locations
  lastLogin: string;
}

export interface UserMealHistory {
  id: string;
  userId: string;
  dishId: string;
  date: string;
  mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  carbonFootprint: number;
  rating: number; // 1-5 scale
  feedback?: string;
}

export interface UserWasteContribution {
  id: string;
  userId: string;
  date: string;
  locationId: string;
  wasteType: string;
  quantity: number; // in kg
  disposalMethod: "Compost" | "Landfill" | "Donation";
  notes?: string;
}

// Mock data for users
export const users: User[] = [
  {
    id: "1",
    username: "john_doe",
    email: "john.doe@university.edu",
    role: "Student",
    name: "John Doe",
    carbonFootprint: 45.2,
    mealPreferences: ["1", "3", "7"], // IDs of preferred dishes
    dietaryRestrictions: ["Gluten-Free"],
    favoriteLocations: ["1", "2"],
    lastLogin: "2024-04-20T10:30:00Z"
  },
  {
    id: "2",
    username: "jane_smith",
    email: "jane.smith@university.edu",
    role: "Staff",
    name: "Jane Smith",
    carbonFootprint: 38.7,
    mealPreferences: ["2", "4", "8"],
    dietaryRestrictions: ["Vegetarian"],
    favoriteLocations: ["2", "3"],
    lastLogin: "2024-04-20T09:15:00Z"
  },
  {
    id: "3",
    username: "admin_user",
    email: "admin@university.edu",
    role: "Admin",
    name: "Admin User",
    carbonFootprint: 42.1,
    mealPreferences: ["1", "5", "9"],
    dietaryRestrictions: [],
    favoriteLocations: ["1", "3", "4"],
    lastLogin: "2024-04-20T08:00:00Z"
  }
];

// Mock data for user meal history
export const userMealHistory: UserMealHistory[] = [
  {
    id: "1",
    userId: "1",
    dishId: "1",
    date: "2024-04-19",
    mealType: "Lunch",
    carbonFootprint: 0.7,
    rating: 5,
    feedback: "Great healthy option!"
  },
  {
    id: "2",
    userId: "1",
    dishId: "3",
    date: "2024-04-19",
    mealType: "Dinner",
    carbonFootprint: 0.9,
    rating: 4,
    feedback: "Filling and delicious"
  },
  {
    id: "3",
    userId: "2",
    dishId: "2",
    date: "2024-04-19",
    mealType: "Lunch",
    carbonFootprint: 1.2,
    rating: 5,
    feedback: "Perfect balance of flavors"
  }
];

// Mock data for user waste contributions
export const userWasteContributions: UserWasteContribution[] = [
  {
    id: "1",
    userId: "1",
    date: "2024-04-19",
    locationId: "1",
    wasteType: "Food Scraps",
    quantity: 0.5,
    disposalMethod: "Compost",
    notes: "Lunch leftovers"
  },
  {
    id: "2",
    userId: "2",
    date: "2024-04-19",
    locationId: "2",
    wasteType: "Packaging",
    quantity: 0.3,
    disposalMethod: "Landfill",
    notes: "Takeout container"
  }
]; 