// src/pages/LoginPage.js
import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const LoginPage = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://rotary-ams.site/api/login", {
        username,
        password,
      });

      if (response.status === 200) {
        const { token, user } = response.data;

        // Save the token and user data to the device's storage
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));

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
      console.log("Error occurred during login:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} color="#FBA418" />
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
  input: {
    width: "100%",
    height: 40,
    borderColor: "#06478F",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    color: "#06478F",
  },
  errorText: {
    color: "red",
    marginTop: 8,
  },
});

export default LoginPage;
