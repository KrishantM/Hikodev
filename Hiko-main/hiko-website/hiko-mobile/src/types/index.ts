export interface Trail {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  distance: number; // in km
  duration: number; // in hours
  elevation: number; // in meters
  location: {
    latitude: number;
    longitude: number;
  };
  region: string;
  images: string[];
  features: string[];
  rating: number;
  reviews: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  completedTrails: string[];
  favoriteTrails: string[];
}

export interface Hike {
  id: string;
  trailId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  distance: number;
  duration: number;
  photos: string[];
  notes: string;
  rating?: number;
}
