import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AchievementSectionProps {
  onImagePress?: () => void;
}

const AchievementSection: React.FC<AchievementSectionProps> = ({ onImagePress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageContainer} onPress={onImagePress}>
        {/* This would be a real image in production */}
        <View style={styles.imagePlaceholder}>
          <View style={styles.mountainBackground}>
            {/* Mountain silhouette */}
            <View style={styles.mountain1} />
            <View style={styles.mountain2} />
            <View style={styles.mountain3} />
          </View>
          
          {/* Person silhouette */}
          <View style={styles.person}>
            <View style={styles.personBody} />
            <View style={styles.personHead} />
            <View style={styles.personArms} />
          </View>
          
          {/* Achievement overlay */}
          <View style={styles.achievementOverlay}>
            <View style={styles.achievementBadge}>
              <Ionicons name="trophy" size={20} color="#FFD700" />
            </View>
            <Text style={styles.achievementText}>Trail Master!</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 200,
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky blue
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mountainBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  mountain1: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    width: '30%',
    height: '80%',
    backgroundColor: '#8B4513', // Brown mountain
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  mountain2: {
    position: 'absolute',
    bottom: 0,
    left: '40%',
    width: '25%',
    height: '100%',
    backgroundColor: '#A0522D', // Darker brown
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  mountain3: {
    position: 'absolute',
    bottom: 0,
    right: '10%',
    width: '35%',
    height: '70%',
    backgroundColor: '#654321', // Darkest brown
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  person: {
    position: 'absolute',
    bottom: '20%',
    alignItems: 'center',
  },
  personBody: {
    width: 8,
    height: 20,
    backgroundColor: '#333',
    borderRadius: 4,
  },
  personHead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFDBAC', // Skin color
    marginBottom: 2,
  },
  personArms: {
    position: 'absolute',
    top: 2,
    left: -6,
    right: -6,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
  },
  achievementOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    alignItems: 'center',
  },
  achievementBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  achievementText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default AchievementSection;
