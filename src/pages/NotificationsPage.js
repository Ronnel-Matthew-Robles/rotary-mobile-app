import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Button, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const NotificationsScreen = ({ notifs }) => {
    const [notifications, setNotifications] = useState([]);
    const [unseenCount, setUnseenCount] = useState(0);
  
    useEffect(() => {
      const loadNotifications = async () => {
        const response = await axios.get('https://rotary-ams.site/api/notifications');
        const allNotifications = response.data.notifications;
  
        if (allNotifications) {
            // Sort notifications by date in descending order (newest first)
            const sortedNotifications = allNotifications.sort(
              (a, b) => new Date(b.date) - new Date(a.date)
            );
      
            setNotifications(sortedNotifications);
      
            // Calculate the number of unseen notifications
            const unseenCount = sortedNotifications.reduce(
              (count, notification) => (notification.seen ? count : count + 1),
              0
            );
            setUnseenCount(unseenCount);
        }

        await markNotificationsToBeSeen();
      };

      const markNotificationsToBeSeen = async () => {
        try {
          const response = await axios.put('https://rotary-ams.site/api/notifications/mark-as-seen');
        } catch (e) {
          console.log('Having problems marking the notifications as seen');
        }
      }
  
      loadNotifications();
    }, []);
  
    const clearNotifications = async () => {
      try {
        // Show a confirmation alert
        Alert.alert(
          'Clear Notifications',
          'Are you sure you want to clear all notifications?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: async () => {
                // User confirmed, proceed to clear notifications
                await axios.delete('https://rotary-ams.site/api/notifications/clear-seen');
                const response = await axios.get('https://rotary-ams.site/api/notifications');
                const unseenNotifications = response.data.notifications;
                setNotifications(unseenNotifications);
                setUnseenCount(0);
              },
            },
          ]
        );
      } catch (e) {
        console.log('Something went wrong clearing the notifications');
      }
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
                    <View style={styles.notificationMessageContainer}>
                      <Text style={styles.notificationTitle}>
                      {item.title}
                      </Text>
                      <Text style={styles.notificationMessage}>
                          {item.body}
                      </Text>
                      <Text style={styles.notificationMessage}>
                          {item.sent_at}
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
      flexWrap: 'wrap', // Allow text to wrap
    },
    notificationMessageContainer: {
      flex: 1, // Allow the container to grow vertically
    },
    notificationTitle: {
      fontWeight: 'bold', // Set the fontWeight to bold
    }
  };
  
  export default NotificationsScreen;
