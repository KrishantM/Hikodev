import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import BestPick from '../components/BestPick';
import SocialFeed from '../components/SocialFeed';
import AchievementSection from '../components/AchievementSection';

const HomeScreen: React.FC = () => {
  const handleChatPress = () => {
    console.log('Chat pressed');
  };

  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  const handleInviteFriends = () => {
    console.log('Invite friends pressed');
  };

  const handleAddToHikes = () => {
    console.log('Add to hikes pressed');
  };

  const handleSeeMore = () => {
    console.log('See more pressed');
  };

  const handleMessagePress = () => {
    console.log('Message pressed');
  };

  const handleImagePress = () => {
    console.log('Achievement image pressed');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header 
        onChatPress={handleChatPress}
        onProfilePress={handleProfilePress}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Best Pick Section */}
        <BestPick
          onInviteFriends={handleInviteFriends}
          onAddToHikes={handleAddToHikes}
          onSeeMore={handleSeeMore}
        />
        
        {/* Social Feed Section */}
        <SocialFeed onMessagePress={handleMessagePress} />
        
        {/* Achievement Section */}
        <AchievementSection onImagePress={handleImagePress} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E7D32', // Green background for header area
  },
  content: {
    flex: 1,
    backgroundColor: '#2E7D32', // Keep green background throughout
  },
});

export default HomeScreen;
