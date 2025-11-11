import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Trail } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface TrailCardProps {
  trail: Trail;
  onPress: (trail: Trail) => void;
}

const TrailCard: React.FC<TrailCardProps> = ({ trail, onPress }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#757575';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(trail)}>
      <Image source={{ uri: trail.images[0] }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>{trail.name}</Text>
          <View style={[styles.difficulty, { backgroundColor: getDifficultyColor(trail.difficulty) }]}>
            <Text style={styles.difficultyText}>{trail.difficulty.toUpperCase()}</Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>{trail.description}</Text>
        
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Ionicons name="walk" size={16} color="#666" />
            <Text style={styles.statText}>{trail.distance}km</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="time" size={16} color="#666" />
            <Text style={styles.statText}>{trail.duration}h</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="trending-up" size={16} color="#666" />
            <Text style={styles.statText}>{trail.elevation}m</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{trail.rating}</Text>
            <Text style={styles.reviewsText}>({trail.reviews})</Text>
          </View>
          <Text style={styles.region}>{trail.region}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  difficulty: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewsText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  region: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});

export default TrailCard;
