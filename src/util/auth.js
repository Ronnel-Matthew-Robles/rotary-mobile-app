// auth.js

import * as Keychain from '@react-native-keychain';

const TOKEN_KEY = 'auth_token';

export const saveAuthToken = async (token) => {
  try {
    await Keychain.setInternetCredentials(TOKEN_KEY, TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const getAuthToken = async () => {
  try {
    const credentials = await Keychain.getInternetCredentials(TOKEN_KEY);
    if (credentials) {
      return credentials.password;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

export const removeAuthToken = async () => {
  try {
    await Keychain.resetInternetCredentials(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};
