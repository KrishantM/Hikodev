import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BestPickProps {
  onInviteFriends?: () => void;
  onAddToHikes?: () => void;
  onSeeMore?: () => void;
}

const BestPick: React.FC<BestPickProps> = ({ 
  onInviteFriends, 
  onAddToHikes, 
  onSeeMore 
}) => {
  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Best Pick for This Weekend</Text>
      
      {/* Map Container */}
      <View style={styles.mapContainer}>
        {/* Map Background - This would be a real map component in production */}
        <View style={styles.mapBackground}>
          {/* Map Labels */}
          <View style={styles.mapLabels}>
            <Text style={[styles.mapLabel, styles.pukepoto]}>Pukepoto</Text>
            <Text style={[styles.mapLabel, styles.okahu]}>Okahu</Text>
            <Text style={[styles.mapLabel, styles.kaitaia]}>Kaitaia</Text>
            <Text style={[styles.mapLabel, styles.herekino]}>Herekino Forest</Text>
          </View>
          
          {/* Trail Lines */}
          <View style={styles.trailLines}>
            <View style={[styles.trailLine, styles.trail1]} />
            <View style={[styles.trailLine, styles.trail2]} />
            <View style={[styles.trailLine, styles.trail3]} />
          </View>
          
          {/* Marker */}
          <View style={styles.marker}>
            <Text style={styles.markerText}>1</Text>
          </View>
        </View>
        
        {/* Trail Details Overlay */}
        <View style={styles.detailsOverlay}>
          <Text style={styles.trailName}>Herekino Forest</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>Duration: 2 hours</Text>
            <Text style={styles.detailText}>Difficulty: Beginner</Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>Forecast: 20°C, Sunny</Text>
            <Text style={styles.detailText}>Features: Home to many rare species</Text>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.inviteButton} onPress={onInviteFriends}>
              <Text style={styles.inviteButtonText}>Invite Friends</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={onAddToHikes}>
              <Text style={styles.addButtonText}>Add to Hikes</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={onSeeMore}>
            <Text style={styles.seeMoreText}>See More...</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700', // Gold color
    marginBottom: 16,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#1B5E20', // Dark green for forest
    position: 'relative',
  },
  mapLabels: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapLabel: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  pukepoto: {
    bottom: 20,
    left: 20,
  },
  okahu: {
    top: '50%',
    right: 40,
  },
  kaitaia: {
    top: 20,
    right: 20,
  },
  herekino: {
    bottom: 40,
    left: 20,
    fontSize: 14,
    fontWeight: 'bold',
  },
  trailLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  trailLine: {
    position: 'absolute',
    backgroundColor: '#FFD700',
    height: 2,
  },
  trail1: {
    top: '30%',
    left: '20%',
    width: '60%',
  },
  trail2: {
    top: '60%',
    left: '10%',
    width: '40%',
  },
  trail3: {
    top: '40%',
    right: '20%',
    width: '30%',
  },
  marker: {
    position: 'absolute',
    top: '45%',
    right: '35%',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5722',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  trailName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  inviteButton: {
    flex: 1,
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  seeMoreText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default BestPick;
