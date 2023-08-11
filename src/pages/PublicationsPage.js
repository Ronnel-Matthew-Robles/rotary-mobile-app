import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Platform, Linking, Dimensions } from "react-native";
// import { FontAwesome5 } from "@expo/vector-icons";
import { WebView } from 'react-native-webview';
import axios from "axios";

const PublicationsPage = () => {
  const [publications, setPublications] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const numColumns = 1; // Number of columns in the grid

  useEffect(() => {
    // Fetch the list of publications from the /magazines endpoint
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await axios("https://rotary-ams.site/api/magazines");
      const data = await response.data;
      setPublications(data.data);
    } catch (error) {
      console.log("Error fetching publications:", error);
    }
  };

  const renderPublicationItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => openPdf(item.pdf_url)}>
        <View style={styles.itemContainer}>
          <View style={styles.thumbnailContainer}>
            {item.thumbnail_url ? (
              <Image style={styles.thumbnail} source={{ uri: item.thumbnail_url }} />
            ) : (
              <View style={styles.placeholderThumbnail} />
            )}
          </View>
          <View style={styles.itemDetails}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemIssue}>Issue: {item.issue}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const PdfReader = ({ url: uri }) => {
      return (<WebView style={{ flex: 1 }} source={{ uri }} />);
  }

  const openPdf = async (url) => {
    if (Platform.OS === 'ios') {
      // Display the PDF viewer with the selected URL
      setSelectedPdf(url);
    } else {
      const supported = await Linking.canOpenURL(url);
    
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log(`Don't know how to open this URL: ${uri}`);
      }
    }
  };

  const handleBack = () => {
    // Close the PDF viewer
    setSelectedPdf(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Releases</Text>
      {selectedPdf ? (
        <View style={{ flex: 1 }}>
          <PdfReader url={selectedPdf} />
          <TouchableOpacity onPress={handleBack}>
            <Text style={styles.backButton}>Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={publications}
          renderItem={renderPublicationItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

const windowWidth = Dimensions.get("window").width;
const itemWidth = windowWidth / 2 - 20; // Subtract padding to get correct item width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#06478F",
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#EAEAEA",
    overflow: "hidden", // Clip the shadow and prevent content from overflowing
  },
  thumbnailContainer: {
    width: itemWidth,
    height: itemWidth,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginRight: 10,
  },
  thumbnail: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  placeholderThumbnail: {
    width: "80%",
    height: "80%",
    backgroundColor: "#EAEAEA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#06478F",
  },
  itemIssue: {
    fontSize: 14,
    color: "#666",
  },
  backButton: {
    fontSize: 16,
    color: "#06478F",
    marginTop: 16,
  },
  flatListContent: {
    paddingBottom: 100, // Add some padding for pagination
  },
});

export default PublicationsPage;
