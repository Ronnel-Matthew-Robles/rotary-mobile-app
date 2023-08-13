// src/pages/HomePage.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Linking, Image } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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
      await AsyncStorage.removeItem("token");

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

  const handleNotifications = () => {
    // Navigate to the QR code page for the current user
    navigation.navigate("Notifications");
  };

  const handleShowQRCode = () => {
    // Navigate to the QR code page for the current user
    navigation.navigate("QRCode");
  };

  const handleScanQRCode = () => {
    // Navigate to the QR code scanning page
    navigation.navigate("ScanQRCode");
  };

  const handlePublications = () => {
    // Navigate to the QR code scanning page
    navigation.navigate("Publications");
  };

  const handleFinancialStatements = async () => {
    navigation.navigate("FinancialStatements")
  };

  const handleAttendanceSheet = async () => {
    navigation.navigate("AttendanceSheet")
  };

  return (
    <View style={styles.container}>
      {/* Add your logo or any other relevant images here */}
      <Image source={require('../../assets/favicon.png')} style={styles.logo} />
          <TouchableOpacity style={styles.notificationsButton} onPress={() => handleNotifications()}>
          <FontAwesome5 name="bell" size={24} color="#FFF" />
          </TouchableOpacity>
      <Text style={styles.welcomeText}>
        Welcome, {currentUser?.username}!
      </Text>
      <View style={styles.featuresContainer}>
        <Text style={styles.featuresText}>Features:</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleShowQRCode}>
            <FontAwesome5 name={"qrcode"} size={24} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Show My QR Code</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleAttendanceSheet}>
            <FontAwesome5 name={"sticky-note"} size={24} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Attendance Sheet</Text>
          </TouchableOpacity>
          {currentUser?.role === "admin" && (
            <TouchableOpacity style={styles.button} onPress={handleScanQRCode}>
              <FontAwesome5 name={"camera"} size={24} color="#FFF" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Scan QR Code</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={handlePublications}>
            <FontAwesome5 name={"newspaper"} size={24} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Publications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleFinancialStatements}>
            <MaterialIcons name={"attach-money"} size={24} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Financial Statements</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
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
  logo: {
    width: 150,
    height: 150,
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },
  featuresContainer: {
    width: "100%",
    alignItems: "center",
  },
  featuresText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FBA418",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FBA418",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  notificationsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#FBA418', // Adjust to your color
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default HomePage;
