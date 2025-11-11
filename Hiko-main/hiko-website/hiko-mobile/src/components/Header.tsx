import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  onChatPress?: () => void;
  onProfilePress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onChatPress, onProfilePress }) => {
  return (
    <View style={styles.container}>
      {/* Header Content */}
      <View style={styles.headerContent}>
        {/* Left - Chat Icon with Notification */}
        <TouchableOpacity style={styles.chatButton} onPress={onChatPress}>
          <Ionicons name="chatbubble-outline" size={24} color="white" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>

        {/* Center - Logo and Title */}
        <View style={styles.logoContainer}>
          <View style={styles.mountainIcon}>
            <Ionicons name="mountain" size={24} color="white" />
          </View>
          <Text style={styles.appTitle}>Hiko</Text>
        </View>

        {/* Right - Profile Avatar */}
        <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={20} color="#E91E63" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2E7D32', // Green background
    paddingTop: 44, // Status bar height
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    height: 60,
  },
  chatButton: {
    position: 'relative',
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700', // Gold notification dot
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mountainIcon: {
    marginRight: 8,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileButton: {
    padding: 4,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;
