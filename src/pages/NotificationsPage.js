import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";

const NotificationsScreen = ({ notifs }) => {
    const [notifications, setNotifications] = useState([]);
    const [unseenCount, setUnseenCount] = useState(0);
  
    useEffect(() => {
      const loadNotifications = async () => {
        const allNotifs = await AsyncStorage.getItem('notifications');
        const allNotifications = JSON.parse(allNotifs);
  
        if (allNotifications) {
            // Sort notifications by date in descending order (newest first)
            const sortedNotifications = allNotifications.sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            );
      
            setNotifications(sortedNotifications);
      
            // Mark all notifications as seen when user visits the screen
            const updatedNotifications = sortedNotifications.map((notification) => ({
              ...notification,
              seen: true,
            }));
      
            AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      
            // Calculate the number of unseen notifications
            const unseenCount = sortedNotifications.reduce(
              (count, notification) => (notification.seen ? count : count + 1),
              0
            );
            setUnseenCount(unseenCount);
        }
      };
  
      loadNotifications();
    }, []);
  
    const clearNotifications = async () => {
      // Filter out notifications that are seen
      const unseenNotifications = notifications.filter(item => !item.seen);
    
      // Update AsyncStorage and state
      await AsyncStorage.setItem('notifications', JSON.stringify(unseenNotifications));
      setNotifications(unseenNotifications);
      setUnseenCount(0);
    };
    
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/favicon.png')} // Replace with your logo image
            style={styles.logo}
          />
          <Text style={styles.title}>
            Notifications{' '}
            {unseenCount > 0 && (
              <Text style={styles.unseenCount}>{unseenCount}</Text>
            )}
          </Text>
          <Button title="Clear" onPress={clearNotifications} />
        </View>
        <FlatList
            data={notifications}
            renderItem={({ item }) => (
                <TouchableOpacity
                style={[
                    styles.notificationItem,
                    item.seen ? null : styles.unseenNotification,
                ]}
                onPress={() => {
                    // Navigate or handle notification press here
                }}
                >
                <View style={styles.notificationHeader}>
                    <Image
                    source={require('../../assets/favicon.png')} // Replace with your logo image
                    style={styles.notificationLogo}
                    />
                    <View>
                    <Text style={styles.notificationTitle}>
                    {item.request.content.title}
                    </Text>
                    <Text style={styles.notificationMessage}>
                        {item.request.content.body}
                    </Text>
                    <Text style={styles.notificationMessage}>
                        {new Date(item.date).toLocaleString()}
                    </Text>
                    </View>
                </View>
                {/* Display date or other information */}
                </TouchableOpacity>
            )}
          key={(item) => item.identifier}
        />
      </View>
    );
  };
  
  const styles = {
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#FFF',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    logo: {
      width: 30,
      height: 30,
      marginRight: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#06478F',
    },
    unseenCount: {
      color: 'red', // Change to your preferred color
      fontSize: 16,
    },
    notificationItem: {
        padding: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        borderRadius: 8,
        },
        unseenNotification: {
        backgroundColor: '#F5F5F5', // Change to your preferred color
        },
        notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
        },
        notificationLogo: {
        width: 50,
        height: 50,
        marginRight: 8,
        },
    notificationMessage: {
      fontSize: 14,
      color: '#666',
    },
  };
  
  export default NotificationsScreen;
