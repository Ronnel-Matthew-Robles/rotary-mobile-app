// src/pages/LoginPage.js
import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
// import { AntDesign } from '@expo/vector-icons';
// import { MaterialIcons } from '@expo/vector-icons';

const LoginPage = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [expoToken, setExpoToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    checkAuthToken();
  }, []);

  const checkAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const expoToken = await AsyncStorage.getItem("expoToken");

      // Set the authorization header for all subsequent Axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setExpoToken(expoToken);

      if (token) {
        // The user is logged in, proceed with the app flow
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }
    } catch (error) {
      console.log("Error retrieving token data:", error);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      console.log(expoToken)
      const response = await axios.post("https://rotary-ams.site/api/login", {
        username,
        password,
        expoToken
      });
      // console.log(response)
      if (response.status === 200) {
        const { token, user } = response.data;

        // Save the token and user data to the device's storage
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

        // Set the authorization header for all subsequent Axios requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // // Assuming successful login, navigate to the home page
        // navigation.navigate("Home");
        
        // Reset the navigation stack to only contain the Home screen
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      // console.log("Error occurred during login:", error);
      setError(error.response.data.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/favicon.png')} style={styles.logo} />
      <View style={styles.inputContainer}>
        {/* <AntDesign name="user" size={24} color="#06478F" style={styles.icon} /> */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        {/* <MaterialIcons name="lock" size={24} color="#06478F" style={styles.icon} /> */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 40,
    borderColor: "#06478F",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
  },
  icon: {
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#06478F",
  },
  button: {
    width: "100%", // Extend the button to fill the width
    backgroundColor: "#FBA418",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center", // Center the text inside the button
  },
  errorText: {
    color: "red",
    marginTop: 8,
  },
});

export default LoginPage;
