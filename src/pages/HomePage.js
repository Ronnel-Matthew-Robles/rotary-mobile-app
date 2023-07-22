// src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomePage = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from storage
    retrieveUserData();
  }, []);

  const retrieveUserData = async () => {
    try {
      const user = await AsyncStorage.getItem("user");

      if (user !== null) {
        setCurrentUser(JSON.parse(user));
      }
    } catch (error) {
      console.log("Error retrieving user data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear user data from storage
      await AsyncStorage.removeItem("user");

      // Navigate back to the login page
      // navigation.navigate("Login");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log("Error occurred during logout:", error);
    }
  };

  const handleShowQRCode = () => {
    // Navigate to the QR code page for the current user
    navigation.navigate("QRCode");
  };

  const handleScanQRCode = () => {
    // Navigate to the QR code scanning page
    navigation.navigate("ScanQRCode");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Welcome to the Home Page, {currentUser?.username}!
      </Text>
      <Text style={styles.featuresText}>Features:</Text>
      <Button
        title="Show My QR Code"
        onPress={handleShowQRCode}
        color="#FBA418"
      />
      {currentUser?.role === "admin" && (
        <Button
          title="Scan QR Code"
          onPress={handleScanQRCode}
          color="#FBA418"
        />
      )}
      <Button title="Logout" onPress={handleLogout} color="#FBA418" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#06478F",
  },
  featuresText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#06478F",
  },
});

export default HomePage;
