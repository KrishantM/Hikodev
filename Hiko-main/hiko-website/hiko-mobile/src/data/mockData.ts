import { Trail, User } from '../types';

export const mockTrails: Trail[] = [
  {
    id: '1',
    name: 'Tongariro Alpine Crossing',
    description: 'One of New Zealand\'s most spectacular day walks, featuring volcanic landscapes, emerald lakes, and stunning alpine scenery.',
    difficulty: 'hard',
    distance: 19.4,
    duration: 7,
    elevation: 1960,
    location: {
      latitude: -39.2027,
      longitude: 175.5622
    },
    region: 'Central Plateau',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1464822759844-d150baec2b4e?w=800'
    ],
    features: ['Volcanic landscapes', 'Emerald lakes', 'Alpine views', 'World Heritage Site'],
    rating: 4.8,
    reviews: 1247
  },
  {
    id: '2',
    name: 'Milford Track',
    description: 'The "finest walk in the world" - a 4-day journey through Fiordland\'s pristine wilderness.',
    difficulty: 'hard',
    distance: 53.5,
    duration: 96,
    elevation: 1154,
    location: {
      latitude: -44.9000,
      longitude: 167.9167
    },
    region: 'Fiordland',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1464822759844-d150baec2b4e?w=800'
    ],
    features: ['Rainforest', 'Glacier views', 'Waterfalls', 'Wildlife'],
    rating: 4.9,
    reviews: 892
  },
  {
    id: '3',
    name: 'Hooker Valley Track',
    description: 'An easy walk offering spectacular views of Aoraki/Mount Cook and the Hooker Glacier.',
    difficulty: 'easy',
    distance: 10,
    duration: 3,
    elevation: 100,
    location: {
      latitude: -43.7333,
      longitude: 170.1000
    },
    region: 'Canterbury',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1464822759844-d150baec2b4e?w=800'
    ],
    features: ['Mountain views', 'Glacier', 'Easy access', 'Family friendly'],
    rating: 4.7,
    reviews: 2156
  },
  {
    id: '4',
    name: 'Roys Peak Track',
    description: 'A challenging climb to one of New Zealand\'s most photographed viewpoints.',
    difficulty: 'hard',
    distance: 16,
    duration: 6,
    elevation: 1578,
    location: {
      latitude: -44.6667,
      longitude: 169.2833
    },
    region: 'Otago',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1464822759844-d150baec2b4e?w=800'
    ],
    features: ['Panoramic views', 'Lake Wanaka', 'Instagram famous', 'Challenging climb'],
    rating: 4.6,
    reviews: 1834
  },
  {
    id: '5',
    name: 'Abel Tasman Coast Track',
    description: 'A stunning coastal walk through golden beaches and native bush.',
    difficulty: 'medium',
    distance: 60,
    duration: 72,
    location: {
      latitude: -40.8333,
      longitude: 173.0000
    },
    region: 'Tasman',
    elevation: 300,
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1464822759844-d150baec2b4e?w=800'
    ],
    features: ['Golden beaches', 'Native bush', 'Coastal views', 'Wildlife'],
    rating: 4.8,
    reviews: 1456
  }
];

export const mockUser: User = {
  id: '1',
  name: 'Krishant',
  email: 'krishant@hiko.org.nz',
  completedTrails: ['3', '5'],
  favoriteTrails: ['1', '4']
};
