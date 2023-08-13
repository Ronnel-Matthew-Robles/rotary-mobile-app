import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Platform, Linking, Dimensions, Modal } from "react-native";
import { Picker } from '@react-native-picker/picker';
// import { FontAwesome5 } from "@expo/vector-icons";
import { WebView } from 'react-native-webview';
import axios from "axios";

const PublicationsPage = () => {
  const [publications, setPublications] = useState([]);
  const [allPublications, setAllPublications] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const numColumns = 1; // Number of columns in the grid
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    // Fetch the list of publications from the /magazines endpoint
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await axios("https://rotary-ams.site/api/magazines");
      const data = await response.data;
      setPublications(data.data);
      setAllPublications(data.data);
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

  const handleFilter = async () => {
    setShowFilterModal(false);
    try {
      // Convert selectedMonth and selectedYear to numbers
      const month = parseInt(selectedMonth);
      const year = parseInt(selectedYear);
  
      // Filter publications based on selectedMonth and selectedYear
      const filteredPublications = allPublications.filter(
        (item) =>
          (!selectedMonth || new Date(item.issue).getMonth() + 1 === month) &&
          (!selectedYear || new Date(item.issue).getFullYear() === year)
      );
      setPublications(filteredPublications);
    } catch (e) {
      console.log(e)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Releases</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>
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
            <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Picker
              style={styles.picker}
              selectedValue={selectedMonth}
              onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            >
              <Picker.Item label="Select Month" value="" />
              <Picker.Item label="January" value="1" />
              <Picker.Item label="February" value="2" />
              <Picker.Item label="March" value="3" />
              <Picker.Item label="April" value="4" />
              <Picker.Item label="May" value="5" />
              <Picker.Item label="June" value="6" />
              <Picker.Item label="July" value="7" />
              <Picker.Item label="August" value="8" />
              <Picker.Item label="September" value="9" />
              <Picker.Item label="October" value="10" />
              <Picker.Item label="November" value="11" />
              <Picker.Item label="December" value="12" />
              {/* ... Repeat for other months ... */}
            </Picker>
            <Picker
              style={styles.picker}
              selectedValue={selectedYear}
              onValueChange={(itemValue) => setSelectedYear(itemValue)}
            >
              <Picker.Item label="Select Year" value="" />
              <Picker.Item label="2023" value="2023" />
              <Picker.Item label="2022" value="2022" />
              {/* ... Repeat for other years ... */}
            </Picker>
            <TouchableOpacity style={styles.applyButton} onPress={handleFilter}>
              <Text style={styles.applyButtonText}>Apply Filter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  filterButton: {
    backgroundColor: '#FBA418',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  filterButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 10,
  },
  applyButton: {
    backgroundColor: '#FBA418',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginBottom: 8,
  },
  applyButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#EAEAEA',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
});

export default PublicationsPage;
