import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SocialFeedProps {
  onMessagePress?: () => void;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ onMessagePress }) => {
  return (
    <View style={styles.container}>
      {/* Header with Title and Friend Avatars */}
      <View style={styles.header}>
        <Text style={styles.title}>Friends are hiking</Text>
        <View style={styles.avatarGroup}>
          {/* Friend Avatars */}
          <View style={[styles.avatar, styles.avatar1]}>
            <Ionicons name="person" size={16} color="#9C27B0" />
          </View>
          <View style={[styles.avatar, styles.avatar2]}>
            <Ionicons name="person" size={16} color="#FF9800" />
          </View>
          <View style={[styles.avatar, styles.avatar3]}>
            <Ionicons name="person" size={16} color="#FFD700" />
          </View>
          <View style={styles.moreAvatar}>
            <Ionicons name="add" size={16} color="white" />
          </View>
        </View>
      </View>

      {/* Activity Feed */}
      <View style={styles.activityContainer}>
        <Text style={styles.activityText}>Sophie completed Tongariro Crossing!</Text>
        
        {/* Message Input */}
        <TouchableOpacity style={styles.messageInput} onPress={onMessagePress}>
          <Text style={styles.messagePlaceholder}>Message Sophie...</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#2E7D32', // Green background to match Figma
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
    borderWidth: 2,
    borderColor: 'white',
  },
  avatar1: {
    marginLeft: 0,
    backgroundColor: '#E1BEE7', // Light purple
  },
  avatar2: {
    backgroundColor: '#FFE0B2', // Light orange
  },
  avatar3: {
    backgroundColor: '#FFF9C4', // Light yellow
  },
  moreAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
    borderWidth: 2,
    borderColor: 'white',
  },
  activityContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  activityText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
  },
  messageInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messagePlaceholder: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default SocialFeed;
