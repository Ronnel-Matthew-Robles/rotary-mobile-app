// src/pages/QRCodePage.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

const QRCodePage = () => {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Retrieve user data from storage
    retrieveUserData();
  }, []);

  const retrieveUserData = async () => {
    try {
      const user = await AsyncStorage.getItem("user");


      if (user !== null) {
        const parsedUser = JSON.parse(user);
        setUserId(parsedUser.id + "");
        setUsername(parsedUser.username);
      }
    } catch (error) {
      console.log("Error retrieving user data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My QR Code</Text>
      {userId ? (
        <QRCode size={300} value={userId} />
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
      <Text style={styles.qrCode}>User ID: {userId}</Text>
      <Text style={styles.qrCode}>Username: {username}</Text>
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#06478F",
  },
  loadingText: {
    fontSize: 16,
    color: "#06478F",
    marginTop: 50,
  },
  qrCode: {
    fontSize: 16,
    color: "#06478F",
    marginTop: 16,
  },
});

export default QRCodePage;
